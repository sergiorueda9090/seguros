const API_BASE_URL = "http://127.0.0.1:8000";
//const API_BASE_URL = "https://seguros.sergiodevsolutions.com"; //PRODUCCION
// Obtener y listar roles
async function fetchRoles() {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/api/roles/`);
        const data = await response.json();

        const tableBody = document.querySelector("#rolesTable tbody");
        tableBody.innerHTML = "";

        data.forEach(role => {
            const row = `
                <tr>
                    <td>${role.id}</td>
                    <td>${role.name}</td>
                    <td>${role.description || "N/A"}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="openEditModal(${role.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${role.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error al obtener los roles:", error);
    }
}

// Abrir modal para crear
function openCreateModal() {
    document.getElementById("roleForm").reset();
    document.getElementById("roleId").value = "";
    $("#roleModal").modal("show");
}

// Abrir modal para editar
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/api/roles/${id}/`);
        const role = await response.json();

        document.getElementById("roleId").value = role.id;
        document.getElementById("name").value = role.name;
        document.getElementById("description").value = role.description || "";

        $("#roleModal").modal("show");
    } catch (error) {
        console.error("Error al cargar el rol:", error);
    }
}

// Guardar rol
async function saveRole() {
    const id = document.getElementById("roleId").value;
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    const payload = { name, description };

    try {
        const response = id
            ? await fetch(`${API_BASE_URL}/roles/api/roles/${id}/`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
              })
            : await fetch(API_BASE_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
              });

        if (!response.ok) throw new Error("Error al guardar el rol");

        $("#roleModal").modal("hide");
        fetchRoles();
    } catch (error) {
        console.error("Error al guardar el rol:", error);
    }
}

// Eliminar rol

function showDeleteModal(id) {
    // Asignar el ID del rol al campo oculto
    document.getElementById("deleteRoleId").value = id;

    // Mostrar el modal
    $("#deleteModal").modal("show");
}

async function deleteRole() {
    const roleId = document.getElementById("deleteRoleId").value; // Obtener el ID del campo oculto 
    try {
        const response = await fetch(`${API_BASE_URL}/roles/api/roles/${roleId}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el rol.");
        }

        // Cerrar el modal
        $("#deleteModal").modal("hide");

        // Mostrar mensaje de éxito
        alert("Rol eliminado correctamente.");

        // Recargar la lista de roles
        fetchRoles();
    } catch (error) {
        console.error("Error al eliminar el rol:", error);
        alert("Hubo un problema al eliminar el rol.");
    }
}


// Inicializar lista
document.addEventListener("DOMContentLoaded", fetchRoles);
