// Registrasi Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function(error) {
            console.error('Service Worker registration failed:', error);
        });
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Mencegah prompt default
    e.preventDefault();
    // Menyimpan event untuk digunakan nanti
    deferredPrompt = e;

    // Buat tombol pemasangan aplikasi
    const installButton = document.createElement('button');
    installButton.textContent = 'Install aplikasi ini';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '20px';
    installButton.style.right = '20px';
    installButton.style.padding = '10px 20px';
    installButton.style.backgroundColor = '#007bff';
    installButton.style.color = '#fff';
    installButton.style.border = 'none';
    installButton.style.borderRadius = '5px';
    document.body.appendChild(installButton);

    // Tangani klik pada tombol install
    installButton.addEventListener('click', () => {
        // Tampilkan prompt instalasi
        deferredPrompt.prompt();
        // Tangani pilihan pengguna
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Pengguna setuju untuk menginstal aplikasi.');
            } else {
                console.log('Pengguna menolak instalasi aplikasi.');
            }
            // Reset deferredPrompt dan hapus tombol setelah dipilih
            deferredPrompt = null;
            installButton.remove();
        });
    });
});