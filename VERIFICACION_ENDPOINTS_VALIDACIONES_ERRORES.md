# Verificación: Endpoints, validaciones y errores

## 1. Endpoints montados (configs/app.js)

| Prefijo | Montaje | Rutas |
|---------|---------|--------|
| `/GestorRestaurante/v1/health` | GET directo | Health check (sin auth) |
| `/auth` | userRoutes | verify-email, register, login, profile, users, users/:id |
| `/restaurant` | restaurantRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |
| `/events` | eventsRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |
| `/menu` | menuRoutes | POST, GET, GET /search, GET /:id, PUT /:id, DELETE /:id |
| `/coupon` | couponRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |
| `/review` | reviewRoutes | POST, GET, PUT /:id, DELETE /:id |
| `/table` | tableRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |
| `/contact` | contactRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |
| `/order` | orderRoutes | POST, GET, GET /search, GET /:id, PUT /:id, DELETE /:id |
| `/reservation` | reservationRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |
| `/reports` | reportRoutes | GET demanda-restaurantes, top-platos, ingresos, horas-pico, reservaciones, desempeno-restaurante/:id, ocupacion/:id, clientes-frecuentes/:id, pedidos-recurrentes/:id |
| `/inventory` | inventoryRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |
| `/role` | roleRoutes | GET / |
| `/information` | informationRoutes | POST, GET, GET /:id, PUT /:id, DELETE /:id |

**Orden de rutas:** En `menu.routes.js` y `orders.routes.js`, `GET /search` está definido **antes** de `GET /:id`, por lo que no se interpreta "search" como id. Correcto.

**404:** Cualquier ruta no coincidente responde con `{ success: false, message: 'Endpoint no encontrado' }` (status 404). El manejador de 404 está dentro de `routes()` antes de cerrar; `errorHandler` se aplica después de las rutas para errores pasados con `next(err)`.

---

## 2. Validaciones por endpoint

### Rutas con validadores de body/params (express-validator + checkValidators)

| Ruta | Validador | Archivo |
|------|-----------|---------|
| POST /auth/register | validateRegister | auth-validators.js |
| POST /auth/login | validateLogin | auth-validators.js |
| PUT /auth/users/:id | validateUpdateUser | auth-validators.js |
| POST /restaurant | validateCreateRestaurant | route-validators.js |
| PUT /restaurant/:id | validateUpdateRestaurant (param id + body opcionales) | route-validators.js |
| POST /reservation | validateCreateReservation | route-validators.js |
| POST /table | validateCreateTable | route-validators.js |
| POST /order | validateCreateOrder | route-validators.js |
| POST /information | validateInformation | auth-validators.js |

### Rutas sin validador de body (dependen del modelo o lógica en controlador)

- **POST /contact**: Modelo Contact con campos required; errores Mongoose capturados por handle-errors (ValidationError).
- **POST /events**: Modelo Events con required; ValidationError global.
- **POST /menu**: Modelo Menu con required; ValidationError global.
- **POST /coupon**: Modelo Coupon; ValidationError global.
- **POST /review**: Modelo Review; ValidationError global.
- **POST /inventory**: Modelo Inventory; ValidationError global.
- **PUT** en todos los recursos: se actualiza con `req.body`; opcional añadir validadores por recurso si se quiere restringir campos.

### Auth y roles

- **JWT**: validateJWT (validate-JWT.js) en rutas protegidas.
- **Roles**: validateRole(Roles.ADMIN, Roles.GERENTE) etc. en rutas que lo requieren.
- **events.routes** usa `validateRole('ADMIN', 'GERENTE')` (string); es coherente con `Roles.ADMIN === 'ADMIN'`.

---

## 3. Manejo de errores

### Middleware global (handle-errors.js)

| Tipo de error | Código HTTP | Respuesta |
|---------------|-------------|-----------|
| ValidationError (Mongoose) | 400 | success: false, message: 'Error de validación', errors: [{ field, message }] |
| Código 11000 (duplicado) | 400 | success: false, message: campo ya en uso, error: 'DUPLICATE_FIELD' |
| CastError | 400 | success: false, message: 'ID inválido', error: 'INVALID_ID' |
| JsonWebTokenError | 401 | success: false, message: 'Token inválido', error: 'INVALID_TOKEN' |
| TokenExpiredError | 401 | success: false, message: 'Token expirado', error: 'TOKEN_EXPIRED' |
| LIMIT_FILE_SIZE / MulterError | 400 | success: false, message (o genérico), error: 'FILE_ERROR' |
| Resto | 500 | success: false, message: 'Error interno del servidor', error: 'INTERNAL_SERVER_ERROR' |

### Validadores (checkValidators.js)

Si `validationResult(req)` tiene errores: **400** con `success: false`, `message: 'Errores de validación'`, `errors: [{ field, message }]`.

### Controladores

- Respuestas de error usan **success: false** y **message** (y en muchos casos **error**: código).
- En rutas que usan `:id`, los **catch** suelen comprobar **CastError** y devuelven **400** con mensaje tipo "ID de [recurso] no válido" y `error: 'INVALID_ID'`.
- **404** cuando el recurso no existe o está desactivado (estado: false).
- **500** en catch genérico con message y a veces error.message.

### Rate limit (request-limit.js)

- **429** con `success: false`, `message: 'Demasiadas peticiones...'`, `error: 'RATE_LIMIT_EXCEEDED'`.
- authLimit para login: mensaje de demasiados intentos.

### validate-JWT y validate-role

- **401** si no hay token o token inválido/expirado.
- **500** si falta JWT_SECRET o no se validó JWT antes del rol.
- **403** si el rol no está permitido, con `error: 'FORBIDDEN'`.

---

## 4. Cambio realizado en esta verificación

- **information.routes.js**: Se sustituyó el import de `validateRegister` por **validateInformation** y se añadió **validateInformation** al **POST /** (crear información), de modo que el body se valida antes de llegar al controlador (information, title, restaurantId obligatorios; restaurantId como MongoId).

---

## 5. Resumen

| Aspecto | Estado |
|---------|--------|
| Endpoints montados y orden (incl. /search antes de /:id) | Correcto |
| Health y 404 | Correcto |
| errorHandler después de rutas | Correcto |
| Validadores en register, login, updateUser, createRestaurant, updateRestaurant, createReservation, createTable, createOrder, createInformation | Correcto |
| Formato de errores (success: false, message, error cuando aplica) | Unificado en controladores y middlewares |
| CastError en controladores con :id | Implementado |
| Validación de información (create) | Corregida (validateInformation en POST /information) |

Para el detalle de mensajes de error por recurso, ver **MENSAJES_DE_ERROR.md**.
