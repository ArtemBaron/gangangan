// /js/app.js
// Запускаем сразу после загрузки JS, а не ждём DOMContentLoaded
const tokenKey = 'authToken';

initApp();

/** Инициализация приложения */
async function initApp() {

    const nav = performance.getEntriesByType("navigation")[0];
    const isReload = nav.type === "reload";

    const token = localStorage.getItem(tokenKey);
    if (!token) {
        await loadPage("login");
        return;
    }

    // === ВОССТАНОВЛЕНИЕ ТОЛЬКО ПРИ F5 ===
    if (isReload) {
        const lastPage = localStorage.getItem("lastPage");
        if (lastPage) {
            console.log("[initApp] Восстанавливаю страницу после F5:", lastPage);
            await loadPage(lastPage);
            return; // важно!
        }
    }

    // === Обычный запуск без reload ===
    console.log("[initApp] Обычный запуск, страница НЕ восстанавливается");

    // пробуем загрузить home
    // await loadPage("home");
}

/** Загружает страницу по имени */
async function loadPage(pageName) {
    const token = localStorage.getItem(tokenKey);

    const res = await fetch(`/api/v1/pages/${pageName}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    const html = await res.text();

    // токен недействителен → сервер вернул login
    if (res.status === 401 || html.includes("<!--LOGIN_PAGE-->")) {
        localStorage.removeItem(tokenKey);
//        await loadPage("login");
        //return;
    }

    // Вставляем HTML в контейнер
    appContainer.innerHTML = html;

    // Обновляем тексты i18next для новой страницы
    if (typeof updateTexts === "function") {
        updateTexts();
    }

    // Загружаем JS-модули страницы
    await loadPageScripts(html);

    // Если страница имеет pageInit() — запускаем
    if (typeof window.pageInit === "function") {
        window.pageInit();
    }

    localStorage.setItem("lastPage", pageName);
}

/** Загружает <script data-src="..."> и позволяет каждой странице иметь свой pageInit() */
async function loadPageScripts(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const scripts = temp.querySelectorAll("script[data-src]");

    for (const s of scripts) {
        await loadScript(s.getAttribute("data-src"));
    }
}

/** Динамическая загрузка JS */
const loadedScripts = new Set();

function loadScript(src) {
    return new Promise((resolve, reject) => {

        // если уже загружен → просто выходим
        if (loadedScripts.has(src)) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            loadedScripts.add(src);
            resolve();
        };
        script.onerror = reject;

        document.body.appendChild(script);
    });
}

