// Controlador para mostrar reportes (sin exportar)

export const getDemandaRestaurantes = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Reporte de demanda de restaurantes",
      data: [
        { nombre: "La Bella Italia", pedidos: 120 },
        { nombre: "La Casa del Tacos", pedidos: 95 }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de demanda",
      error: error.message
    });
  }
};

export const getTopPlatos = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Reporte de top platos",
      data: [
        { nombre: "Spaghetti Carbonara", pedidos: 80 },
        { nombre: "Tacos al Pastor", pedidos: 70 }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de top platos",
      error: error.message
    });
  }
};

export const getIngresos = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Reporte de ingresos",
      data: {
        total: 15750.50,
        restaurante: "La Bella Italia"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de ingresos",
      error: error.message
    });
  }
};

export const getHorasPico = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Reporte de horas pico",
      data: [
        { hora: "13:00", pedidos: 30 },
        { hora: "20:00", pedidos: 45 }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de horas pico",
      error: error.message
    });
  }
};

export const getReservaciones = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Reporte de reservaciones",
      data: [
        { fecha: "2026-03-01", total: 15 },
        { fecha: "2026-03-02", total: 20 }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de reservaciones",
      error: error.message
    });
  }
};

export const getDesempenoRestaurante = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de desempeño",
      error: error.message
    });
  }
};

export const getOcupacion = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    res.json({
      success: true,
      message: "Reporte de ocupación",
      restaurantID,
      data: {
        ocupacion: "80%"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de ocupación",
      error: error.message
    });
  }
};

export const getClientesFrecuentes = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de clientes frecuentes",
      error: error.message
    });
  }
};

export const getPedidosRecurrentes = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte de pedidos recurrentes",
      error: error.message
    });
  }
};
