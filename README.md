# Documentación API Gestion de Restaurantes

## Endpoints Principales

### Autenticación para Admin
- **Registrar usuario**
  - POST /GestorRestaurante/v1/auth/register
  - Headers: Content-Type: application/json
 - {
 "nombre": "Pablin",
 "username": "pabs_js",
 "email": "pablo@gmail.com",
 "password": "Tupapipablo123",
 "telefono": "12345678",
 "rol": "CLIENTE"
}
- **Login usuario**
  - POST /GestorRestaurante/v1/auth/login
  - Headers: Content-Type: application/json
{
    "email": "admin@restaurante.com",
    "password": "Admin1234"
}

### Restaurantes
- **Crear restaurante**
  - POST /GestorRestaurante/v1/restaurant
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
  {
  "restaurant_name": "La Bella Italia",
  "restaurant_type": "Italiana",
  "restaurant_type_gastronomic": "Mediterránea",
  "restaurant_direction": "Calle Principal 123",
  "restaurant_time_start": "10:00",
  "restaurant_time_close": "23:00",
  "restaurant_mean_price": 25.50,
  "restaurant_images": ["https://cloudinary.com/image.jpg"]
}

- **Ver restaurantes**
  - GET /GestorRestaurante/v1/restaurant
  - Headers: Authorization: Bearer {token_usuario}

### Menús
- **Crear menú**
  - POST /GestorRestaurante/v1/menu
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
  {
  "Menu_id": 3,
  "Menu_Plate": "Spaghetti Carbonara",
  "Menu_Price": 18.50,
  "Menu_Drink": "Vinos",
  "Menu_type_plate": "Plato_fuerte",
  "Menu_type_drink": "Vinos",
  "Menu_description_plate": "Delicioso spaghetti con salsa de huevo, queso y tocino",
  "Restaurant_id": "id restaurante"
}

- **Ver menús**
  - GET /GestorRestaurante/v1/menu
  - Headers: Authorization: Bearer {token_usuario}

### Mesas
- **Crear mesa**
  - POST /GestorRestaurante/v1/table
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
  {
  "table_name": "Mesa VIP",
  "table_number": 4,
  "table_ubication": "Área privada",
  "table_capacity": 8,
  "table_time_available": "10:00",
  "table_state": "Disponible",
  "restaurant_id": "69a57df85c49f41fb6b411c5"
}


### Inventario
- **Crear inventario**
  - POST /GestorRestaurante/v1/inventory
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
  {
  "item_name": "Queso Parmesano",
  "category": "Lácteos",
  "quantity": 10,
  "unit": "kg",
  "price": 5.00,
  "provider": "Proveedor S.A."
}


### Cupones
- **Crear cupón**
  - POST /GestorRestaurante/v1/coupon
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
  crear cupon
{
  "code": "DESCUENTO20",
  "discount_type": "percentage",
  "discount_value": 20,
  "max_uses": 100,
  "max_uses_per_user": 5,
  "expiration_date": "2026-12-31",
  "min_order_amount": 50,
  "restaurant_ids": ["id restaurante"]
} 

- **Ver cupones**
  - GET /GestorRestaurante/v1/coupon
  - Headers: Authorization: Bearer {token_usuario}

### Eventos
- **Crear evento**
  - POST /GestorRestaurante/v1/events
  - Headers: Content-Type: application/json, Authorization: Bearer {token_admin}
  {
  "events_name": "Cena Especial",
  "events_type": "Gastronómico",
  "events_date_time_start": "2026-03-15T19:00:00",
  "events_date_time_finish": "2026-03-15T22:00:00",
  "events_tematic": "Degustación de vinos",
  "restaurant_id": "id restaurante"
}

### Para Usuario normal

### Registrarse
POST : http://localhost:3006/GestorRestaurante/v1/auth/register
{
 "nombre": "Pablin",
 "username": "pabs_js",
 "email": "pablo@gmail.com",
 "password": "Tupapipablo123",
 "telefono": "12345678",
 "rol": "CLIENTE"
}
### Reservas
- **Crear reserva**
  - POST /GestorRestaurante/v1/reservation
  - Headers: Content-Type: application/json, Authorization: Bearer {token_usuario}
  {
  "user_id": "69a584d95c49f41fb6b411e4",
  "restaurant_id": "69a57df85c49f41fb6b411c5",
  "table_id": "69a3f24e6ba43c8a9121d921",
  "date": "2026-03-10",
  "time": "20:00",
  "guests": 4,
  "reservation_price": 50.00,
  "reservation_state": "pendiente"
}


### Reseñas
- **Crear reseña**
  - POST /GestorRestaurante/v1/review
  - Headers: Content-Type: application/json, Authorization: Bearer {token_usuario}
  {
  "user_id": "69a584d95c49f41fb6b411e4",
  "restaurant_id": "69a58959ebeb6e541d55a0fe",
  "rating": 5,
  "comment": "Excelente comida y atención"
}

  
- **Ver reseñas**
  - GET /GestorRestaurante/v1/review
  - Headers: Authorization: Bearer {token_usuario}

### Reportes (solo para administrador)
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
- Para ejemplos de body y respuesta, consulta la sección de ejemplos en este README.

