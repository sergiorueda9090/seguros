

async function logout() {


    fetch(`${API_BASE_URL}/api/login/logout/`, {
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