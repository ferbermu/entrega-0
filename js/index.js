document.addEventListener("DOMContentLoaded", function () {

    /////////// usuario y permanencia
    if (!localStorage.getItem("user")) {
        window.location = "./login.html"
    } else {
        document.title = JSON.parse(localStorage.getItem("user")).mail
    }
    /////////// fin 

    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});