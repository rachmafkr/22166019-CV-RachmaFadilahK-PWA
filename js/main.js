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

// Fungsi untuk menampilkan notifikasi
function showNotification() {
    const notificationTitle = "Hi, Folks!";
    const notificationText = "Welcome to Teluk Randai! Explore my portfolio and works. Thank you for visiting!";
    
    // Membuat notifikasi
    const notification = new Notification(notificationTitle, {
      body: notificationText,
      icon: "/images/logo.png" // Ganti dengan path ikon Anda jika ada
    });
}

// Meminta izin notifikasi saat halaman dimuat
window.addEventListener('load', () => {
    // Pastikan Notification API didukung oleh browser
    if (!("Notification" in window)) {
        console.warn("Browser ini tidak mendukung Notification API.");
        return;
    }

    if (Notification.permission === 'granted') {
        // Jika izin sudah diberikan, langsung tampilkan notifikasi
        showNotification();
    } else if (Notification.permission !== 'denied') {
        // Jika belum ada izin, meminta izin notifikasi dari pengguna
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                // Jika pengguna mengizinkan, tampilkan notifikasi
                showNotification();
            }
        }).catch(error => {
            console.error("Gagal meminta izin notifikasi:", error);
        });
    }
});
