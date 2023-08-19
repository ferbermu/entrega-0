let URL_InfoAutos = "https://japceibal.github.io/emercado-api/cats_products/101.json";

  
fetch(URL_InfoAutos)
.then(res => res.json())
.then(res => {

MostrarData(res.products)
})

let productos=document.getElementById("productos");

function MostrarData(dataArray) {

   for (const item of dataArray) {
     
     productos.innerHTML += `<div class="cuadrante"> <img src="${item.image}"> <div><h2>${item.name} 
     ${item.currency} ${item.cost}</h2> <p class ="descripcion"> ${item.description} </p></div> <div class ="vendidos"><span>${item.soldCount} vendidos</span></div>
     
     </div>`; 
   }
 }