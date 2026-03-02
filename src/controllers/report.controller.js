// Controlador para mostrar reportes (sin exportar)

export const getDemandaRestaurantes = async (req, res) => {
  // Simulación de datos
  res.json({
    success: true,
    message: "Reporte de demanda de restaurantes",
    data: [
      { nombre: "La Bella Italia", pedidos: 120 },
      { nombre: "La Casa del Tacos", pedidos: 95 }
    ]
  });
};

export const getTopPlatos = async (req, res) => {
  res.json({
    success: true,
    message: "Reporte de top platos",
    data: [
      { nombre: "Spaghetti Carbonara", pedidos: 80 },
      { nombre: "Tacos al Pastor", pedidos: 70 }
    ]
  });
};

export const getIngresos = async (req, res) => {
  res.json({
    success: true,
    message: "Reporte de ingresos",
    data: {
      total: 15750.50,
      restaurante: "La Bella Italia"
    }
  });
};

export const getHorasPico = async (req, res) => {
  res.json({
    success: true,
    message: "Reporte de horas pico",
    data: [
      { hora: "13:00", pedidos: 30 },
      { hora: "20:00", pedidos: 45 }
    ]
  });
};

export const getReservaciones = async (req, res) => {
  res.json({
    success: true,
    message: "Reporte de reservaciones",
    data: [
      { fecha: "2026-03-01", total: 15 },
      { fecha: "2026-03-02", total: 20 }
    ]
  });
};

export const getDesempenoRestaurante = async (req, res) => {
  const { restaurantID } = req.params;
  res.json({
    success: true,
    message: "Reporte de desempeño del restaurante",
    restaurantID,
    data: {
      rating: 4.7,
      pedidos: 320
    }
  });
};

export const getOcupacion = async (req, res) => {
  const { restaurantID } = req.params;
  res.json({
    success: true,
    message: "Reporte de ocupación",
    restaurantID,
    data: {
      ocupacion: "80%"
    }
  });
};

export const getClientesFrecuentes = async (req, res) => {
  const { restaurantID } = req.params;
  res.json({
    success: true,
    message: "Reporte de clientes frecuentes",
    restaurantID,
    data: [
      { nombre: "Juan Pérez", visitas: 12 },
      { nombre: "Ana Gómez", visitas: 9 }
    ]
  });
};

export const getPedidosRecurrentes = async (req, res) => {
  const { restaurantID } = req.params;
  res.json({
    success: true,
    message: "Reporte de pedidos recurrentes",
    restaurantID,
    data: [
      { plato: "Pizza Margarita", veces: 7 },
      { plato: "Tacos al Pastor", veces: 5 }
    ]
  });
};
