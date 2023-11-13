document.addEventListener("DOMContentLoaded", () => {

    /////////// usuario y permanencia
    if (!localStorage.getItem("user")) {
        window.location = "./login.html"
    } else {
        document.title = JSON.parse(localStorage.getItem("user")).mail
    }
    /////////// fin 

    document.getElementById("autos").addEventListener("click", () => {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });

    document.getElementById("juguetes").addEventListener("click", () => {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });

    document.getElementById("muebles").addEventListener("click", () => {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

/*
let btnSwitch = document.getElementById("switch");

// Recupera el estado del modo oscuro desde el localStorage
const isDarkMode = localStorage.getItem("darkMode") === "true";

// Aplica el modo oscuro si estaba activado
if (isDarkMode) {
    btnSwitch.classList.add("active");
}

// Agrega un evento de clic al botón
btnSwitch.addEventListener("click", () => {
    // Alterna la clase "active" en el propio botón
    btnSwitch.classList.toggle("active");

    // Guarda el estado actual del modo oscuro en el localStorage
    const isDarkModeActive = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDarkModeActive);
});
*/