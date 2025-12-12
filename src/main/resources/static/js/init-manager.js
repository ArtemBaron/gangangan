// Центральный менеджер всех модулей
// js/init-manager.js
window.PageModules = {
    modules: [],
    register(fn) {
        this.modules.push(fn);
    },
    runAll() {
        this.modules.forEach(fn => {
            try { fn(); } catch (e) { console.error("PageModule failed:", e); }
        });
    }
};
