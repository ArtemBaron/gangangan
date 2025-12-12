// js/admin-init.js

// pageInit вызывается после загрузки любой страницы
window.pageInit = function () {
    console.log("%c[pageInit] Запуск всех модулей", "color: orange");
    PageModules.runAll();
};