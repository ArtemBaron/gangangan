// js/search.js

// js/admin-search-view.js

PageModules.register(function initSearch() {
    const tokenKey = 'authToken';

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const entryTypeSelect = document.getElementById('entryTypeSelect');
    const allSearchCheckbox = document.getElementById('allSearchCheckbox');
    const resultsUL = document.getElementById('resultsUL');
    const resultsList = document.getElementById('resultsList');
    const entryDetails = document.getElementById('entryDetails');

    if (!searchForm || !searchInput || !resultsUL || !resultsList) return;

    let currentEntries = [];
    let currentEntry = null;

    // --------------------------
    // Обработчик отправки формы
    // --------------------------
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        const entryType = entryTypeSelect.value;
        const allSearch = allSearchCheckbox.checked;

        entryDetails.style.display = 'none';
        entryDetails.innerHTML = '';
        currentEntry = null;
        resultsList.style.display = 'block';
        resultsUL.innerHTML = `<li class="text-gray-500">${i18next.t("Searching")}</li>`;

        const urlParams = new URLSearchParams();
        if (query) urlParams.append('query', query);
        if (entryType) urlParams.append('entryType', entryType);
        urlParams.append('allSearch', allSearch ? '1' : '0');

        try {
            const resp = await fetch(`/api/v1/entries/search?${urlParams.toString()}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem(tokenKey)}` }
            });

            if (resp.status === 401) {
                localStorage.removeItem(tokenKey);
                document.dispatchEvent(new Event("auth:expired"));
                throw new Error('Unauthorized');
            }

            const data = await resp.json();
            currentEntries = data || [];

            if (!currentEntries.length) {
                resultsUL.innerHTML = `<li class="text-gray-500">${i18next.t("No results")}</li>`;
            } else {
                renderResults(currentEntries);
            }
        } catch (err) {
            console.error(err);
            resultsUL.innerHTML = `<li class="text-red-600">${i18next.t("Error")}</li>`;
        }
    }

    // --------------------------
    // Отображение результатов
    // --------------------------
    function renderResults(entries) {
        resultsUL.innerHTML = '';

        entries.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'result-item';
            li.dataset.id = entry.id;
//// вот здесь выдирается текст из текущей локали и не устанавливается тег
///надо установить чтобы язык изменялся на лету!!!
//            li.innerHTML = `
//              <span class="icon">📄</span>
//              <div>
//                <div><strong>${entry.fullName || entry.alias || 'No name'}</strong></div>
//                <div class="text-sm text-gray-600">
//                  ${entry.entryType ? `${i18next.t("Type")}: ${entry.entryType}` : ''}
//                  ${entry.sourceList ? ` | ${i18next.t("Source")}: ${entry.sourceList}` : ''}
//                  ${entry.additionalInfo ? ` | ${i18next.t("Info")}: ${entry.additionalInfo}` : ''}
//                  ${entry.loadDate ? `<span> | ${i18next.t("Load Date")}: ${new Date(entry.loadDate).toLocaleDateString()}</span>` : ''}
//                </div>
//              </div>
//            `;
            li.innerHTML = `
                <span class="icon">📄</span>
                    <div>
                        <div><strong>${entry.fullName || entry.alias || 'No name'}</strong></div>

                        <div class="text-sm text-gray-600">

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
                `;



            li.addEventListener('click', () => showEntryDetails(entry));
            resultsUL.appendChild(li);
        });
        // Обновляем тексты i18next для новой страницы
        if (typeof updateTexts === "function") {
            updateTexts();
        }

    }

    // --------------------------
    // Просмотр деталей записи
    // --------------------------
    function showEntryDetails(entry) {
        entryDetails.style.display = 'block';
        resultsList.style.display = 'none';

//        entryDetails.innerHTML = `
//            <h2 class="text-xl font-bold mb-2">${entry.fullName || ''}</h2>
//            <p><strong>${i18next.t("Title")}:</strong> ${entry.title || ''}</p>
//            <p><strong>${i18next.t("Alias")}:</strong> ${entry.alias || ''}</p>
//            <p><strong>${i18next.t("Nationality")}:</strong> ${entry.nationality || ''}</p>
//            <p><strong>${i18next.t("Passport")}:</strong> ${entry.passportNo || ''}</p>
//            <p><strong>${i18next.t("Identity No")}:</strong> ${entry.identityNo || ''}</p>
//            <p><strong>${i18next.t("Job Title")}:</strong> ${entry.jobTitle || ''}</p>
//            <p><strong>${i18next.t("Date of Birth")}:</strong> ${entry.dob || ''}</p>
//            <p><strong>${i18next.t("Place of Birth")}:</strong> ${entry.pob || ''}</p>
//            <p><strong>${i18next.t("Name 1")}:</strong> ${entry.name1 || ''}</p>
//            <p><strong>${i18next.t("Name 2")}:</strong> ${entry.name2 || ''}</p>
//            <p><strong>${i18next.t("Name 3")}:</strong> ${entry.name3 || ''}</p>
//            <p><strong>${i18next.t("Name 4")}:</strong> ${entry.name4 || ''}</p>
//            <p><strong>${i18next.t("Address")}:</strong> ${entry.address || ''}</p>
//            <p><strong>${i18next.t("Additional Info")}:</strong> ${entry.additionalInfo || ''}</p>
//            <p><strong>${i18next.t("Source List")}:</strong> ${entry.sourceList || ''}</p>
//            <p><strong>${i18next.t("Entry Type")}:</strong> ${entry.entryType || ''}</p>
//            <p><strong>${i18next.t("Load Date")}:</strong> ${entry.loadDate ? new Date(entry.loadDate).toLocaleString() : ''}</p>
//            <button id="backButton" class="mt-4 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">${i18next.t("Back to results")}</button>
//        `;

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


        document.getElementById('backButton')?.addEventListener('click', () => {
            entryDetails.style.display = 'none';
            resultsList.style.display = 'block';
        });
        // Обновляем тексты i18next для новой страницы
        if (typeof updateTexts === "function") {
            updateTexts();
        }
    }

});
