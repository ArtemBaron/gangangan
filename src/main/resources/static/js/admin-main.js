PageModules.register(function initAdminMain() {

    const adminControls = document.getElementById("adminControls");
    if (!adminControls) return; // Не эта страница

    console.log("[AdminMain] init");

    const showSearchBtn = document.getElementById('showSearchBtn');
    const manageUsersBtn = document.getElementById('manageUsersBtn');

    if (showSearchBtn) {
        showSearchBtn.addEventListener('click', () => {
            loadPage("admin-search"); // загрузим поиск
        });
    }

    if (manageUsersBtn) {
        manageUsersBtn.addEventListener('click', () => {
            loadPage("admin-users"); // загрузим список юзеров
        });
    }
});
