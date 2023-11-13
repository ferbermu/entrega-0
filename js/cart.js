// ---------------------------------------
// FUNCIONALIDAD DEL CARRITO
// ---------------------------------------

let usuario = "25801";
let URL = `https://japceibal.github.io/emercado-api/user_cart/${usuario}.json`;

fetch(URL)
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(res => {
        let productos = res.articles;
        let prodLocal = JSON.parse(localStorage.getItem("prodsCarrito")) || [];

        productos.forEach(e => {
            if (!prodLocal.find(p => p.id == e.id))
                prodLocal.push(e)
        });
        localStorage.setItem("prodsCarrito", JSON.stringify(prodLocal));

        MostrarDataProductos();
        actualizarTotal();
    })


function MostrarDataProductos() {
    let productos = document.getElementById("productos");
    productos.innerHTML = "";
    cartInfo = JSON.parse(localStorage.getItem("prodsCarrito")) || [];
    for (let i = 0; i < cartInfo.length; i++) {
        const item = cartInfo[i];
        productos.innerHTML += `
            <div class="cart-grid" id="div${i}">
                <div>
                    <img src="${item.image}" class="img-fluid">
                </div>
                <div>
                    <h6 class="text-black mb-0">${item.name}</h6>
                </div>
                <div>
                    <input type="number" id="number${i}" value="${item.count}" min="1" oninput="updateVal(${i})" class="form-control form-control-sm">
                </div>
                <div>
                    <div class="subtotal"><strong>${item.currency} </strong><p id="subtotal${i}">${item.count * item.unitCost}</p></div>
                </div>
                <div class="trash-icon">
                    <i class="fa-solid fa-trash" onclick="del(${i})"></i> 
                </div>
            </div>
            <hr id="hr${i}"/>
        `
    }
}

function del(i) {
    let cartInfo = JSON.parse(localStorage.getItem("prodsCarrito")) || [];
    cartInfo.splice(i, 1);
    localStorage.setItem("prodsCarrito", JSON.stringify(cartInfo));

    document.getElementById("div" + i).remove();
    document.getElementById("hr" + i).remove();

    actualizarTotal();
}

function updateVal(i) {
    let cartInfo = JSON.parse(localStorage.getItem("prodsCarrito")) || [];

    let newCount = document.getElementById("number" + i).value;
    cartInfo[i].count = newCount;
    document.getElementById("subtotal" + i).innerHTML = newCount * cartInfo[i].unitCost;

    localStorage.setItem("prodsCarrito", JSON.stringify(cartInfo));
    actualizarTotal();
}

// FUNCIONALIDAD TOTAL
const subtotal = document.getElementById("subtotal");
const envio = document.getElementById("envio");
const total = document.getElementById("total");
const pesosSwitch = document.getElementById("pesosSwitch"); //true = USD
const currency = document.getElementById("currency");

const shipping = document.getElementById("shipping");
const opt15 = document.getElementById("opt15");
const opt7 = document.getElementById("opt7");
const opt5 = document.getElementById("opt5");

function actualizarTotal() {
    let fee = 0;
    if (shipping.children[shipping.selectedIndex] == opt15)
        fee = .15;
    if (shipping.children[shipping.selectedIndex] == opt7)
        fee = .07;
    if (shipping.children[shipping.selectedIndex] == opt5)
        fee = .05;

    let totalUyu = 0, totalUsd = 0;
    let cartInfo = JSON.parse(localStorage.getItem("prodsCarrito")) || [];

    cartInfo.forEach(e => {
        if (e.currency == "UYU")
            totalUyu += e.count * e.unitCost;
        else //if (e.currency == "USD")
            totalUsd += e.count * e.unitCost;
    });

    if (pesosSwitch.checked) //true = USD
        subtotal.innerHTML = totalUsd + uyuToUsd * totalUyu;
    else
        subtotal.innerHTML = totalUyu + usdToUyu * totalUsd;

    subtotal.innerHTML = Number(subtotal.innerHTML).toFixed(pesosSwitch.checked ? 2 : 0);
    envio.innerHTML = (subtotal.innerHTML * fee).toFixed(pesosSwitch.checked ? 2 : 0);
    total.innerHTML = (Number(subtotal.innerHTML) + Number(envio.innerHTML)).toFixed(pesosSwitch.checked ? 2 : 0);
}

