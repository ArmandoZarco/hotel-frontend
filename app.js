const API_URL = "http://localhost:3000";

setInterval(() => {

document.getElementById("fechaActual").innerHTML =
new Date().toLocaleString();

},1000);

async function obtenerReservas(){

try{

const res =
await fetch(`${API_URL}/reservas`);

const datos =
await res.json();

const tabla =
document.getElementById("tabla");

tabla.innerHTML = "";

let ingresos = 0;

let ocupadas = 0;

let finalizadas = 0;

let huespedes = 0;

const habitaciones =
document.getElementById("habitaciones");

habitaciones.innerHTML = "";

for(let num=1; num<=200; num++){

let estado = "Disponible";
let emoji = "🟢";
let color = "#16a34a";

const reservaActiva =

datos.find(r=>

r.habitacion===num &&

(
r.estado==="Reservada" ||
r.estado==="Ocupada"
)

);

if(reservaActiva){

estado = "Ocupada";
emoji = "🔴";
color = "#dc2626";

}

habitaciones.innerHTML += `

<div
class="hab"
style="border-left:8px solid ${color}"
>

<h2>${String(num).padStart(3,'0')}</h2>

<p>${emoji} ${estado}</p>

</div>

`;

}

datos.forEach(r=>{

ingresos += Number(r.total || 0);

huespedes += Number(r.personas || 0);

if(
r.estado==="Ocupada" ||
r.estado==="Reservada"
){
ocupadas++;
}

if(r.estado==="Finalizada")
finalizadas++;

let estado = "🟡 Reservada";

if(r.estado==="Ocupada")
estado="🔴 Ocupada";

if(r.estado==="Finalizada")
estado="🟢 Finalizada";

if(r.estado==="Cancelada")
estado="⚫ Cancelada";

tabla.innerHTML += `

<tr>

<td>${r.cliente}</td>

<td>${r.habitacion}</td>

<td>${r.tipo}</td>

<td>$${r.total}</td>

<td>${estado}</td>

<td>

<button
class="checkin"
onclick="checkIn('${r._id}')">
Check-In
</button>

<button
class="checkout"
onclick="checkOut('${r._id}')">
Check-Out
</button>

<button
class="cancelar"
onclick="cancelarReserva('${r._id}')">
Cancelar
</button>

<button
class="eliminar"
onclick="eliminarReserva('${r._id}')">
Eliminar
</button>

</td>

</tr>

`;

});

document.getElementById("totalReservas")
.textContent = datos.length;

document.getElementById("ocupadas")
.textContent = ocupadas;

document.getElementById("finalizadas")
.textContent = finalizadas;

document.getElementById("ingresos")
.textContent = "$"+ingresos;

document.getElementById("huespedes")
.textContent = huespedes;

document.getElementById("disponibles")
.textContent =
200 - ocupadas;

}catch(error){

console.log(error);

}

}

document
.getElementById("formReserva")
.addEventListener("submit", async(e)=>{

e.preventDefault();

const entrada =
new Date(
document.getElementById("entrada").value
);

const salida =
new Date(
document.getElementById("salida").value
);

const noches =
(salida-entrada)/(1000*60*60*24);

const precio =
Number(
document.getElementById("precio").value
);

const total =
noches * precio;

const reserva = {

cliente:
document.getElementById("cliente").value,

telefono:
document.getElementById("telefono").value,

habitacion:
Number(
document.getElementById("habitacion").value
),

tipo:
document.getElementById("tipo").value,

entrada:
document.getElementById("entrada").value,

salida:
document.getElementById("salida").value,

personas:
Number(
document.getElementById("personas").value
),

precio,
total

};

const res =
await fetch(
`${API_URL}/reservas`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(reserva)
}
);

const respuesta =
await res.json();

if(!res.ok){

alert(respuesta.mensaje);
return;

}

alert("Reserva registrada");

document
.getElementById("formReserva")
.reset();

obtenerReservas();

});

async function checkIn(id){

await fetch(

`${API_URL}/checkin/${id}`,

{
method:"PUT"
}

);

obtenerReservas();

}

async function checkOut(id){

await fetch(

`${API_URL}/checkout/${id}`,

{
method:"PUT"
}

);

obtenerReservas();

}

async function cancelarReserva(id){

await fetch(

`${API_URL}/cancelar/${id}`,

{
method:"PUT"
}

);

obtenerReservas();

}

async function eliminarReserva(id){

const confirmar =
confirm(
"¿Eliminar esta reserva?"
);

if(!confirmar) return;

await fetch(

`${API_URL}/reservas/${id}`,

{
method:"DELETE"
}

);

obtenerReservas();

}

document
.getElementById("buscar")
.addEventListener("keyup",()=>{

const filtro =

document
.getElementById("buscar")
.value
.toLowerCase();

const filas =

document.querySelectorAll("#tabla tr");

filas.forEach(fila=>{

fila.style.display =

fila.innerText
.toLowerCase()
.includes(filtro)

?

""

:

"none";

});

});

function irDashboard(){

document
.getElementById("dashboard")
.scrollIntoView({
behavior:"smooth"
});

}

function irHabitaciones(){

document
.getElementById("seccionHabitaciones")
.scrollIntoView({
behavior:"smooth"
});

}

function irReservas(){

document
.getElementById("tablaReservas")
.scrollIntoView({
behavior:"smooth"
});

}

function irIngresos(){

document
.getElementById("seccionIngresos")
.scrollIntoView({
behavior:"smooth"
});

}

obtenerReservas();