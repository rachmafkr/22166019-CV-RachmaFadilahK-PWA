window.onload = () => {
  "use strict";

  let swRegistration = null;

  // Firebase konfigurasi
  const firebaseConfig = {
    apiKey: "AIzaSyBWrRrWCKh1kdSzl0wmUZIQW9Zq4Lir9ds",
    authDomain: "telukrandai.firebaseapp.com",
    projectId: "telukrandai",
    storageBucket: "telukrandai.firebaseapp.com",
    messagingSenderId: "604451557738",
    appId: "1:604451557738:web:e4e25304ba913c3f979513",
    measurementId: "G-KYES9D0HJX"
  };
  
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Fungsi inisialisasi aplikasi
  function initializeApp() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker and Push is supported");

      // Daftarkan service worker
      navigator.serviceWorker
        .register("firebase-messaging-sw.js")
        .then(swReg => {
          console.log("Service Worker is registered", swReg);
          swRegistration = swReg;

          // Panggil notifikasi otomatis setelah service worker terdaftar
          displayNotification();
        })
        .catch(error => {
          console.error("Service Worker Error", error);
        });
    } else {
      console.warn("Push messaging is not supported");
    }
  }
  
  // Minta izin dan tampilkan notifikasi
  function displayNotification() {
    if (window.Notification && Notification.permission === "granted") {
      notification();
    } else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission().then(status => {
        if (status === "granted") {
          notification();
        } else {
          alert("You denied or dismissed permissions to notifications.");
        }
      });
    } else {
      alert(
        "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
      );
    }
  }
  
  // Fungsi notifikasi
  function notification() {
    const options = {
      body: "Welcome to Teluk Randai! Explore my portfolio and works. Thank you for visiting!",
      icon: "images/logo.png"
    };
    swRegistration.showNotification("Teluk Randai Notification", options);
  }

  // Inisialisasi aplikasi saat halaman dimuat
  initializeApp();
};
