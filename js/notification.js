// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBWrRrWCKh1kdSzl0wmUZIQW9Zq4Lir9ds",
    authDomain: "telukrandai.firebaseapp.com",
    projectId: "telukrandai",
    storageBucket: "telukrandai.firebasestorage.app",
    messagingSenderId: "604451557738",
    appId: "1:604451557738:web:e4e25304ba913c3f979513",
    measurementId: "G-KYES9D0HJX"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Aktifkan Offline Persistence untuk Firestore
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn("Persistence hanya dapat diaktifkan pada satu tab di waktu yang sama.");
    } else if (err.code == 'unimplemented') {
        console.warn("Browser ini tidak mendukung semua fitur yang diperlukan untuk persistence.");
    }
});