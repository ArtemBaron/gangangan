// js/login.js

PageModules.register(function initLogin() {

    const loginContainer = document.getElementById('loginContainer');
    if (!loginContainer) return; // Элемент отсутствует → не эта страница

    const tokenKey = 'authToken';
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginButton');
    const loginError = document.getElementById('loginError');

    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        loginError.classList.add('hidden');

        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (!data.token) throw new Error("No token");

            localStorage.setItem(tokenKey, data.token);

            // ✅ Проверим роль пользователя
            const token = localStorage.getItem(tokenKey);
            if (token) {
                const userRes = await fetch('/api/v1/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = await userRes.json();

                if (typeof loadPage === "function") {
                    logoutButton.classList.remove('hidden');

                    if (user.role === 'ADMIN') {
                        loadPage("admin-home");
                    } else {
                        loadPage("home");
                    }
                }
            }

        } catch (err) {
            loginError.textContent = i18next.t("Invalid credentials");
            loginError.classList.remove('hidden');
            console.error(err);
        }
    });

});
