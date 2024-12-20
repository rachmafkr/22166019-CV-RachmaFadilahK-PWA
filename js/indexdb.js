document.addEventListener("DOMContentLoaded", function() {
    var request = indexedDB.open("ContactDatabase", 1);

    // Meminta izin notifikasi ketika halaman dimuat
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Izin notifikasi diberikan.");
            } else if (permission === "denied") {
                console.warn("Izin notifikasi ditolak oleh pengguna.");
            } else {
                console.warn("Izin notifikasi tidak ditentukan.");
            }
        });
    } else {
        console.error("Browser tidak mendukung notifikasi.");
    }

    // Event ketika database perlu diupgrade
    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("ContactStore", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("exampleInputEmail", "exampleInputEmail", { unique: false });
        objectStore.createIndex("exampleMessage", "exampleMessage", { unique: false });
    };

    // Event ketika database berhasil dibuka
    request.onsuccess = function(event) {
        var db = event.target.result;

        const komentarForm = document.getElementById("komentarForm");
        if (komentarForm) {
            komentarForm.addEventListener("submit", function(e) {
                e.preventDefault();
                var exampleInputEmail = document.getElementById("exampleInputEmail1")?.value;
                var exampleMessage = document.getElementById("exampleMessage")?.value;

                if (!exampleInputEmail || !exampleMessage) {
                    console.error("Email atau pesan tidak boleh kosong.");
                    return;
                }

                if (!db) {
                    console.error("Database tidak ditemukan!");
                    return;
                }

                var transaction = db.transaction(["ContactStore"], "readwrite");

                transaction.oncomplete = function() {
                    console.log("Komentar telah disimpan.");
                    komentarForm.reset();

                    // Menampilkan notifikasi jika pesan berhasil terkirim
                    if (Notification.permission === "granted") {
                        new Notification("Pesan Anda berhasil dikirim!");
                    } else {
                        console.warn("Notifikasi tidak muncul karena izin tidak diberikan.");
                    }
                };

                transaction.onerror = function(event) {
                    console.error("Kesalahan saat menyimpan komentar: " + event.target.error);
                };

                var objectStore = transaction.objectStore("ContactStore");
                var komentarData = {
                    exampleInputEmail: exampleInputEmail,
                    exampleMessage: exampleMessage,
                };

                var addRequest = objectStore.add(komentarData);
                addRequest.onsuccess = function() {
                    console.log("Data berhasil ditambahkan!");
                };
                addRequest.onerror = function(event) {
                    console.error("Kesalahan saat menambahkan data: " + event.target.error);
                };
            });
        } else {
            console.error("Form komentar tidak ditemukan!");
        }
    };

    request.onerror = function(event) {
        console.error("Kesalahan saat membuka database IndexedDB: " + event.target.error);
    };
});

// Fungsi untuk menyimpan email ke IndexedDB
function saveAdditionalEmail(email) {
    var request = indexedDB.open("ContactDatabase", 1);

    request.onsuccess = function(event) {
        var db = event.target.result;

        var transaction = db.transaction(["ContactStore"], "readwrite");
        var objectStore = transaction.objectStore("ContactStore");

        var emailData = {
            additionalEmail: email // Menyimpan email tambahan di dalam store yang sama
        };

        var addRequest = objectStore.add(emailData);
        addRequest.onsuccess = function() {
            console.log("Email tambahan berhasil disimpan!");
        };
        addRequest.onerror = function(event) {
            console.error("Kesalahan saat menambahkan email tambahan: " + event.target.error);
        };
    };

    request.onerror = function(event) {
        console.error("Kesalahan saat membuka database IndexedDB: " + event.target.error);
    };
}

// Menangani submit form dan menyimpan email tambahan
document.addEventListener("DOMContentLoaded", function() {
    const formGroup = document.querySelector('.form-group');
    if (formGroup) {
        formGroup.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah reload halaman
            var email = document.querySelector('#semail')?.value;
            if (email) {
                saveAdditionalEmail(email);
                document.querySelector('#semail').value = ''; // Reset input setelah submit
            } else {
                console.error("Email tidak boleh kosong.");
            }
        });
    } else {
        console.error("Elemen form-group tidak ditemukan!");
    }
});
