
async function cargarRegistrosAgrupados() {
    const API_URL = `${API_BASE_URL}/teammovilidad/api/registro-movilidad-agrupado`; // URL del endpoint
    const token = localStorage.getItem("access"); // Obtener el token JWT del almacenamiento local
    console.log("TOKEN ",token)
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Enviar el token JWT
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los datos: " + response.statusText);
        }

        const data = await response.json(); // Parsear la respuesta JSON

        // Limpiar la tabla antes de cargar los datos
        const tableBody = document.querySelector("#teamMovilidadTable tbody");
        tableBody.innerHTML = "";

        // Iterar sobre los usuarios y sus registros
        data.forEach((user) => {
            // Fila del usuario
            const userRow = `
                <tr>
                    <td style="background-color: #D4E6F1; font-weight: bold;">
                        ${user.username.toUpperCase()}
                        <button type="button" class="btn btn-tool" onclick="openCreateRegistroModal(${user.id})" title="Crear nuevo registros">
                            Crear nuevo registros
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += userRow;

            // Subtabla para los registros de movilidad
            let registrosHTML = `
                <tr>
                    <td>
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                <th>⏰ Hora Ingreso</th>
                                <th>⏳ Hora Fin</th>
                                <th>🏷️ Etiqueta 1</th>
                                <th>🏷️ Etiqueta 2</th>
                                <th>🚗 Placa</th>
                                <th>🔧 Cilindraje</th>
                                <th>📅 Modelo</th>
                                <th>🔩 Chasis</th>
                                <th>🆔 Cédula</th>
                                <th>👤 Nombre Completo</th>
                                <th>📞 Teléfono</th>
                                <th>📧 Correo</th>
                                <th>🏠 Dirección</th>
                                <th>⚙️ Acción</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            user.registros.forEach((registro) => {
                const fechaLegible = formatearFecha(registro.fecha_creacion);
                registrosHTML += `
                    <tr>
                        <td>${fechaLegible || "N/A"}</td>
                        <td>${registro.hora_fin || "----"}</td>
                        <td>${registro.etiqueta1 || "N/A"}</td>
                        <td>${registro.etiqueta2 || "N/A"}</td>
                        <td>${registro.placa}</td>
                        <td>${registro.cilindraje || "N/A"}</td>
                        <td>${registro.modelo || "N/A"}</td>
                        <td>${registro.chasis}</td>
                        <td>${registro.cedula || "N/A"}</td>
                        <td>${registro.nombreCompleto || "N/A"}</td>
                        <td>${registro.telefono || "N/A"}</td>
                        <td>${registro.correo || "N/A"}</td>
                        <td>${registro.direccion || "N/A"}</td>
                        <td>
                            <a href="javascript:void(0);" class="btn btn-success btn-sm"  data-toggle="modal" data-target="#openVerRegistroClienteModal" onclick="viewRegistro(${registro.id})" title="Ver Registro">
                                <i class="fa fa-eye"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-info btn-sm" onclick="loadRegistroForEdit(${registro.id})" title="Editar Registro">
                                <i class="fas fa-pencil-alt"></i>
                            </a>
                        </td>
                    </tr>
                `;
            });

            registrosHTML += `
                            </tbody>
                        </table>
                    </td>
                </tr>
            `;

            // Añadir subtabla al cuerpo de la tabla principal
            tableBody.innerHTML += registrosHTML;
        });
    } catch (error) {
        console.error("Error al cargar los registros agrupados:", error);
        alert("Hubo un problema al cargar los registros.");
    }
}


function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);

    // Opciones para formatear la fecha
    const opcionesFecha = {
        year: 'numeric',
        month: 'long', // Cambiar a 'short' para abreviar (Ej: Ene en lugar de Enero)
        day: '2-digit',
    };

    const opcionesHora = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // Cambiar a false para formato 24 horas
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

    return `${fechaFormateada}, ${horaFormateada}`;
}

function openCreateRegistroModal(){
    $("#nuevoModalLabelModificar").hide();
    $("#updateRegistro").hide();
    $("#createRegistro").show();
    $("#nuevoModalLabelCrear").show();
    $("#openCreateRegistroClienteModal").modal("show");
}

async function createRegistro() {
    const form = document.getElementById("createRegistroForm");
    const formData = new FormData(form);
    console.log("formData ",formData);
    const payload = {};
    formData.forEach((value, key) => {
        payload[key] = value;
    });
    console.log("payload ",payload);
    const token = localStorage.getItem("access"); // Obtener el token JWT del almacenamiento local
    return;
    try {
        const response = await fetch("http://127.0.0.1:8000/api/registro-movilidad/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Enviar el token JWT
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error al crear el registro: " + JSON.stringify(errorData));
            return;
        }

        alert("Registro creado exitosamente.");
        $("#openCreateRegistroClienteModal").modal("hide");
        // Recargar la lista o actualizar la tabla
    } catch (error) {
        console.error("Error al crear el registro:", error);
    }
}

async function loadRegistroForEdit(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/teammovilidad/api/registro-movilidad/${id}/`);
        const registro = await response.json();
        console.log("registro ",registro)
        $("#nuevoModalLabelModificar").show();
        $("#updateRegistro").show();

        $("#createRegistro").hide();
        $("#nuevoModalLabelCrear").hide();
        // Llenar el formulario con los datos
        document.getElementById("idTramite").value = registro.id;
        document.getElementById("cliente").value = registro.cliente;
        document.getElementById("total").value = registro.total;
        document.getElementById("precioLey").value = registro.precioLey;
        document.getElementById("comision").value = registro.comision;
        document.getElementById("etiqueta1").value = registro.etiqueta1;
        document.getElementById("etiqueta2").value = registro.etiqueta2;
        document.getElementById("placa").value = registro.placa;
        document.getElementById("cilindraje").value = registro.cilindraje;
        document.getElementById("modelo").value = registro.modelo;
        document.getElementById("chasis").value = registro.chasis;
        document.getElementById("cedula").value = registro.cedula;
        document.getElementById("nombreCompleto").value = registro.nombreCompleto;
        document.getElementById("telefono").value = registro.telefono;
        document.getElementById("correo").value = registro.correo;
        document.getElementById("direccion").value = registro.direccion;
        document.getElementById("tiempoTramite").value = registro.tiempoTramite;
        document.getElementById("cuentaBancaria").value = registro.cuentaBancaria;

        $("#openCreateRegistroClienteModal").modal("show");
    } catch (error) {
        console.error("Error al cargar el registro:", error);
    }
}

$(document).on("click", "#updateRegistro", function(){
    updateRegistro();
});
async function updateRegistro() {
    const form = document.getElementById("createRegistroForm");
    const formData = new FormData(form);

    const payload = {};
    formData.forEach((value, key) => {
        payload[key] = value;
    });
    const token = localStorage.getItem("access"); // Obtener el token JWT del almacenamiento local
    try {
        const response = await fetch(`${API_BASE_URL}teammovilidad/api/registro-movilidad/${payload.idTramite}/`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`, // Enviar el token JWT
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error al actualizar el registro: " + JSON.stringify(errorData));
            return;
        }

        alert("Registro actualizado exitosamente.");
        $("#openCreateRegistroClienteModal").modal("hide");
        // Recargar la lista o actualizar la tabla
    } catch (error) {
        console.error("Error al actualizar el registro:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    cargarRegistrosAgrupados();
});