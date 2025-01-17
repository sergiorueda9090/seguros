
/* ========================================================== 
   ============= START RESTABLECER FORMULARIO ===============
   ========================================================== 
*/
function resetCreateRegistroForm() {
    // Restablecer todos los inputs de texto, select y textarea
    const form = document.getElementById("createRegistroForm");

    // Restablecer valores predeterminados para los inputs de texto
    form.reset();

    // Configurar valores predeterminados específicos si es necesario
    document.getElementById("cliente").value = ""; // Predeterminado vacío
    document.getElementById("tipoDocumento").value = "CC"; // Predeterminado a Cédula de Ciudadanía
    document.getElementById("etiqueta1").value = "";
    document.getElementById("etiqueta2").value = "";
    document.getElementById("placa").value = "";
    document.getElementById("cilindraje").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("chasis").value = "";
    document.getElementById("numeroDocumento").value = "";
    document.getElementById("nombreCompleto").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("idTramite").value = "";

    // Restablecer estados de los botones si es necesario
    document.getElementById("createRegistro").style.display = "inline-block";
    document.getElementById("updateRegistro").style.display = "none";

    // Si estás usando select2, reinicia también
    //$('.select2').val('').trigger('change');
}

/* ========================================================== 
   ============= END RESTABLECER FORMULARIO =================
   ========================================================== 
*/

/* ========================================================== 
   ============= START initializeTabNavigation =================
   ========================================================== 
*/
function initializeTabNavigation(id, etiquetaUno) {
    // Seleccionar todas las pestañas
    const tabs = document.querySelectorAll('.nav-link');

    // Habilitar/Deshabilitar las etapas según las condiciones
    if (id) {
        document.querySelector('[data-target="#etapaUno"]').classList.remove('disabled');
        document.querySelector('[data-target="#etapaDos"]').classList.remove('disabled');

        // Si etiquetaUno tiene valor, habilitar la etapaTres
        if (etiquetaUno) {
            document.querySelector('[data-target="#etapaTres"]').classList.remove('disabled');
        } else {
            document.querySelector('[data-target="#etapaTres"]').classList.add('disabled');
        }
    } else {
        document.querySelector('[data-target="#etapaUno"]').classList.remove('disabled'); // Siempre habilitada
        document.querySelector('[data-target="#etapaDos"]').classList.add('disabled');
        document.querySelector('[data-target="#etapaTres"]').classList.add('disabled');
    }

    // Por defecto, activar la Etapa Uno
    tabs.forEach(link => link.classList.remove('active')); // Remover cualquier clase activa
    document.querySelector('[data-target="#etapaUno"]').classList.add('active'); // Activar Etapa Uno
    document.querySelectorAll('.tab-pane').forEach(content => content.classList.remove('active'));
    document.querySelector('#etapaUno').classList.add('active'); // Mostrar contenido de Etapa Uno

    // Añadir eventos de clic a las pestañas
    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            // Verificar si la pestaña está deshabilitada
            if (this.classList.contains('disabled')) {
                return;
            }

            // Quitar la clase activa de todas las pestañas y sus contenidos
            tabs.forEach(link => link.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(content => content.classList.remove('active'));

            // Activar la pestaña seleccionada y mostrar su contenido
            this.classList.add('active');
            const target = this.getAttribute('data-target');
            document.querySelector(target).classList.add('active');
        });
    });
}

/* ========================================================== 
   ============= END initializeTabNavigation =================
   ========================================================== 
*/
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
    initializeTabNavigation();
    resetCreateRegistroForm();
    $("#nuevoModalLabelModificar").hide();
    $("#updateRegistro").hide();
    $("#createRegistro").show();
    $("#nuevoModalLabelCrear").show();
    $("#openCreateRegistroClienteModal").modal("show");
}

document.getElementById("createRegistro").addEventListener("click", function () {
    const form = document.getElementById("createRegistroForm");
    const inputs = form.querySelectorAll("input, select, textarea");

    let isValid = true;

    inputs.forEach((input) => {
        const value = input.value.trim(); // Eliminar espacios al inicio y al final
        const isRequired = input.hasAttribute("required");

        // Validar si es requerido y está vacío
        if (isRequired && value === "") {
            isValid = false;
            alert(`El campo "${input.name}" es obligatorio.`);
        }

        // Validar espacios en blanco al inicio o al final
        if (value !== input.value) {
            isValid = false;
            alert(`El campo "${input.name}" no debe tener espacios al inicio o al final.`);
        }

        // Asignar el valor limpio al input (sin espacios al inicio o final)
        input.value = value;
    });

    if (!isValid) {
        return; // Detener el envío si hay errores
    }

    // Crear el payload si la validación es exitosa
    const formData = new FormData(form);
    const payload = {};

    formData.forEach((value, key) => {
        payload[key] = value.trim(); // Asegurar que el valor no tenga espacios en blanco
    });

    console.log("Payload validado:", payload);

    // Aquí puedes llamar a la función que realiza el envío
    enviarFormulario(payload);
});

