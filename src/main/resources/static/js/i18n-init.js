// js/i18n-init.js

document.addEventListener("DOMContentLoaded", () => {
    // ✅ 1. Читаем язык из localStorage или ставим 'id'
    const savedLang = localStorage.getItem("lang") || "id";

    // ✅ 2. Инициализируем i18next с сохранённым языком
    i18next.init(
        { lng: savedLang, resources: window.i18nResources },
        updateTexts
    );

    // ✅ 3. Устанавливаем значение в селектор языка
    const languageSwitcher = document.getElementById('languageSwitcher');
    if (languageSwitcher) {
        languageSwitcher.value = savedLang;

        // ✅ 4. Меняем язык и сохраняем его
        languageSwitcher.addEventListener('change', (e) => {
            const newLang = e.target.value;

            i18next.changeLanguage(newLang, updateTexts);

            // ✅ сохраняем в localStorage
            localStorage.setItem("lang", newLang);
        });
    }
});

