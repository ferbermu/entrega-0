// Estas son las consecuencias sobredosis de Angular
// Este componente se puede agregar a cualquier pagina para agregar
// una llave para el modo dark, utilizando refleccion

//para usarlo, simplemente agregar <script src="js/darkMode.js"></script> en donde queres el boton

const self = document.currentScript;

document.addEventListener("DOMContentLoaded", () => {

    //crea un elemento temporal para convertir el string en un Nodo del DOM
    let temp = document.createElement("div")
    temp.innerHTML = "<div class='botones_dark'><button class='switch'><i></i><i></i></button></div>";

    //inserta la llave debajo del script, la posicion del script define la posicion de la llave
    const botones_dark = temp.children[0];
    self.parentNode.insertBefore(botones_dark, self.nextSibling)

    const btnSwitch = botones_dark.children[0];

    // Aplica el modo oscuro si estaba activado en el localStorage
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        btnSwitch.classList.add("active");
    }

    btnSwitch.addEventListener("click", () => {
        // Alterna la clase "dark" en el cuerpo del documento
        document.body.classList.toggle("dark");

        // Alterna la clase "active" en el propio botón
        btnSwitch.classList.toggle("active");

        // Guarda el estado actual del modo oscuro en el localStorage
        const isDarkModeActive = document.body.classList.contains("dark");
        localStorage.setItem("darkMode", isDarkModeActive);
    });
});






//backup
//<div class='botones_dark'><button class='switch' id='switch'> <i ></i> <i ></i></button></div>
/*let btnSwitch = document.getElementById("switch");

// Recupera el estado del modo oscuro desde el localStorage
const isDarkMode = localStorage.getItem("darkMode") === "true";

// Aplica el modo oscuro si estaba activado
if (isDarkMode) {
    document.body.classList.add("dark");
    btnSwitch.classList.add("active");
}

// Agrega un evento de clic al botón
btnSwitch.addEventListener("click", () => {
    // Alterna la clase "dark" en el cuerpo del documento
    document.body.classList.toggle("dark");

    // Alterna la clase "active" en el propio botón
    btnSwitch.classList.toggle("active");

    // Guarda el estado actual del modo oscuro en el localStorage
    const isDarkModeActive = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDarkModeActive);
});*/