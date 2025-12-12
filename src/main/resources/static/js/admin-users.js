// js/admin-users.js
PageModules.register(function initAdminUsers() {

    const usersList = document.getElementById("usersList");
    if (!usersList) return; // Элемент отсутствует → не эта страница

    console.log("[AdminUsers] init");

    const addUserBtn = document.getElementById('addUserBtn');
    const editUserModal = document.getElementById('editUserModal');
    const editUserForm = document.getElementById('editUserForm');
    const cancelEditUserBtn = document.getElementById('cancelEditUserBtn');
    const editUserTitle = document.getElementById('editUserTitle');

    const tokenKey = 'authToken';
    let editingUser = null;

    // ------------------------
    // 1. Загрузка пользователей
    // ------------------------
    function loadUsers() {
        usersList.innerHTML = `<li class="text-gray-500 p-2">${i18next.t("Loading")}</li>`;

        fetch('/api/v1/users', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem(tokenKey)}` }
        })
            .then(r => r.json())
            .then(renderUsersList)
            .catch(err => {
            usersList.innerHTML = `<li class="text-red-600 p-2">${i18next.t("Error loading users")}</li>`;
            console.error(err);
        });
    }

    // ------------------------
    // 2. Рендер списка пользователей
    // ------------------------
    function renderUsersList(users) {
        usersList.innerHTML = '';

        users.forEach(user => {
            const li = document.createElement('li');

            li.className =
            'flex justify-between items-center p-2 border rounded ' +
            (user.status ? 'bg-green-50 border-green-300' : 'bg-gray-100 border-gray-300');

            li.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full ${user.status ? 'bg-green-500' : 'bg-gray-500'}"></span>
                    <span>${user.username} (${user.role})</span>
                </div>
                <div class="flex gap-2">
                    <button class="editUserBtn bg-yellow-400 px-2 py-1 rounded text-sm" data-i18n="Edit">Edit</button>
                    <button class="deleteUserBtn bg-red-500 px-2 py-1 rounded text-sm" data-i18n="Delete">Delete</button>
                </div>
            `;

            li.querySelector(".editUserBtn")
                .addEventListener("click", () => openEditUserModal(user));

            li.querySelector(".deleteUserBtn")
                .addEventListener("click", () => deleteUser(user));

            usersList.appendChild(li);
        });

        // Обновляем тексты i18next для новой страницы
        if (typeof updateTexts === "function") {
            updateTexts();
        }
    }

    // ------------------------
    // 3. Модалка редактирования
    // ------------------------
    function openEditUserModal(user) {
        editingUser = user;

        editUserTitle.textContent = i18next.t("Edit User");
        editUserForm.username.value = user.username;
        editUserForm.password.value = "";
        editUserForm.role.value = user.role;
        editUserForm.status.checked = user.status;

        editUserModal.classList.remove("hidden");
    }

    // ------------------------
    // 4. Добавление пользователя
    // ------------------------
    addUserBtn.addEventListener("click", () => {
        editingUser = null;

        editUserTitle.textContent = i18next.t("Add User");
        editUserForm.reset();

        editUserModal.classList.remove("hidden");
    });

    // ------------------------
    // 5. Сохранение (POST или PUT)
    // ------------------------
    editUserForm.addEventListener("submit", e => {
        e.preventDefault();

        const dto = {
            username: editUserForm.username.value,
            password: editUserForm.password.value || undefined,
            role: editUserForm.role.value,
            status: editUserForm.status.checked
        };

        const url = editingUser ? `/api/v1/users/${editingUser.id}` : `/api/v1/users`;
        const method = editingUser ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
            },
            body: JSON.stringify(dto)
        })
            .then(r => r.json())
            .then(() => {
            editUserModal.classList.add("hidden");
            loadUsers();
        })
            .catch(err => alert(i18next.t("Error saving user")));
    });

    cancelEditUserBtn.addEventListener("click", () => {
        editUserModal.classList.add("hidden");
    });

    // ------------------------
    // 6. Удаление
    // ------------------------
    function deleteUser(user) {
        if (!confirm(i18next.t("Are you sure you want to delete this user?"))) return;

        fetch(`/api/v1/users/${user.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem(tokenKey)}` }
        })
            .then(resp => {
            if (resp.ok) loadUsers();
            else alert(i18next.t("Failed to delete user"));
        });
    }

    // Первичная загрузка
    loadUsers();
});
