function openCreateModal(cliente = null) {
    const modalTitle = document.getElementById("modalTitle");
    const saveButton = document.querySelector("#roleModal .btn-primary");

    // Limpiar el formulario
    document.getElementById("clienteForm").reset();
    document.getElementById("preciosContainer").innerHTML = "";

    if (cliente) {
        // Modo edición
        modalTitle.textContent = `Editar Cliente: ${cliente.nombre} ${cliente.apellido}`;
        saveButton.setAttribute("onclick", `updateCliente(${cliente.id})`);

        // Rellenar el formulario con los datos del cliente
        document.getElementById("nombre").value = cliente.nombre;
        document.getElementById("apellido").value = cliente.apellido;
        document.getElementById("email").value = cliente.email;
        document.getElementById("telefono").value = cliente.telefono;
        document.getElementById("direccion").value = cliente.direccion;

        // Rellenar precios
        cliente.precios.forEach(precio => {
            addPrecio(precio.descripcion, precio.monto, precio.id);
        });
    } else {
        // Modo creación
        modalTitle.textContent = "Crear Nuevo Cliente";
        saveButton.setAttribute("onclick", "saveCliente()");
    }

    // Mostrar el modal
    $("#roleModal").modal("show");
}

function addPrecio(descripcion = "", monto = "", precioId = null) {
    const preciosContainer = document.getElementById("preciosContainer");

    const precioItem = document.createElement("div");
    precioItem.classList.add("precio-item", "form-row", "mb-3");

    precioItem.innerHTML = `
        <div class="form-group col-md-6">
            <label>Descripción</label>
            <input type="text" class="form-control descripcion" value="${descripcion}" placeholder="Descripción del precio" required>
        </div>
        <div class="form-group col-md-4">
            <label>Monto</label>
            <input type="number" class="form-control monto" value="${monto}" placeholder="Monto del precio" required>
        </div>
        <div class="form-group col-md-2 d-flex align-items-end">
            <button type="button" class="btn btn-danger btn-sm remove-precio" onclick="removePrecio(this)">🗑️</button>
        </div>
        ${precioId ? `<input type="hidden" class="precio-id" value="${precioId}">` : ""}
    `;

    preciosContainer.appendChild(precioItem);
}

function removePrecio(button) {
    button.closest(".precio-item").remove();
}


async function saveCliente() {
    const accessToken = localStorage.getItem("access");

    const clienteData = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        precios: []
    };

    document.querySelectorAll("#preciosContainer .precio-item").forEach(item => {
        clienteData.precios.push({
            descripcion: item.querySelector(".descripcion").value,
            monto: item.querySelector(".monto").value
        });
    });

    try {
        const response = await fetch(`${API_BASE_URL}/clientes/api/clientes/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clienteData),
        });

        if (response.ok) {
            alert("Cliente creado correctamente.");
            $('#roleModal').modal('hide');
            loadClientes();
        } else {
            const errorData = await response.json();
            alert("Error al crear cliente: " + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error("Error al crear cliente:", error);
    }
}

async function updateCliente(clienteId) {
    const accessToken = localStorage.getItem("access");
  
    const clienteData = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        precios: []
    };

    document.querySelectorAll("#preciosContainer .precio-item").forEach(item => {
        clienteData.precios.push({
            id: item.querySelector(".precio-id")?.value || null,
            descripcion: item.querySelector(".descripcion").value,
            monto: item.querySelector(".monto").value
        });
    });

    try {
        const response = await fetch(`${API_BASE_URL}/clientes/api/clientes/${clienteId}/`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clienteData),
        });

        if (response.ok) {
            alert("Cliente actualizado correctamente.");
            $('#roleModal').modal('hide');
            loadClientes();
        } else {
            const errorData = await response.json();
            alert("Error al actualizar cliente: " + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
    }
}

/* =================================================
   =========== START LISTAR CLIENTES ===============
*/
async function loadClientes() {
    const accessToken = localStorage.getItem("access");
    const API_URL = `${API_BASE_URL}/clientes/api/clientes/`;

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al cargar los clientes");
        }

        const clientes = await response.json();
        const tableBody = document.querySelector("#clientesTable tbody");

        // Limpiar la tabla antes de agregar nuevos datos
        tableBody.innerHTML = "";

        // Agregar filas con los datos de los clientes
        clientes.forEach(cliente => {
            const row = `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.direccion}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="viewCliente(${cliente.id})">Ver</button>
                        <button class="btn btn-primary btn-sm" onclick="editCliente(${cliente.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${cliente.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error al cargar los clientes:", error);
        alert("No se pudieron cargar los clientes. Por favor, intenta más tarde.");
    }
}

/* ===============================================
   =========== END LISTAR CLIENTES ===============
*/

async function editCliente(id) {
    const accessToken = localStorage.getItem("access");
    const API_URL = `${API_BASE_URL}/clientes/api/clientes/${id}/`;

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al cargar los datos del cliente");
        }

        const cliente = await response.json();
        // Mostrar el modal
        openCreateModal(cliente);

    } catch (error) {
        console.error("Error al cargar cliente:", error);
        alert("No se pudo cargar la información del cliente.");
    }
}

function removePrecio(button) {
    const precioItem = button.closest(".precio-item");
    precioItem.remove(); // Elimina el elemento del DOM
}

function viewCliente(id) {
    // Lógica para mostrar los precios asociados del cliente con el ID dado
    alert(`Mostrar detalles del cliente con ID ${id}`);
}


/**ELIMINAR REGISTRO */
function openDeleteModal(clienteId) {
    document.getElementById("deleteClienteId").value = clienteId; // Guardar el ID en un input oculto
    $("#deleteModal").modal("show"); // Abrir el modal
}


async function deleteCliente() {
    const clienteId = document.getElementById("deleteClienteId").value;

    const accessToken = localStorage.getItem("access");
    const API_URL = `${API_BASE_URL}/clientes/api/clientesremove/${clienteId}/`;

    try {
        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            alert("Cliente y sus precios eliminados correctamente.");
            $("#deleteModal").modal("hide"); // Cerrar el modal
            loadClientes(); // Actualizar la tabla
        } else {
            const errorData = await response.json();
            alert(`Error al eliminar cliente: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Hubo un problema al eliminar el cliente. Por favor, intenta nuevamente.");
    }
}

// Llamar a la función para cargar los clientes al cargar la página
document.addEventListener("DOMContentLoaded", loadClientes);