async function enviarFormulario(payload) {
    const token = localStorage.getItem("access"); // Obtener el token JWT del almacenamiento local
    try {
        const response = await fetch(`${API_BASE_URL}/teammovilidad/api/registro-movilidad/`, {
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
    } catch (error) {
        console.error("Error al crear el registro:", error);
    }
}

//LISTAR REGISTROS
document.addEventListener("DOMContentLoaded", () => {
    initializeTabNavigation();
    resetCreateRegistroForm();
    cargarRegistrosAgrupados();
});

// SHOW GESTIÓN DE TRÁMITES
async function viewRegistro(idRegistro) {
    if (!idRegistro) {
        alert("ID de registro no proporcionado.");
        return;
    }

    try {
        // Mostrar confirmación opcional
        console.log(`Cargando registro con ID: ${idRegistro}`);

        // URL del endpoint
        const url = `${API_BASE_URL}/teammovilidad/api/registro-movilidad-subregistros/${idRegistro}/`;

        // Realizar la solicitud al backend
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`, // Token de autenticación
            },
        });

        // Validar la respuesta del servidor
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al obtener el registro.");
        }

        // Procesar los datos del registro
        const data = await response.json();
        console.log("Datos del registro:", data);

        // Validar la estructura de los datos
        if (!data.registro_movilidad || !data.usuario || !Array.isArray(data.subregistros)) {
            throw new Error("La respuesta del servidor tiene un formato inválido.");
        }

        // Mostrar datos del registro principal
        
        const usuario           = data.usuario;
        const subregistros      = data.subregistros;

        // Cargar los datos del registro en el formulario
        const registro = data.registro_movilidad;
        console.log("REGISTRO ",registro);
        document.getElementById("clienteVer").value = registro.cliente || "";
        document.getElementById("etiqueta1Ver").value = registro.etiqueta1 || "";
        document.getElementById("etiqueta2Ver").value = registro.etiqueta2 || "";
        document.getElementById("placaVer").value = registro.placa || "";
        document.getElementById("cilindrajeVer").value = registro.cilindraje || "";
        document.getElementById("modeloVer").value = registro.modelo || "";
        document.getElementById("chasisVer").value = registro.chasis || "";
        document.getElementById("tipoDocumentoVer").value = registro.tipoDocumento || "";
        document.getElementById("numeroDocumentoVer").value = registro.numeroDocumento || "";
        document.getElementById("nombreCompletoVer").value = registro.nombreCompleto || "";
        document.getElementById("telefonoVer").value = registro.telefono || "";
        document.getElementById("correoVer").value = registro.correo || "";
        document.getElementById("direccionVer").value = registro.direccion || "";
        document.getElementById("idTramite").value = registro.id || "";

        // Mostrar subregistros (historial)
        if (subregistros.length > 0) {

            console.log("Historial de cambios:");

            // Limpiar la tabla de subregistros
            const tableBody = document.querySelector("#verTableTeamMovilidad tbody");
            tableBody.innerHTML = "";

            // Cargar subregistros en la tabla
            const subregistros = data.subregistros;

            subregistros.forEach((subregistro) => {
                const row = `
                    <tr>
                        <td>${data.usuario.username}</td>
                        <td>${subregistro.accion}</td>
                        <td>${subregistro.campo_modificado}</td>
                        <td>${subregistro.valor_antes}</td>
                        <td>${subregistro.valor_despues}</td>
                        <td>${new Date(registro.fecha_creacion).toLocaleString()}</td>
                        <td>${new Date(registro.fecha_creacion).toLocaleString()}</td>
                        <td>${registro.etiqueta1 || "N/A"}</td>
                        <td>${registro.etiqueta2 || "N/A"}</td>
                        <td>${registro.placa || "N/A"}</td>
                        <td>${registro.cilindraje || "N/A"}</td>
                        <td>${registro.modelo || "N/A"}</td>
                        <td>${registro.chasis || "N/A"}</td>
                        <td>${registro.cedula || "N/A"}</td>
                        <td>${registro.nombreCompleto || "N/A"}</td>
                        <td>${registro.telefono || "N/A"}</td>
                        <td>${registro.correo || "N/A"}</td>
                        <td>${registro.direccion || "N/A"}</td>
                        <td>${subregistro.fecha_creacion || "N/A"}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

        } else {
            console.log("No hay historial de cambios para este registro.");
        }

        // Aquí puedes cargar los datos en un modal, tabla o algún componente de la interfaz
        // Ejemplo: openModalConDatos(data);

    } catch (error) {
        console.error("Error al cargar el registro:", error.message);
        alert("Error al cargar el registro. Por favor, intenta de nuevo.");
    }
}

// Asignar valor al select con Select2
const setSelect2Value = (id, value) => {
    const element = $(`#${id}`); // Usar jQuery para manipular Select2
    if (element.length > 0) {
        element.val(value).trigger('change'); // Asigna el valor y dispara el evento 'change'
    } else {
        console.error(`El elemento con ID "${id}" no existe.`);
    }

    // Mostrar u ocultar campos adicionales según el valor seleccionado
    if (value === "LINK DE PAGO") {
        $('#linkPagoFields').removeClass('d-none'); // Mostrar los campos adicionales
    } else {
        $('#linkPagoFields').addClass('d-none'); // Ocultar los campos adicionales
    }
};

// Función para seleccionar el radio button según el valor enviado desde la base de datos
function setRadioValue(name, value) {
    // Seleccionar el radio button con el nombre y valor proporcionados
    const radioButton = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radioButton) {
        radioButton.checked = true; // Marcar como seleccionado
    } else {
        console.error(`No se encontró un radio button con el valor "${value}" para el nombre "${name}".`);
    }
}

