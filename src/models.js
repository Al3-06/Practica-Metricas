export class OrdenProduccion {
  constructor(id, producto, cantidad, capacidad, enMantenimiento = false) {
    this.id = id;
    this.producto = producto;
    this.cantidad = cantidad;
    this.capacidad = capacidad;
    this.enMantenimiento = enMantenimiento;
    this.estado = "pendiente"; // 'pendiente', 'en_proceso', 'finalizada'
  }

  iniciar() {
    if (this.enMantenimiento) throw new Error("Máquina en mantenimiento");
    if (this.cantidad > this.capacidad) throw new Error("Excede capacidad");
    this.estado = "en_proceso";
  }

  finalizar() {
    if (this.estado !== "en_proceso") throw new Error("No está en proceso");
    this.estado = "finalizada";
  }

  get eficiencia() {
    return this.cantidad > 400 ? "Baja" : "Alta";
  }

  get porcentajeUso() {
    return (this.cantidad / this.capacidad) * 100;
  }
}
