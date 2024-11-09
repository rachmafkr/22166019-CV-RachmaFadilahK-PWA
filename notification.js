window.onload = () => {
  "use strict";

  let swRegistration = null;

  // Konfigurasi Firebase (jika tetap digunakan untuk registrasi)
  const firebaseConfig = {
    apiKey: "AIzaSyBWrRrWCKh1kdSzl0wmUZIQW9Zq4Lir9ds",
    authDomain: "telukrandai.firebaseapp.com",
    projectId: "telukrandai",
    storageBucket: "telukrandai.appspot.com",
    messagingSenderId: "604451557738",
    appId: "1:604451557738:web:e4e25304ba913c3f979513",
    measurementId: "G-KYES9D0HJX"
  };

  // Inisialisasi Firebase
  firebase.initializeApp(firebaseConfig);

  // Fungsi inisialisasi aplikasi
  function initializeApp() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker and Push is supported");

      // Daftarkan service worker
      navigator.serviceWorker
        .register("js/firebase-messaging-sw.js")
        .then(swReg => {
          console.log("Service Worker registered", swReg);
          swRegistration = swReg;
        })
        .catch(error => {
          console.error("Service Worker Error", error);
        });
    } else {
      console.warn("Push messaging is not supported");
    }
  }

  // Minta izin notifikasi dan tampilkan notifikasi
  function displayNotification() {
    if (!swRegistration) {
      console.error("Service Worker tidak terdaftar dengan benar.");
      return;
    }

    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showNotification();
        } else {
          alert("Anda menolak atau menutup izin notifikasi.");
        }
      });
    } else {
      alert("Anda menolak izin notifikasi. Silakan izinkan melalui pengaturan browser.");
    }
  }

  // Fungsi menampilkan notifikasi
  function showNotification() {
    const options = {
      body: "Selamat datang di Teluk Randai! Jelajahi portofolio saya. Terima kasih sudah berkunjung!",
      icon: "images/logo.png" // Pastikan path ke ikon benar
    };
    swRegistration.showNotification("Notifikasi Teluk Randai", options);
  }

  // Inisialisasi aplikasi saat halaman dimuat
  initializeApp();

  // Event listener untuk tombol "Izinkan Notifikasi"
  document.getElementById("allowNotification").addEventListener("click", displayNotification);
};
