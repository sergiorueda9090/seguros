
// Función para manejar el inicio de sesión

async function handleLogin() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        document.getElementById('errorMessage').textContent = 'Todos los campos son obligatorios.';
        return;
    }

    try {
        const response = await fetch('login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            document.getElementById('errorMessage').textContent = errorData.error || 'Error al iniciar sesión.';
            return;
        }

        const data = await response.json();
        
        await loginToken(username, password);
        
    } catch (error) {
        console.error('Error en la solicitud:', error);
        document.getElementById('errorMessage').textContent = 'Hubo un error al procesar la solicitud.';
    }
}


async function loginToken(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail || "No se pudo iniciar sesión"}`);
            return null;
        }

        const data = await response.json();
        localStorage.setItem("access", data.access); // Guardar token de acceso
        localStorage.setItem("refresh", data.refresh); // Guardar token de refresco

        window.location.href = '/dashboard/';
        
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al iniciar sesión.");
    }
}

// Acceder a recursos protegidos
async function accessProtectedResource() {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        alert("No tienes un token de acceso. Por favor, inicia sesión.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/login/protected/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Token expirado. Intentando refrescar...");
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    return accessProtectedResource(); // Reintenta la solicitud
                }
            } else {
                alert("Error al acceder al recurso.");
            }
            return;
        }

        const data = await response.json();
        console.log("Recurso protegido:", data);
        alert(`Recurso protegido: ${JSON.stringify(data)}`);
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Refrescar token de acceso
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
        alert("No tienes un token de refresco. Por favor, inicia sesión.");
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            alert("No se pudo refrescar el token. Por favor, inicia sesión de nuevo.");
            return false;
        }

        const data = await response.json();
        localStorage.setItem("access", data.access); // Guardar nuevo token de acceso
        alert("Token refrescado exitosamente.");
        return true;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al refrescar el token.");
        return false;
    }
}

// Cerrar sesión
function logout() {
    fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.ok) {
            // Elimina los tokens del almacenamiento local
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            alert("Cierre de sesión exitoso.");
            // Redirige al login del admin o donde prefieras
            window.location.href = "/";
        } else {
            alert("Error al cerrar sesión.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Error de red. Inténtalo de nuevo.");
    });
}