let uyuToUsd = 1 / 40;//aproximaciones, mientras carga la API
let usdToUyu = 40;//aproximaciones, mientras carga la API

document.addEventListener("DOMContentLoaded", () => {
    pesosSwitch.checked = false;

    //en vez de llamar la api cada vez, llamarla una para obtener el factor de cambio y hacer la multiplicacion en js
    convert("UYU", "USD", 1).then(s => {
        uyuToUsd = s.result;
        if (pesosSwitch.checked)
            actualizarTotal();
    });
    convert("USD", "UYU", 1).then(s => {
        usdToUyu = s.result;
        if (!pesosSwitch.checked)
            actualizarTotal();
    });

    pesosSwitch.addEventListener("click", () => {
        if (pesosSwitch.checked) //true = USD
            currency.innerHTML = "USD";
        else
            currency.innerHTML = "UYU";
        actualizarTotal();
    });
    shipping.addEventListener("input", () => {
        actualizarTotal();
    })
});

//convertir con rapidApi
function convert(from, to, amount) {
    return fetch(`https://currency-exchange.p.rapidapi.com/exchange?to=${to}&from=${from}&q=${amount}`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'X-RapidAPI-Key': 'f99a82174amsha93c523bc058623p1daae9jsnb888b861843a',
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
    }).then(res => res.text())
        .then(res => new Promise((yes, no) => yes({ result: res })));//convertir respuesta a Json para ser intercambiable con la de apiLayer
}

/* nos quedamos sin requests para apilayer
function convert(from, to, amount) {
    return fetch(`https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'apikey': 'L87u6fDedIWJx4VjZusOC8tOscbETQ8d'
        }
    }).then(response => response.json());
}*/

// FIN TOTAL--------------------------------------- 


function deshabilitar() {

    const tarjeta = document.getElementById("tarjeta");
    const transferencia = document.getElementById("transferencia");
    const numeroTarjeta = document.getElementById("numeroTarjeta");
    const vencimiento = document.getElementById("vencimiento");
    const codigoSeguridad = document.getElementById("codigoSeguridad");
    const numeroCuenta = document.getElementById("numeroCuenta");

    numeroTarjeta.disabled = transferencia.checked;
    vencimiento.disabled = transferencia.checked;
    codigoSeguridad.disabled = transferencia.checked;
    tarjeta.disabled = transferencia.checked;

    numeroCuenta.disabled = tarjeta.checked;
    transferencia.disabled = tarjeta.checked;
}


function validaciones() {

    let transferencia = document.getElementById("transferencia");
    let tarjeta = document.getElementById("tarjeta");
    let resultado = true;

    if (!tarjeta.checked && !transferencia.checked) { // si no se seleccionó ninguna forma de pago...
        resultado = false;
        document.getElementById("formaPago").classList.replace("btn-secondary", "btn-outline-danger");
        document.getElementById("feedback-formaPago").style.display = "inline";

    } else {
        document.getElementById("formaPago").classList.replace("btn-outline-danger", "btn-secondary");
        document.getElementById("feedback-formaPago").style.display = "none";
    }

    return resultado;
}


document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("tarjeta").addEventListener("click", () => {
        deshabilitar()
    })

    document.getElementById("transferencia").addEventListener("click", () => {
        deshabilitar()
    })

    document.getElementById("guardarBoton").addEventListener("click", () => {
        validaciones()
    })

    document.getElementById("formCompra").addEventListener("submit", e => {
        e.preventDefault();

        const isValid = validaciones() && formCompra.checkValidity(); // condición
        // checkValidity devuelve true si el formulario es válido:
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity

        if (!isValid) {
            e.stopPropagation(); // Evita que se propague el evento submit
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Complete los espacios en rojo!',
            })
        } else {
            setTimeout(() => {
                document.getElementById("formCompra").submit();
                document.location.reload();
            }, 3000)
            Swal.fire({
                con: 'success',
                title: 'Compra exitosa'
            })
        }

        formCompra.classList.add('was-validated'); // Agrega clases de validación Bootstrap
    });
})