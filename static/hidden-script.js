(async () => {
    console.log("🔵 Début du script furtif");

    try {
        const agent = await FingerprintJS.load(); // FingerprintJS global déjà importé
        console.log("✅ Agent Fingerprint chargé");

        const result = await agent.get();
        console.log("✅ Résultat Fingerprint récupéré :", result);

        const publicIpData = await fetch('/myip')
            .then(async res => {
                if (res.ok) {
                    return await res.json();
                } else {
                    console.error("❌ Erreur /myip :", res.status);
                    return { ip: 'Erreur IP publique' };
                }
            })
            .catch((err) => {
                console.error("❌ Erreur IP publique fetch catch:", err);
                return { ip: 'Erreur IP publique' };
            });

        console.log("✅ IP publique récupérée :", publicIpData.ip);

        async function getWebRTCIps() {
            console.log("🔵 Tentative récupération WebRTC IPs");
            return new Promise((resolve) => {
                const ips = new Set();
                const rtc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
                rtc.createDataChannel('');
                rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
                rtc.onicecandidate = event => {
                    if (event && event.candidate && event.candidate.candidate) {
                        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})|(([a-f0-9:]+:+)+[a-f0-9]+)/gi;
                        const matches = event.candidate.candidate.match(ipRegex);
                        if (matches) {
                            matches.forEach(ip => ips.add(ip));
                        }
                    } else if (event.candidate === null) {
                        rtc.close();
                        resolve(Array.from(ips));
                    }
                };
                setTimeout(() => {
                    rtc.close();
                    resolve(Array.from(ips));
                }, 5000);
            });
        }

        const localIps = await getWebRTCIps();
        console.log("✅ IPs WebRTC récupérées :", localIps);

        const payload = {
            visitorId: result.visitorId,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            platform: navigator.platform,
            publicIp: publicIpData.ip,
            localIps: localIps.length > 0 ? localIps : ['Pas de WebRTC leak']
        };

        const beacon = new Image();
        const url = `/static/logo.png?data=${encodeURIComponent(JSON.stringify(payload))}`;
        console.log("📡 Beacon URL générée :", url);
        beacon.src = url;

    } catch (error) {
        console.error('❌ Erreur fatale dans hidden-script.js:', error);
    }
})();
