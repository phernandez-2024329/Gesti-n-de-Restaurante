# Documentación API GastroFlow

## Endpoints Principales

### Autenticación y Usuarios
- **Registrar usuario**
  - POST /GestorRestaurante/v1/auth/register
  - Headers: Content-Type: application/json
- **Login usuario**
  - POST /GestorRestaurante/v1/auth/login
  - Headers: Content-Type: application/json
- **Cambiar contraseña**
  - POST /GestorRestaurante/v1/auth/change-password
  - Headers: Authorization: Bearer {token_usuario}

### Restaurantes
- **Crear restaurante**
  - POST /GestorRestaurante/v1/restaurant
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
- **Ver restaurantes**
  - GET /GestorRestaurante/v1/restaurant
  - Headers: Authorization: Bearer {token_usuario}

### Menús
- **Crear menú**
  - POST /GestorRestaurante/v1/menu
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
- **Ver menús**
  - GET /GestorRestaurante/v1/menu
  - Headers: Authorization: Bearer {token_usuario}

### Mesas
- **Crear mesa**
  - POST /GestorRestaurante/v1/table
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}

### Inventario
- **Crear inventario**
  - POST /GestorRestaurante/v1/inventory
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}

### Cupones
- **Crear cupón**
  - POST /GestorRestaurante/v1/coupon
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
- **Ver cupones**
  - GET /GestorRestaurante/v1/coupon
  - Headers: Authorization: Bearer {token_usuario}

### Eventos
- **Crear evento**
  - POST /GestorRestaurante/v1/events
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}

### Reservas
- **Crear reserva**
  - POST /GestorRestaurante/v1/reservation
  - Headers: Content-Type: application/json, Authorization: Bearer {token_usuario}

### Reseñas
- **Crear reseña**
  - POST /GestorRestaurante/v1/review
  - Headers: Content-Type: application/json, Authorization: Bearer {token_usuario}
- **Ver reseñas**
  - GET /GestorRestaurante/v1/review
  - Headers: Authorization: Bearer {token_usuario}

### Reportes (solo lectura)
- **Demanda de restaurantes**
  - GET /GestorRestaurante/v1/reports/demanda-restaurantes
  - Headers: Authorization: Bearer {token_usuario}
- **Top platos**
  - GET /GestorRestaurante/v1/reports/top-platos
  - Headers: Authorization: Bearer {token_usuario}
- **Ingresos**
  - GET /GestorRestaurante/v1/reports/ingresos
  - Headers: Authorization: Bearer {token_usuario}
- **Horas pico**
  - GET /GestorRestaurante/v1/reports/horas-pico
  - Headers: Authorization: Bearer {token_usuario}
- **Reservaciones**
  - GET /GestorRestaurante/v1/reports/reservaciones
  - Headers: Authorization: Bearer {token_usuario}
- **Desempeño restaurante**
  - GET /GestorRestaurante/v1/reports/desempeno-restaurante/:restaurantID
  - Headers: Authorization: Bearer {token_usuario}
- **Ocupación restaurante**
  - GET /GestorRestaurante/v1/reports/ocupacion/:restaurantID
  - Headers: Authorization: Bearer {token_usuario}
- **Clientes frecuentes**
  - GET /GestorRestaurante/v1/reports/clientes-frecuentes/:restaurantID
  - Headers: Authorization: Bearer {token_usuario}
- **Pedidos recurrentes**
  - GET /GestorRestaurante/v1/reports/pedidos-recurrentes/:restaurantID
  - Headers: Authorization: Bearer {token_usuario}

---

## Ejemplo de Header JWT
```
Authorization: Bearer {token}
```

---

## Códigos de Respuesta
- 200 OK: Petición exitosa
- 201 Created: Recurso creado exitosamente
- 400 Bad Request: Error en los datos enviados
- 401 Unauthorized: Token inválido o expirado
- 403 Forbidden: Sin permiso para la acción
- 404 Not Found: Recurso no encontrado
- 409 Conflict: Violación de restricción unique
- 422 Unprocessable Entity: Validación fallida
- 500 Internal Server Error: Error inesperado

---

## Notas
- Todos los endpoints protegidos requieren un token JWT en el header.
- Los endpoints de exportación PDF/Excel no están implementados en esta versión.
- Para ejemplos de body y respuesta, consulta la sección de ejemplos en este README.