//EDITAR REGISTRO
async function loadRegistroForEdit(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/teammovilidad/api/registro-movilidad/${id}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || "Error al cargar el registro.");
            return;
        }

        const registro = await response.json();
     

        // Mostrar botones y etiquetas para edición
        $("#nuevoModalLabelModificar").show();
        $("#updateRegistro").show();
        $("#createRegistro").hide();
        $("#nuevoModalLabelCrear").hide();

        // Asignar valores a los campos del formulario con verificación de existencia
        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value || ""; // Si el valor es nulo o indefinido, asigna una cadena vacía
            }
        };
        console.log("registro.etiqueta2 ",registro.etiqueta2)
        
        //Funcion para Habilitar la etapaDo
        initializeTabNavigation(registro.id, registro.etiqueta1);

        setValue("idTramite", registro.id);
        setValue("idTramiteEtapaDos", registro.id);
        setValue("cliente", registro.cliente);
        setValue("etiqueta1", registro.etiqueta1);
        setValue("etiqueta2", registro.etiqueta2);

        // Llamar la función para seleccionar el valor en "etapaDosetiqueta2"
        setSelect2Value("etapaDosetiqueta1", registro.etiqueta1);

       // Llamar la función para seleccionar el valor en "etapaDosetiqueta2"
        setSelect2Value("etapaDosetiqueta2", registro.etiqueta2);
        setValue("linkpago", registro.linkpago);
        
        // Llamar la función con los valores adecuados
        setRadioValue("pagoinmediato", registro.pagoinmediato);

        setValue("placa", registro.placa);
        setValue("cilindraje", registro.cilindraje);
        setValue("modelo", registro.modelo);
        setValue("chasis", registro.chasis);
        setValue("numeroDocumento", registro.numeroDocumento);
        setValue("nombreCompleto", registro.nombreCompleto);
        setValue("telefono", registro.telefono);
        setValue("correo", registro.correo);
        setValue("direccion", registro.direccion);
        setValue("tipoDocumento", registro.tipoDocumento);
        setValue("tiempoTramite", registro.tiempoTramite);
        setValue("cuentaBancaria", registro.cuentaBancaria);

        
        // Mostrar el modal de edición
        $("#openCreateRegistroClienteModal").modal("show");
    } catch (error) {
        console.error("Error al cargar el registro:", error);
        alert("Hubo un problema al cargar el registro. Por favor, inténtalo de nuevo.");
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
    console.log("payload ",payload);

    try {
        const response = await fetch(`${API_BASE_URL}/teammovilidad/api/registro-movilidad/${payload.idTramite}/`, {
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

/* ============================================================
        ============== START ETAPA DOS ===================
   ===========================================================*/
$(document).on("click", "#updateRegistroEtapaDos", function(){
    updateRegistroEtapaDos();
});

async function updateRegistroEtapaDos() {

    const form = document.getElementById("createRegistroFormEtapaDos");
    
    const formData = new FormData(form);

    const payload = {};
    
    formData.forEach((value, key) => {
        payload[key] = value;
    });
    
    const token = localStorage.getItem("access"); // Obtener el token JWT del almacenamiento local
    
    try {
        const response = await fetch(`${API_BASE_URL}/teammovilidad/api/registro-movilidad/${payload.idTramite}/`, {
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

/* ============================================================
        ================= END ETAPA DOS ===================
   ===========================================================*/
