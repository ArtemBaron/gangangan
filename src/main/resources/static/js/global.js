// js/global.js
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById('logoutButton');
    const tokenKey = 'authToken';

    if (!logoutButton) return;

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(tokenKey);
        logoutButton.classList.add('hidden');
        if (typeof loadPage === "function") {
            loadPage("login");
        }
    });

    // показать кнопку, если токен есть
    if (localStorage.getItem(tokenKey)) {
        logoutButton.classList.remove('hidden');
    }
});
