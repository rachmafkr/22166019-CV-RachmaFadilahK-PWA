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
        if (!komentarForm) {
            console.error("Form komentar tidak ditemukan!");
            return;
        }

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
    };

    request.onerror = function(event) {
        console.error("Kesalahan saat membuka database IndexedDB: " + event.target.error);
    };
});
