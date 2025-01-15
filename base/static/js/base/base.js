
const BASE_URL = "http://127.0.0.1:8000";
//const BASE_URL = "https://seguros.sergiodevsolutions.com"; //produccion

async function logout() {

    const refreshToken = localStorage.getItem("access");

    if (refreshToken) {
        try {
            await fetch(`${BASE_URL}/api/login/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });
        } catch (error) {
            console.error("Error al revocar el token:", error);
        }
    }

    // Eliminar los tokens del localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Redirigir al inicio de sesión
    window.location.href = "/";
}