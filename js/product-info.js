let comentarios = []
let producto = null;
const prodID = localStorage.getItem("prodID")
const URLComentarios = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE

// función para mostrar cada uno de los comentarios en product-info.html
function mostrarComentarios() {
    let contenidoHTML = ""
    comentarios.forEach((comentario) => {
        contenidoHTML +=
            `<div class="card mb-3">
            <div class="card-body">
                <div class="d-flex">
                    <div class="w-100">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="text-primary mb-0"> 
                                ${comentario.user}
                                <span class="text-dark mb-3">${comentario.description}</span> 
                            </h6>
                            <p class="mb-0">${comentario.dateTime}</p>
                        </div>
                        <div class="d-flex flex-row">
                            ${estrellas(comentario.score)}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    })

    document.getElementById("comentarios").innerHTML = contenidoHTML;
}


// función para mostrar estrellas en los comentarios
function estrellas(score) {
    let estrella = ``
    for (let i = 0; i < 5; i++) {
        if (i < score) {
            estrella += `<i class="fa fa-star checked"></i>`
        } else {
            estrella += `<i class="fa fa-star"></i>`
        }
    }

    return estrella;
}

function pad(a) {
    return ("" + a).padStart(2, '0');
}

function getTime() {// formato: '2020-02-21 15:05:22'
    const now = new Date();
    return "" + now.getFullYear() + "-" + pad(now.getMonth()) + "-" + pad(now.getDate()) + " " +
        pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds())
}

document.addEventListener("DOMContentLoaded", () => {

    // obtener los comentarios del json
    getJSONData(URLComentarios).then((result) => {
        if (result.status === "ok") {
            comentarios = result.data;
        }
    }).then(() => {
        let comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || [];
        comentarios = comentarios.concat(comentariosGuardados.filter(e => e.product == prodID));
        mostrarComentarios();
    })


    let boton = document.getElementById("comentar");

    boton.addEventListener("click", () => {
        let comentario = document.getElementById("texto").value
        let valorEstrella = document.getElementById("stars").value
        let tiempo = getTime();
        let user = JSON.parse(localStorage.getItem("user"));
        let comentarioData = {
            user: user.mail,
            description: comentario,
            score: valorEstrella,
            dateTime: tiempo,
            product: prodID
        };
        //mostrar nuevo comentario
        comentarios.push(comentarioData);

        //guardar nuevo comentario para despues
        let comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || [];
        comentariosGuardados.push(comentarioData);
        localStorage.setItem("comentarios", JSON.stringify(comentariosGuardados));

        Swal.fire(
            'Enviado!',
            'Nuevo comentario guardado con exito',
            'success'
        );

        document.getElementById("texto").value = "";
        document.getElementById("stars").value = "";
        mostrarComentarios();
    });

    let productId = localStorage.getItem("prodID");

    if (productId) {
        obtenerDatosDelProducto(productId);
    }

    let carr = JSON.parse(localStorage.getItem("prodsCarrito")) || []

    if (carr.find(e => e.id == prodID)) {
        document.getElementById("comprar").setAttribute("disabled", "")
    } else {
        document.getElementById("comprar").addEventListener("click", () => {
            let arr = JSON.parse(localStorage.getItem("prodsCarrito")) || []
            arr.push({
                id: prodID,
                name: producto.name,
                count: 1,
                unitCost: producto.cost,
                currency: producto.currency,
                image: producto.images[0]
            });
            localStorage.setItem("prodsCarrito", JSON.stringify(arr));
            Swal.fire("Agregado al carrito",
                "Se puede modificar la cantidad desde el 'carrito'",
                "success")
            document.getElementById("comprar").setAttribute("disabled", "")
        });
    }
});

function obtenerDatosDelProducto(productId) {
    let productInfoUrl = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

    fetch(productInfoUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("No se pudo obtener la información del producto.");
        })
        .then(productData => {
            producto = productData;
            mostrarDatosDelProducto();
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
}

function mostrarDatosDelProducto() {
    productData = producto;
    let productName = document.getElementById("nombre-producto");
    let productPrice = document.getElementById("precio-producto");
    let productDescription = document.getElementById("descripcion-producto");
    let productCategory = document.getElementById("categoria-producto");
    let productSoldCount = document.getElementById("vendidos-producto");
    //let productImages = document.getElementById("imagenes-producto");
    let productRelacionados = document.getElementById("relacionados");

    productName.innerHTML = `${productData.name}`;
    productPrice.innerHTML = `<br><strong>Precio:</strong> <br>${productData.currency} ${productData.cost}`;
    productDescription.innerHTML = `<br><strong>Descripción:</strong> <br>${productData.description}`;
    productCategory.innerHTML = `<br><strong>Categoría:</strong> <br>${productData.category}`;
    productSoldCount.innerHTML = `<br><strong>Cantidad de vendidos:</strong><br> ${productData.soldCount}`;

    // Carousel imagenes
    let carouselImgs = document.getElementById("carouselImgs");
    let carouselBtns = document.getElementById("carouselBtns");
    carouselImgs.innerHTML = "";
    carouselBtns.innerHTML = "";

    for (let i = 0; i < productData.images.length; i++) {
        carouselImgs.innerHTML += `<div class="carousel-item">
            <img src="${productData.images[i]}" class="d-block w-100">
        </div>`
        carouselBtns.innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="${i}" aria-label="Slide ${i + 1}"></button>`

    }
    carouselBtns.childNodes[0].setAttribute("aria-current", "true");
    carouselBtns.childNodes[0].classList.add("active");
    carouselImgs.childNodes[0].classList.add("active");
    //FIN Carousel

    for (let prod of productData.relatedProducts) {
        productRelacionados.innerHTML += `
        <div class="col-md-3 mb-2">
            <button class="btn btn-light btn-block custom-btn" onclick="setProdID(${prod.id})">
                <h4 class="fw-bold">${prod.name}</h4>
                <img src="${prod.image}" alt="${prod.name}" class="img-thumbnail"/>
            </button>
        </div>`;
    }
}