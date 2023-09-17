let comentarios = []
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
        )

        document.getElementById("texto").value = "";
        document.getElementById("stars").value = "";
        mostrarComentarios();
    })

})

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
            mostrarDatosDelProducto(productData);
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
}

function mostrarDatosDelProducto(productData) {
    let productName = document.getElementById("nombre-producto");
    let productPrice = document.getElementById("precio-producto");
    let productDescription = document.getElementById("descripcion-producto");
    let productCategory = document.getElementById("categoria-producto");
    let productSoldCount = document.getElementById("vendidos-producto");
    let productImages = document.getElementById("imagenes-producto");

    productName.innerHTML = `${productData.name}`;
    productPrice.innerHTML = `<br><strong>Precio:</strong> <br>${productData.currency} ${productData.cost}`;
    productDescription.innerHTML = `<br><strong>Descripción:</strong> <br>${productData.description}`;
    productCategory.innerHTML = `<br><strong>Categoría:</strong> <br>${productData.category}`;
    productSoldCount.innerHTML = `<br><strong>Cantidad de vendidos:</strong><br> ${productData.soldCount}`;

    for (let imageSrc of productData.images) {
        let imageDiv = document.createElement("div") ;
        let imgElement = document.createElement("img");

        imageDiv.classList.add("col-md-3");

        imgElement.classList.add("img-thumbnail");

        imgElement.src = imageSrc;
        imageDiv.appendChild(imgElement);
        productImages.appendChild(imageDiv);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let productId = localStorage.getItem("prodID");

    if (productId) {
        obtenerDatosDelProducto(productId);
    }
});


