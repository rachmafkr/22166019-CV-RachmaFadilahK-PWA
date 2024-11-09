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
    e.preventDefault(); // Mencegah prompt default dari browser
    deferredPrompt = e; // Simpan event prompt untuk digunakan nanti

    // Buat tombol pemasangan aplikasi
    const installButton = document.createElement('button');
    installButton.textContent = 'Install Aplikasi';
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
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Pengguna setuju untuk menginstal aplikasi.');
                } else {
                    console.log('Pengguna menolak instalasi aplikasi.');
                }
                // Reset dan hapus tombol install setelah dipilih
                deferredPrompt = null;
                installButton.remove();
            });
        }
    });
});

// Periksa apakah elemen dengan ID 'allowNotification' ada sebelum menambahkan event listener
const allowNotificationButton = document.getElementById('allowNotification');
if (allowNotificationButton) {
    allowNotificationButton.addEventListener('click', function() {
        // Minta izin notifikasi
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log("Izin notifikasi diberikan.");
                    // Tampilkan notifikasi setelah izin diberikan
                    showNotification();
                } else {
                    console.log("Izin notifikasi ditolak.");
                }
            });
        } else {
            console.log("Izin notifikasi sudah ada: " + Notification.permission);
            if (Notification.permission === 'granted') {
                showNotification();
            }
        }
    });
}

// Fungsi untuk menampilkan notifikasi
function showNotification() {
    const options = {
        body: "Selamat datang di Teluk Randai! Jelajahi portofolio saya. Terima kasih sudah berkunjung!",
        icon: "images/logo.png"
    };
    if (Notification.permission === "granted") {
        new Notification("Notifikasi Teluk Randai", options);
    }
}
