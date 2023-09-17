let catID = localStorage.getItem("catID");

let URL_Productos = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

let arrayOriginal = [];

let filtroBusqueda = null;
let filtroPrecio = null;
let orden = null;

fetch(URL_Productos)
    .then(res => res.json())
    .then(res => {
        arrayOriginal = res.products;
        MostrarData(arrayOriginal);
    });

function recalcular() {
    let arr = arrayOriginal;
    if (filtroPrecio)
        arr = arr.filter(filtroPrecio);
    if (filtroBusqueda)
        arr = arr.filter(filtroBusqueda);
    if (orden)
        arr.sort(orden);
    MostrarData(arr);
}

const productos = document.getElementById("productos");

function MostrarData(dataArray) {
    productos.innerHTML = "";
    for (const item of dataArray) {
        productos.innerHTML += `
        <div onclick="setProdID(${item.id})" id='${item.id}' class="cuadrante cursor-active">
          <img src="${item.image}">
          <div class="contenido">
            <h2>${item.name} ${item.currency} ${item.cost}</h2>
            <p class="descripcion">${item.description}</p>
          </div>
          <div class="vendidos">
            <span>${item.soldCount} vendidos</span>
          </div>
        </div>`;
    }
}

function CambioPrecio() {
    const min = parseFloat(precioMin.value);
    const max = parseFloat(precioMax.value);

    if (!isNaN(min) && !isNaN(max)) {
        filtroPrecio = producto => producto.cost >= min && producto.cost <= max;
    } else if (!isNaN(min) || !isNaN(max)) {
        filtroPrecio = producto => producto.cost >= min || producto.cost <= max;
    } else {
        filtroPrecio = null;
    }

    recalcular();
}

document.addEventListener("DOMContentLoaded", () => {

    const busqueda = document.getElementById("search");
    const precioMin = document.getElementById("precioMin");
    const precioMax = document.getElementById("precioMax");

    busqueda.value = "";
    precioMin.value = "";
    precioMax.value = "";

    document.getElementById("ordenarAscendente").addEventListener("click", function () {
        orden = (a, b) => a.cost - b.cost;
        recalcular();
    });

    document.getElementById("ordenarDescendente").addEventListener("click", function () {
        orden = (a, b) => b.cost - a.cost;
        recalcular();
    });

    document.getElementById("ordenarRelevancia").addEventListener("click", function () {
        orden = (a, b) => b.soldCount - a.soldCount;
        recalcular();
    });

    busqueda.addEventListener("input", () => {
        const querry = clean(busqueda.value);
        if (querry.length > 0)
            filtroBusqueda = elem => clean(elem.name).includes(querry) || clean(elem.description).includes(querry)
        else
            filtroBusqueda = null;
        recalcular();
    });

    precioMin.addEventListener("input", CambioPrecio);
    precioMax.addEventListener("input", CambioPrecio);
    //document.getElementById("aplicarFiltroPrecio").addEventListener("click", CambioPrecio);

    document.getElementById("limpiarFiltroPrecio").addEventListener("click", () => {
        precioMin.value = "";
        precioMax.value = "";
        busqueda.value = "";

        filtroBusqueda = null;
        filtroPrecio = null;
        recalcular();
    });

    // para que se visualice título correspondiente según id de la categoría:
    let nombre;
    const categorias = {
        "101": "Autos",
        "102": "Juguetes",
        "103": "Muebles",
        "104": "Herramientas",
        "105": "Computadoras",
        "106": "Vestimenta",
        "107": "Electrodomésticos",
        "108": "Deporte",
        "109": "Celulares"
    };

    nombre = categorias[catID] || "Categoría Desconocida";

    document.getElementById("tituloProducto").innerHTML = nombre
    document.getElementById("tituloProducto2").innerHTML = nombre

});

function clean(arg) {
    //https://stackoverflow.com/questions/5700636/using-javascript-to-perform-text-matches-with-without-accented-characters
    return arg.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}