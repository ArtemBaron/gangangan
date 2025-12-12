// js/i18n-res.js

window.i18nResources = {
    en: {
        translation: {
            // Основные элементы
            "Garudar Search": "Garudar Search",
            "Bahasa": "Bahasa",
            "English": "English",
            "Login": "Login",
            "Username": "Username",
            "Password": "Password",
            "Invalid credentials": "Invalid credentials",
            "Logout": "Logout",

            //HOME
            "HOME": "HOME",

            // Поиск
            "Search": "Search...",
            "SearchButton": "Search",
            "Show All Entries": "Show All Entries",
            "Individual": "Individual",
            "Corporate": "Corporate",
            "Search All Data": "Search All Data",

            // Результаты и статусы
            "Waiting": "Waiting...",
            "Searching": "Searching...",
            "No results": "No results found",
            "Error": "Error loading data",
            "No name": "No name",

            // Редактирование записи
            "Edit": "Edit",
            "Delete": "Delete",
            "Save": "Save",
            "Cancel": "Cancel",
            "Edit Entry": "Edit Entry",
            "Are you sure you want to delete this entry?": "Are you sure you want to delete this entry?",
            "Failed to delete": "Failed to delete",
            "Error updating entry": "Error updating entry",

            // Поля формы редактирования
            "Title": "Title",
            "Full Name": "Full Name",
            "Name 1": "Name 1",
            "Name 2": "Name 2",
            "Name 3": "Name 3",
            "Name 4": "Name 4",
            "Alias": "Alias",
            "Nationality": "Nationality",
            "Passport": "Passport",
            "Identity No": "Identity No",
            "Job Title": "Job Title",
            "Date of Birth": "Date of Birth",
            "Place of Birth": "Place of Birth",
            "Address": "Address",
            "Additional Info": "Additional Info",
            "Source List": "Source List",
            "Entry Type": "Entry Type",
            "Load Date": "Load Date",

            // Детали записи
            "Back to results": "Back to results",
            "Type": "Type",
            "Source": "Source",
            "Info": "Info",

            // Администрирование
            "Import CSV": "Import CSV",
            "CSV parsing errors": "CSV parsing errors",
            "Invalid rows skipped": "Invalid rows skipped",
            "No valid records found": "No valid records found",
            "Error reading CSV": "Error reading CSV",
            "entries imported": "{{count}} entries imported successfully",

            // Управление пользователями
            "Manage Users": "Manage Users",
            "Users": "Users",
            "Add User": "Add User",
            "Edit User": "Edit User",
            "User": "User",
            "Admin": "Admin",
            "Active": "Active",
            "Are you sure you want to delete this user?": "Are you sure you want to delete this user?",
            "Loading": "Loading...",
            "Error loading users": "Error loading users",
            "Error saving user": "Error saving user",
            "Failed to delete user": "Failed to delete user"
        }
    },
    id: {
        translation: {
            // Основные элементы
            "Garudar Search": "Pencarian Garudar",
            "Bahasa": "Bahasa",
            "English": "English",
            "Login": "Masuk",
            "Username": "Nama Pengguna",
            "Password": "Kata Sandi",
            "Invalid credentials": "Kredensial tidak valid",
            "Logout": "Keluar",

            //HOME
            "HOME": "Beranda",

            // Поиск
            "Search": "Cari...",
            "SearchButton": "Cari",
            "Show All Entries": "Tampilkan Semua",
            "Individual": "Perorangan",
            "Corporate": "Perusahaan",
            "Search All Data": "Cari Semua Data",

            // Результаты и статусы
            "Waiting": "Menunggu...",
            "Searching": "Sedang mencari...",
            "No results": "Tidak ada hasil",
            "Error": "Terjadi kesalahan saat memuat data",
            "No name": "Tidak ada nama",

            // Редактирование записи
            "Edit": "Ubah",
            "Delete": "Hapus",
            "Save": "Simpan",
            "Cancel": "Batal",
            "Edit Entry": "Ubah Entri",
            "Are you sure you want to delete this entry?": "Apakah Anda yakin ingin menghapus entri ini?",
            "Failed to delete": "Gagal menghapus",
            "Error updating entry": "Terjadi kesalahan saat memperbarui entri",

            // Поля формы редактирования
            "Title": "Judul",
            "Full Name": "Nama Lengkap",
            "Name 1": "Nama 1",
            "Name 2": "Nama 2",
            "Name 3": "Nama 3",
            "Name 4": "Nama 4",
            "Alias": "Alias",
            "Nationality": "Kebangsaan",
            "Passport": "Paspor",
            "Identity No": "Nomor Identitas",
            "Job Title": "Jabatan",
            "Date of Birth": "Tanggal Lahir",
            "Place of Birth": "Tempat Lahir",
            "Address": "Alamat",
            "Additional Info": "Info Tambahan",
            "Source List": "Daftar Sumber",
            "Entry Type": "Jenis Entri",
            "Load Date": "Tanggal Dimuat",

            // Детали записи
            "Back to results": "Kembali ke hasil",
            "Type": "Jenis",
            "Source": "Sumber",
            "Info": "Info",

            // Администрирование
            "Import CSV": "Impor CSV",
            "CSV parsing errors": "Kesalahan parsing CSV",
            "Invalid rows skipped": "Baris tidak valid dilewati",
            "No valid records found": "Tidak ada data valid ditemukan",
            "Error reading CSV": "Terjadi kesalahan saat membaca file CSV",
            "entries imported": "{{count}} entri berhasil diimpor",

            // Управление пользователями
            "Manage Users": "Kelola Pengguna",
            "Users": "Pengguna",
            "Add User": "Tambah Pengguna",
            "Edit User": "Ubah Pengguna",
            "User": "Pengguna",
            "Admin": "Admin",
            "Active": "Aktif",
            "Are you sure you want to delete this user?": "Apakah Anda yakin ingin menghapus pengguna ini?",
            "Loading": "Memuat...",
            "Error loading users": "Terjadi kesalahan saat memuat pengguna",
            "Error saving user": "Terjadi kesalahan saat menyimpan pengguna",
            "Failed to delete user": "Gagal menghapus pengguna"
        }
    }
};


function updateTexts() {
    // Универсальное обновление элементов с data-атрибутами
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = i18next.t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = i18next.t(el.getAttribute('data-i18n-placeholder'));
    });
}

