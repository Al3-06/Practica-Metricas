import { OrdenProduccion } from "./models.js";
import { OrdenService } from "./service.js";

describe("CP-UNI-001: Validar cambio de estado exitoso", () => {
  test('Debe cambiar estado a "en_proceso" sin errores', () => {
    const orden = new OrdenProduccion(15, "Lote Alimento A1", 200, 800, false);
    expect(orden.estado).toBe("pendiente");
    orden.iniciar();
    expect(orden.estado).toBe("en_proceso");
  });
});

describe("CP-UNI-002: Validar restricción de inicio cuando carga supera límite", () => {
  test("Debe impedir inicio y notificar exceso de capacidad", () => {
    const orden = new OrdenProduccion(22, "Carga Pesada B2", 1200, 1000, false);
    expect(() => orden.iniciar()).toThrow("Excede capacidad");
    expect(orden.estado).toBe("pendiente");
  });
});

describe("CP-UNI-003: Verificar bloqueo por mantenimiento", () => {
  test("Debe denegar inicio e informar equipo no operativo", () => {
    const orden = new OrdenProduccion(33, "Insumos Varios C3", 150, 400, true);
    expect(() => orden.iniciar()).toThrow("Máquina en mantenimiento");
    expect(orden.estado).toBe("pendiente");
  });
});

describe("CP-UNI-004: Validar flujo de cierre y restricciones", () => {
  test("Primer intento falla, segundo cambia a finalizada", () => {
    const orden = new OrdenProduccion(44, "Empaque Final D4", 50, 200, false);
    expect(() => orden.finalizar()).toThrow("No está en proceso");
    expect(orden.estado).toBe("pendiente");
    orden.iniciar();
    expect(orden.estado).toBe("en_proceso");
    orden.finalizar();
    expect(orden.estado).toBe("finalizada");
  });
});

describe("CP-UNI-005: Comprobar cálculos automáticos", () => {
  test("Eficiencia baja y porcentaje 90%", () => {
    // Calculamos: (450 / 500) * 100 = 90%
    const orden = new OrdenProduccion(55, "Componentes E5", 450, 500, false);

    expect(orden.eficiencia).toBe("Baja");
    expect(orden.porcentajeUso).toBe(90);
  });
});
describe("CP-INT-006: Validar persistencia y recuperación de lista", () => {
  test("Obtener registros iniciales con propiedades correctas", () => {
    const ordenes = OrdenService.getOrdenes();
    expect(ordenes.length).toBeGreaterThanOrEqual(3);
    ordenes.forEach((orden) => {
      expect(orden).toBeInstanceOf(OrdenProduccion);
      expect(orden).toHaveProperty("id");
      expect(orden).toHaveProperty("producto");
      expect(orden).toHaveProperty("estado");
    });
  });
});

describe("CP-INT-007: Validar ejecución de acciones vía gestor", () => {
  test("Cambiar estado a través del servicio", () => {
    const ordenes = OrdenService.getOrdenes();
    // Buscamos una orden que cumpla las condiciones para ser iniciada
    const orden = ordenes.find(
      (o) => !o.enMantenimiento && o.cantidad <= o.capacidad && o.estado === "pendiente"
    );

    expect(orden).toBeDefined();
    expect(orden.estado).toBe("pendiente");
    orden.iniciar();
    expect(orden.estado).toBe("en_proceso");

    const ordenActualizada = OrdenService.getOrdenes().find(
      (o) => o.id === orden.id
    );
    expect(ordenActualizada.estado).toBe("en_proceso");
  });
});