PageModules.register(function initMain() {

    const userControls = document.getElementById("userControls");
    if (!userControls) return; // Не эта страница

    console.log("[UserMain] init");

    const showSearchBtn = document.getElementById('showSearchBtn');

    if (showSearchBtn) {
        showSearchBtn.addEventListener('click', () => {
            loadPage("search"); // загрузим поиск
        });
    }

    const paymentOrderBtn = document.getElementById('paymentOrderBtn');

    if (paymentOrderBtn) {
        paymentOrderBtn.addEventListener('click', () => {
            loadPage("payment"); // загрузим поиск
        });
    }

});
