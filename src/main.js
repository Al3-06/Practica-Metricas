import { OrdenService } from "./service.js";

const contenedor = document.getElementById("contenedor-ordenes");

function renderizar() {
  contenedor.innerHTML = "";
  OrdenService.getOrdenes().forEach((orden) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
            <div class="card shadow border-${orden.enMantenimiento ? "danger" : "primary"}">
                <div class="card-header">${orden.producto}</div>
                <div class="card-body">
                    <p>Estado: <span class="badge bg-info">${orden.estado}</span></p>
                    <p>Eficiencia: <strong>${orden.eficiencia}</strong></p>
                    <div class="progress mb-3">
                        <div class="progress-bar ${orden.porcentajeUso > 80 ? "bg-danger" : "bg-success"}" 
                             style="width: ${orden.porcentajeUso}%">${Math.round(orden.porcentajeUso)}%</div>
                    </div>
                    <button class="btn btn-sm btn-success btn-iniciar" data-id="${orden.id}">Iniciar</button>
                    <button class="btn btn-sm btn-danger btn-finalizar" data-id="${orden.id}">Finalizar</button>
                    <div id="msj-${orden.id}" class="mt-2 small text-danger"></div>
                </div>
            </div>`;
    contenedor.appendChild(card);
  });
}

contenedor.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id);
  const orden = OrdenService.getOrdenes().find((o) => o.id === id);
  const msjDiv = document.getElementById(`msj-${id}`);

  try {
    if (e.target.classList.contains("btn-iniciar")) orden.iniciar();
    if (e.target.classList.contains("btn-finalizar")) orden.finalizar();
    renderizar();
  } catch (err) {
    msjDiv.innerText = err.message;
  }
});

renderizar();
