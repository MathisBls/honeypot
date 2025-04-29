setTimeout(() => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '/static/hidden.html';
    document.body.appendChild(iframe);
}, 8000);
