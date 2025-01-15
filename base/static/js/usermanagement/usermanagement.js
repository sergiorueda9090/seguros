


document.addEventListener('DOMContentLoaded', function () {
    
    listUsers();

    const form              = document.getElementById('createUserForm');
    const submitButton      = document.getElementById('submitForm');
    const submitEditButton  = document.getElementById('submitEditButton');
    const csrfToken         = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Validar campos del formulario
    function validateForm() {
        let valid = true;
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        if (username.value.trim() === '') {
            showError(username, 'El nombre de usuario es obligatorio.');
            valid = false;
        } else {
            clearError(username);
        }

        if (email.value.trim() === '') {
            showError(email, 'El correo electrónico es obligatorio.');
            valid = false;
        } else if (!validateEmail(email.value.trim())) {
            showError(email, 'El correo electrónico no es válido.');
            valid = false;
        } else {
            clearError(email);
        }

        if (password.value.trim() === '') {
            showError(password, 'La contraseña es obligatoria.');
            valid = false;
        } else {
            clearError(password);
        }

        return valid;
    }

    // Mostrar mensaje de error
    function showError(input, message) {
        const parent = input.parentElement;
        let errorElement = parent.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message text-danger';
            parent.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    // Limpiar mensajes de error
    function clearError(input) {
        const parent = input.parentElement;
        const errorElement = parent.querySelector('.error-message');

        if (errorElement) {
            parent.removeChild(errorElement);
        }
    }

    // Validar formato de email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Manejar envío del formulario
    async function handleFormSubmission(event) {
        event.preventDefault();

        if (!validateForm()) {
            return; // Detener si el formulario no es válido
        }

        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.getAttribute('action'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfToken,
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                }
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();

            if (data.success) {
                alert(data.message || 'Usuario creado exitosamente');
                listUsers();
                //location.reload(); // Opcional: Recargar la página
            } else {
                alert(data.message || 'Ocurrió un error al crear el usuario.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al enviar el formulario.');
        }
    }

    // Manejar envío del formulario
    async function handleFormEditSubmission(event) {
        event.preventDefault();

        if (!validateForm()) {
            return; // Detener si el formulario no es válido
        }

        const formData = new FormData(form);
        
        let userId = document.getElementById('userid').value;

        try {
            const response = await fetch(`http://127.0.0.1:8000/users/api/users/${userId}/update/`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfToken,
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                }
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();

            if (data.success) {
                alert(data.message || 'Usuario Actualizado exitosamente');
                listUsers();
                //location.reload(); // Opcional: Recargar la página
            } else {
                alert(data.message || 'Ocurrió un error al Actualizado el usuario.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al enviar el formulario.');
        }
    }

    // Agregar eventos
    submitButton.addEventListener('click', handleFormSubmission);
    submitEditButton.addEventListener('click', handleFormEditSubmission);
});

const API_USERS_URL = "http://127.0.0.1:8000";

function handleCreateUser() {
    resetForm(); // Restablecer el formulario
    $("#modalUsers").modal("show"); // Abrir el modal
}

async function listUsers() {
    try {
        const accessToken = localStorage.getItem("access");

        if (!accessToken) {
            window.location.href = '/';
            return;
        }

        const response = await fetch(`${API_USERS_URL}/users/api/users/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            updateDataTable(data.users);
        } else {
            alert(data.message || "Error al listar usuarios.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al obtener la lista de usuarios.");
    }
}

function updateDataTable(users) {
    // Destruir la tabla existente si ya está inicializada
    const dataTable =  $("#example1").DataTable();
    dataTable.clear().destroy();

    // Reinsertar los nuevos datos
    const tableBody = document.querySelector("#example1 tbody");
    tableBody.innerHTML = ""; // Limpiar contenido previo

    users.forEach(user => {
        const avatar = user.profile_image || "/static/adminlte/dist/img/avatar04.png";
        console.log("avatar ",avatar)
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>
                    <ul class="list-inline">
                        <li class="list-inline-item">
                            <img alt="Avatar" class="table-avatar" src="${avatar}">
                        </li>
                    </ul>
                </td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.first_name || "N/A"}</td>
                <td>${user.last_name || "N/A"}</td>
                <td>${user.last_login || "N/A"}</td>
                <td>${user.date_joined}</td>
                <td class="project-state">
                    <span class="badge badge-${user.is_active ? "success" : "danger"}">
                        ${user.is_active ? "Active" : "Inactive"}
                    </span>
                </td>
                <td>
                    <a href="javascript:void(0);" class="btn btn-info btn-sm" onclick="editUser(${user.id})" title="Editar Usuario">
                        <i class="fas fa-pencil-alt"></i>
                    </a>
                    <a href="javascript:void(0);" class="btn btn-danger btn-sm" onclick="confirmDelete(${user.id})" title="Eliminar Usuario">
                        <i class="fas fa-trash"></i>
                    </a>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Reinicializar DataTables
    $("#example1").DataTable({
        language: {
            url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}


async function editUser(userId) {

    const accessToken = localStorage.getItem("access");
    
    if (!accessToken) {
        alert("No tienes un token de acceso. Por favor, inicia sesión.");
        return;
    }

    try {
        // Realizar la solicitud al endpoint
        const response = await fetch(`${API_USERS_URL}/users/api/users/${userId}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        
        const data = await response.json();
        
        if (response.ok) {

            // Llenar un formulario con los datos del usuario

            fillEditForm(data.user);

            // Alternar botones: ocultar Crear y mostrar Editar
            document.getElementById("submitForm").style.display = "none";
            document.getElementById("submitEditButton").style.display = "inline-block";

            // Cambiar título del modal
            document.querySelector(".modal-title").textContent = "Editar Usuario";

            // Abrir el modal
            $("#modalUsers").modal("show");

        } else {
            alert(data.message || "Error al obtener los datos del usuario.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al conectar con el servidor.");
    }
}

// Función para llenar el formulario con los datos del usuario
function fillEditForm(user) {
    console.log("user ",user)
    document.getElementById("userid").value = user.id || "";
    document.getElementById("username").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("first_name").value = user.first_name || "";
    document.getElementById("last_name").value = user.last_name || "";
    document.getElementById("password").value = user.password || "";
    document.getElementById("profile_image").value = ""; // Limpiar campo de imagen
}

// Función para volver al estado de "Crear Usuario"
function resetForm() {
    document.getElementById("createUserForm").reset();

    // Alternar botones: mostrar Crear y ocultar Editar
    document.getElementById("submitForm").style.display = "inline-block";
    document.getElementById("submitEditButton").style.display = "none";

    // Cambiar título del modal
    document.querySelector(".modal-title").textContent = "Crear Nuevo Usuario";
}


function confirmDelete(userId) {
    // Mostrar el modal de confirmación
    const deleteModal = document.getElementById("deleteModal");
    deleteModal.querySelector("#deleteUserId").value = userId;
    $("#deleteModal").modal("show");
}


async function deleteUser() {
    const userId = document.getElementById("deleteUserId").value;
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        alert("No tienes un token de acceso. Por favor, inicia sesión.");
        return;
    }

    try {
        const response = await fetch(`${API_USERS_URL}/users/api/users/${userId}/delete/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            alert("Usuario eliminado exitosamente.");
            $("#deleteModal").modal("hide");
            listUsers(); // Recargar la lista de usuarios
        } else {
            const data = await response.json();
            alert(data.message || "Error al eliminar el usuario.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al conectar con el servidor.");
    }
}