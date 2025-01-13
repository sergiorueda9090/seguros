const API_BASE_URL = "http://127.0.0.1:8000/lable/api/labelcolor/";

async function fetchLabelColors() {

    const accessToken =  localStorage.getItem("access");
 
    if (!accessToken) {
        window.location.href = '/';
        return;
    }

    try {

        const response = await fetch(API_BASE_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        console.log("response ",response)
        if (!response.ok) {
            alert("Error al obtener los datos.");
            return;
        }

        const data = await response.json();

        const tableBody = document.querySelector("#labelColorTable tbody");
        
        tableBody.innerHTML = ""; // Limpiar contenido previo

        data.forEach(label => {
            const row = `
                <tr>
                    <td>${label.id}</td>
                    <td>${label.name}</td>
                    <td><span style="background-color: ${label.color}; padding: 5px 10px; border-radius: 5px;">${label.color}</span></td>
                    <td>${label.description || "N/A"}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="openEditModal(${label.id})">Editar</button>
                         <button class="btn btn-danger btn-sm" onclick="deleteLabelColorModal(${label.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        alert("Hubo un error al obtener los datos.");
    }
}


async function openEditModal(id) {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        alert("No tienes un token de acceso. Por favor, inicia sesión.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${id}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            alert("Error al cargar los datos del registro.");
            return;
        }

        const label = await response.json();

        document.getElementById("labelColorId").value = label.id;
        document.getElementById("name").value = label.name;
        document.getElementById("color").value = label.color;
        document.getElementById("description").value = label.description || "";

        document.getElementById("modalTitle").textContent = "Editar Color";
        $("#labelColorModal").modal("show");
    } catch (error) {
        console.error("Error al obtener los datos del registro:", error);
        alert("Hubo un error al cargar los datos del registro.");
    }
}


function openCreateModal(){
    $("#labelColorModal").modal("show");
}


async function saveLabelColor() {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        alert("No tienes un token de acceso. Por favor, inicia sesión.");
        return;
    }

    const id = document.getElementById("labelColorId").value;
    const name = document.getElementById("name").value;
    const color = document.getElementById("color").value;
    const description = document.getElementById("description").value;

    const payload = { name, color, description };

    try {
        let response;

        if (id) {
            // Actualizar
            response = await fetch(`${API_BASE_URL}${id}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        } else {
            // Crear
            response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error: " + JSON.stringify(errorData));
            return;
        }

        alert("Operación exitosa.");
        $("#labelColorModal").modal("hide");
        fetchLabelColors(); // Recargar la lista
    } catch (error) {
        console.error("Error al guardar el registro:", error);
        alert("Hubo un error al guardar el registro.");
    }
}

function deleteLabelColorModal(id) {
    document.getElementById("deleteLabelColorId").value = id; // Configurar el ID en el campo oculto
    $("#deleteModal").modal("show"); // Mostrar el modal
}


async function deleteLabelColor() {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        alert("No tienes un token de acceso. Por favor, inicia sesión.");
        return;
    }

    const id = document.getElementById("deleteLabelColorId").value; // Obtener el ID del campo oculto

    try {
        const response = await fetch(`${API_BASE_URL}${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            alert("Hubo un error al eliminar el registro.");
            return;
        }

        alert("Registro eliminado exitosamente.");
        $("#deleteModal").modal("hide"); // Cerrar el modal
        fetchLabelColors(); // Recargar la lista
    } catch (error) {
        console.error("Error al eliminar el registro:", error);
        alert("Hubo un error al eliminar el registro.");
    }
}
// Cargar datos al inicio
document.addEventListener("DOMContentLoaded", fetchLabelColors);
