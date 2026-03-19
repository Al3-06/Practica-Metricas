import { OrdenProduccion } from "./models.js";

export const OrdenService = {
  ordenes: [
    new OrdenProduccion(1, "Tornillo Industrial", 200, 500, false),
    new OrdenProduccion(2, "Tuerca Industrial", 450, 500, false),
    new OrdenProduccion(3, "Arandela Industrial", 500, 1000, false),
    new OrdenProduccion(4, "Perno Liso", 150, 500, true),
    new OrdenProduccion(5, "Buje Vulcanizado", 250, 700, false),
    new OrdenProduccion(6, "Perno Roscado", 150, 500, true),
  ],

  getOrdenes() {
    return this.ordenes;
  },
};
