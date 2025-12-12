// js/admin-search.js

PageModules.register(function initAdminSearch() {

    // Проверяем что эта страница — admin-search
    const searchForm = document.getElementById("searchForm");
    const resultsUL = document.getElementById("resultsUL");
    const entryDetails = document.getElementById("entryDetails");
    const showAllBtn = document.getElementById("showAllBtn");
    const csvFileInput = document.getElementById("csvFileInput");
    const csvErrors = document.getElementById("csvErrors");

    if (!searchForm || !resultsUL) {
        return; // не эта страница
    }

    console.log("%c[AdminSearch] init", "color: #0a0");

    const tokenKey = "authToken";
    let currentEntries = [];

    // ===============================
    // 🔹 ПОИСК
    // ===============================

    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        performSearch();
    });

    function performSearch() {

        const query = document.getElementById("searchInput").value.trim();
        const entryType = document.getElementById("entryTypeSelect").value;
        const allSearch = document.getElementById("allSearchCheckbox").checked;

        resultsUL.innerHTML = `<li class="text-gray-500">${i18next.t("Searching")}</li>`;
        entryDetails.classList.add("hidden");
        currentEntries = [];

        const params = new URLSearchParams();

        if (query) params.append("query", query);
        params.append("entryType", entryType);
        params.append("allSearch", allSearch ? "1" : "0");

        fetch(`/api/v1/entries/search?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem(tokenKey)}` }
        })
            .then(resp => resp.json())
            .then(data => {
            currentEntries = data;
            renderResults(data);
        })
            .catch(err => {
            resultsUL.innerHTML = `<li class="text-red-600">${i18next.t("Error")}</li>`;
        });
    }

    // ===============================
    // 🔹 ОТРИСОВКА РЕЗУЛЬТАТОВ
    // ===============================

    function renderResults(entries) {
        resultsUL.innerHTML = "";

        entries.forEach(entry => {
            const li = document.createElement("li");
            li.className = "result-item flex justify-between items-center";
            li.dataset.id = entry.id;

            li.innerHTML = `
    <div class="flex justify-between items-center w-full">

        <!-- Левая часть: данные -->
        <div class="flex-1 cursor-pointer">

            <div class="flex items-center">
                <span class="icon">📄</span>
                <strong>${entry.fullName || entry.alias || 'No name'}</strong>
            </div>

            <div class="text-sm text-gray-600 mt-1">

                ${entry.entryType ? `
                    <span data-i18n="Type">Type</span>: ${entry.entryType}
                ` : ''}

                ${entry.sourceList ? `
                    | <span data-i18n="Source">Source</span>: ${entry.sourceList}
                ` : ''}

                ${entry.additionalInfo ? `
                    | <span data-i18n="Info">Info</span>: ${entry.additionalInfo}
                ` : ''}

                ${entry.loadDate ? `
                    | <span data-i18n="Load Date">Load Date</span>: ${new Date(entry.loadDate).toLocaleDateString()}
                ` : ''}
            </div>
        </div>

        <!-- Правая часть: кнопки -->
        <div class="flex gap-2 ml-4 shrink-0">
            <button class="editBtn bg-yellow-400 px-2 py-1 rounded text-sm" data-i18n="Edit">Edit</button>
            <button class="deleteBtn bg-red-500 px-2 py-1 rounded text-sm" data-i18n="Delete">Delete</button>
        </div>

    </div>
`;


//            li.innerHTML = `
//                <div class="flex-1 cursor-pointer">
//                    <div>
//                    <span class="icon">📄</span>
//                        <div><strong>${entry.fullName || entry.alias || 'No name'}</strong></div>
//
//                        <div class="text-sm text-gray-600">
//
//                            ${entry.entryType ? `
//                                <span data-i18n="Type">Type</span>: ${entry.entryType}
//                            ` : ''}
//
//                            ${entry.sourceList ? `
//                                | <span data-i18n="Source">Source</span>: ${entry.sourceList}
//                            ` : ''}
//
//                            ${entry.additionalInfo ? `
//                                | <span data-i18n="Info">Info</span>: ${entry.additionalInfo}
//                            ` : ''}
//
//                            ${entry.loadDate ? `
//                                | <span data-i18n="Load Date">Load Date</span>: ${new Date(entry.loadDate).toLocaleDateString()}
//                            ` : ''}
//                        </div>
//                    </div>
//                    <div class="flex gap-2 ml-4">
//                        <button class="editBtn bg-yellow-400 px-2 py-1 rounded text-sm" data-i18n="Edit">Edit</button>
//                        <button class="deleteBtn bg-red-500 px-2 py-1 rounded text-sm" data-i18n="Delete">Delete</button>
//                    </div>
//                </div>
//                `;
//


//            li.innerHTML = `
//                <div class="flex-1 cursor-pointer">
//                    <div><strong>${entry.fullName || entry.alias || i18next.t("No name")}</strong></div>
//                    <div class="text-sm text-gray-600">
//                        ${entry.entryType ? `${i18next.t("Type")}: ${entry.entryType}` : ""}
//                        ${entry.sourceList ? ` | ${i18next.t("Source")}: ${entry.sourceList}` : ""}
//                        ${entry.additionalInfo ? ` | ${i18next.t("Info")}: ${entry.additionalInfo}` : ""}
//                        ${entry.loadDate ? ` | ${i18next.t("Load Date")}: ${new Date(entry.loadDate).toLocaleDateString()}` : ""}
//                    </div>
//                </div>
//                <div class="flex gap-2 ml-4">
//                    <button class="editBtn bg-yellow-400 px-2 py-1 rounded text-sm">${i18next.t("Edit")}</button>
//                    <button class="deleteBtn bg-red-500 px-2 py-1 rounded text-sm">${i18next.t("Delete")}</button>
//                </div>
//            `;

            // открыть детали
            li.querySelector(".flex-1").addEventListener("click", () => showEntryDetails(entry));

            // редактировать
            li.querySelector(".editBtn").addEventListener("click", e => {
                e.stopPropagation();
                openEditModal(entry);
            });

            // удалить
            li.querySelector(".deleteBtn").addEventListener("click", e => {
                e.stopPropagation();

                if (!confirm(i18next.t("Are you sure you want to delete this entry?"))) return;

                fetch(`/api/v1/entries/${entry.id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${localStorage.getItem(tokenKey)}` }
                }).then(() => {
                    currentEntries = currentEntries.filter(x => x.id !== entry.id);
                    li.remove();
                });
            });

            resultsUL.appendChild(li);
        });

        // Обновляем тексты i18next для новой страницы
        if (typeof updateTexts === "function") {
            updateTexts();
        }
    }

    // ===============================
    // 🔹 ДЕТАЛЬНЫЙ ПРОСМОТР
    // ===============================

    function showEntryDetails(entry) {
        document.getElementById("resultsList").classList.add("hidden");
        entryDetails.classList.remove("hidden");

        entryDetails.innerHTML = `
            <h2 class="text-xl font-bold mb-2">${entry.fullName || ''}</h2>

            <p><strong data-i18n="Title">Title</strong>: ${entry.title || ''}</p>
            <p><strong data-i18n="Alias">Alias</strong>: ${entry.alias || ''}</p>
            <p><strong data-i18n="Nationality">Nationality</strong>: ${entry.nationality || ''}</p>
            <p><strong data-i18n="Passport">Passport</strong>: ${entry.passportNo || ''}</p>
            <p><strong data-i18n="Identity No">Identity No</strong>: ${entry.identityNo || ''}</p>
            <p><strong data-i18n="Job Title">Job Title</strong>: ${entry.jobTitle || ''}</p>
            <p><strong data-i18n="Date of Birth">Date of Birth</strong>: ${entry.dob || ''}</p>
            <p><strong data-i18n="Place of Birth">Place of Birth</strong>: ${entry.pob || ''}</p>
            <p><strong data-i18n="Name 1">Name 1</strong>: ${entry.name1 || ''}</p>
            <p><strong data-i18n="Name 2">Name 2</strong>: ${entry.name2 || ''}</p>
            <p><strong data-i18n="Name 3">Name 3</strong>: ${entry.name3 || ''}</p>
            <p><strong data-i18n="Name 4">Name 4</strong>: ${entry.name4 || ''}</p>
            <p><strong data-i18n="Address">Address</strong>: ${entry.address || ''}</p>
            <p><strong data-i18n="Additional Info">Additional Info</strong>: ${entry.additionalInfo || ''}</p>
            <p><strong data-i18n="Source List">Source List</strong>: ${entry.sourceList || ''}</p>
            <p><strong data-i18n="Entry Type">Entry Type</strong>: ${entry.entryType || ''}</p>
            <p><strong data-i18n="Load Date">Load Date</strong>: ${entry.loadDate ? new Date(entry.loadDate).toLocaleString() : ''}</p>

            <button id="backButton"
                    class="mt-4 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    data-i18n="Back to results">
                Back to results
            </button>
        `;

        document.getElementById("backButton").addEventListener("click", () => {
            entryDetails.classList.add("hidden");
            document.getElementById("resultsList").classList.remove("hidden");
        });

        // Обновляем тексты i18next для новой страницы
        if (typeof updateTexts === "function") {
            updateTexts();
        }
    }

    // ===============================
    // 🔹 РЕДАКТИРОВАНИЕ — MODAL
    // ===============================

    initEditModal();

    function initEditModal() {
        const editModal = document.getElementById("editModal");
        const editForm = document.getElementById("editForm");
        const cancelBtn = document.getElementById("cancelEditBtn");

        if (!editModal || !editForm) return;

        window.openEditModal = function(entry) {
            editForm.dataset.id = entry.id;

            [...editForm.elements].forEach(f => {
                if (f.name && entry[f.name] !== undefined) {
                    f.value = entry[f.name] ?? "";
                }
            });

            editModal.classList.remove("hidden");
        };

        cancelBtn.addEventListener("click", () => editModal.classList.add("hidden"));

        editForm.addEventListener("submit", async e => {
            e.preventDefault();

            const id = editForm.dataset.id;
            const dto = {};

            [...editForm.elements].forEach(f => {
                if (f.name) dto[f.name] = f.value;
            });

            const resp = await fetch(`/api/v1/entries/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
                },
                body: JSON.stringify(dto)
            });

            const updated = await resp.json();

            editModal.classList.add("hidden");

            const idx = currentEntries.findIndex(x => x.id === updated.id);
            if (idx !== -1) currentEntries[idx] = updated;

            renderResults(currentEntries);
        });
    }

    // ===============================
    // 🔹 КНОПКА «ПОКАЗАТЬ ВСЁ»
    // ===============================

    if (showAllBtn) {
        showAllBtn.addEventListener("click", async () => {
            const data = await fetch("/api/v1/entries/all", {
                headers: { "Authorization": `Bearer ${localStorage.getItem(tokenKey)}` }
            }).then(r => r.json());

            currentEntries = data;
            renderResults(data);
        });
    }

    // ===============================
    // 🔹 CSV ИМПОРТ
    // ===============================

    if (csvFileInput) {
        csvFileInput.addEventListener("change", e => {
            const file = e.target.files[0];
            if (!file) return;

            csvErrors.innerHTML = "";

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: ({ data }) => {
                    uploadCSV(data);
                },
                error: err => csvErrors.textContent = err.message
            });
        });
    }

    function uploadCSV(rows) {
        fetch("/api/v1/entries/bulk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
            },
            body: JSON.stringify({ entries: rows })
        })
            .then(r => r.json())
            .then(newEntries => {
            currentEntries = [...currentEntries, ...newEntries];
            renderResults(currentEntries);
        });
    }
});

