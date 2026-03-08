# Rutas de la API – Gestor de Restaurante

Base URL: `http://localhost:3000/GestorRestaurante/v1` (o el `PORT` configurado en tu `.env`).

## Rutas montadas en `configs/app.js`

| Prefijo        | Archivo de rutas           | Descripción                |
|----------------|----------------------------|----------------------------|
| `/auth`        | user.routes.js             | Registro, login, perfil, usuarios |
| `/restaurant`  | restaurant.routes.js       | CRUD restaurantes          |
| `/events`      | events.routes.js           | CRUD eventos               |
| `/menu`        | menu.routes.js             | CRUD menú + búsqueda       |
| `/coupon`      | coupon.routes.js           | CRUD cupones               |
| `/review`      | review.routes.js           | Reseñas                    |
| `/table`       | table.routes.js            | CRUD mesas                 |
| `/contact`     | contact.routes.js          | CRUD contactos             |
| `/order`       | orders.routes.js           | CRUD pedidos + búsqueda    |
| `/reservation` | reservation.routes.js      | CRUD reservaciones         |
| `/reports`     | report.routes.js           | Informes (requieren ADMIN/GERENTE) |
| `/inventory`   | inventory.routes.js        | CRUD inventario            |
| `/role`        | role.routes.js             | GET roles (autenticado)    |
| `/information` | information.routes.js      | CRUD información           |

## Health

- `GET /GestorRestaurante/v1/health` – Health check (sin auth).

## Endpoints por recurso

### Auth (`/auth`)
- `GET /auth/verify-email?token=...` – Verificación de email (público).
- `POST /auth/register` – Registro (body validado).
- `POST /auth/login` – Login (rate limit).
- `GET /auth/profile` – Perfil (JWT).
- `GET /auth/users` – Listar usuarios (JWT + ADMIN).
- `PUT /auth/users/:id` – Actualizar usuario (JWT + propio o ADMIN).
- `DELETE /auth/users/:id` – Desactivar usuario (JWT + ADMIN).

### Restaurants (`/restaurant`)
- `POST /restaurant` – Crear (JWT + ADMIN/GERENTE, validación, opcional imagen).
- `GET /restaurant` – Listar (JWT).
- `GET /restaurant/:id` – Por id (JWT).
- `PUT /restaurant/:id` – Actualizar (JWT + ADMIN/GERENTE, validación).
- `DELETE /restaurant/:id` – Eliminar (JWT + ADMIN).

### Tables (`/table`)
- `POST /table` – Crear (JWT + ADMIN/GERENTE, validación; body: table_name, table_number, table_ubication, table_capacity, restaurant_id).
- `GET /table` – Listar (JWT; opcional ?restaurant_id=).
- `GET /table/:id` – Por id (JWT).
- `PUT /table/:id` – Actualizar (JWT + ADMIN/GERENTE).
- `DELETE /table/:id` – Eliminar (JWT + ADMIN).

### Menu (`/menu`)
- `POST /menu` – Crear (JWT; body según Menu model).
- `GET /menu` – Listar (JWT).
- `GET /menu/search?searchTerm=...` – Búsqueda (JWT).
- `GET /menu/:id` – Por id (JWT).
- `PUT /menu/:id` – Actualizar (JWT).
- `DELETE /menu/:id` – Eliminar (JWT).

### Orders (`/order`)
- `POST /order` – Crear (JWT + validación; body: Orders_domicile, Orders_number, Orders_facture, Orders_facture_descripcion, Restaurant_id, Menu_id; User_id opcional, se toma del token).
- `GET /order` – Listar (JWT).
- `GET /order/search?searchTerm=...` – Búsqueda (JWT).
- `GET /order/:id` – Por id (JWT).
- `PUT /order/:id` – Actualizar (JWT; ej. Orders_status).
- `DELETE /order/:id` – Eliminar (JWT, soft delete).

### Reservations (`/reservation`)
- `POST /reservation` – Crear (JWT + ADMIN/GERENTE, validación, evita duplicados; body: restaurant_id, reservation_type, reservation_date, reservation_time, reservation_price, user_id; table_id si type=mesa).
- `GET /reservation` – Listar (JWT).
- `GET /reservation/:id` – Por id (JWT).
- `PUT /reservation/:id` – Actualizar (JWT + ADMIN/GERENTE).
- `DELETE /reservation/:id` – Eliminar (JWT + ADMIN).

### Events (`/events`)
- `POST /events` – Crear (JWT + ADMIN/GERENTE; body: events_name, events_type, events_date_time_start, events_date_time_finish, events_tematic, restaurant_id).
- `GET /events` – Listar (JWT).
- `GET /events/:id` – Por id (JWT).
- `PUT /events/:id` – Actualizar (JWT + ADMIN/GERENTE).
- `DELETE /events/:id` – Eliminar (JWT + ADMIN).

### Reports (`/reports`) – todos requieren JWT + ADMIN o GERENTE
- `GET /reports/demanda-restaurantes`
- `GET /reports/top-platos`
- `GET /reports/ingresos`
- `GET /reports/horas-pico`
- `GET /reports/reservaciones`
- `GET /reports/desempeno-restaurante/:restaurantID`
- `GET /reports/ocupacion/:restaurantID`
- `GET /reports/clientes-frecuentes/:restaurantID`
- `GET /reports/pedidos-recurrentes/:restaurantID`

### Role (`/role`)
- `GET /role` – Listar roles (JWT).

### Contact (`/contact`)
- `POST /contact` – Crear (JWT + ADMIN/GERENTE).
- `GET /contact` – Listar (JWT).
- `GET /contact/:id` – Por id (JWT).
- `PUT /contact/:id` – Actualizar (JWT + ADMIN/GERENTE).
- `DELETE /contact/:id` – Eliminar (JWT + ADMIN).

### Coupon, Review, Inventory, Information
- Rutas bajo `/coupon`, `/review`, `/inventory`, `/information` según sus archivos de rutas.

## Nota Postman

La variable `base_url` en la colección está por defecto en `http://localhost:3006/GestorRestaurante/v1`. Si tu API corre en otro puerto (por ejemplo 3000), cambia la variable o el valor en la colección.
