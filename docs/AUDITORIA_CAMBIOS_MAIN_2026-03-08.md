# Auditoría de cambios – Rama main (8 de marzo de 2026) 
**Autor de los commits del día:** jsajche-2024380  
**Resumen:** 5 commits, 36 archivos tocados

---

## 1. Resumen de commits del día

| 1 | `8012580` | | Arreglo de errores cruciales y logicos |
| 2 | `9fa185a` | | Se arreglaron los endpoint |
| 3 | `1f612b0` | | Correccion de rutas |
| 4 | `e502b70` | | Se elimino archivos basura |
| 5 | `f617a4e` | | Se agrego la docuemntacion al proyecto |

---

## 2. Archivos por tipo de cambio

### 2.1 Archivos añadidos (A)

- `.DS_Store` (macOS, sin impacto funcional)
- `middlewares/route-validators.js` – **Nuevo middleware de validación**
- `docs/Endpoints-GestorRestaurante-.docx`
- `docs/Exposicion-GestorRestaurante-.docx`
- `docs/Postman_Collection.json` – Colección Postman movida aquí (antes en raíz)

### 2.2 Archivos eliminados (D)

- `Postman_Collection.json` – **Movido** a `docs/Postman_Collection.json`
- `ENDPOINTS.md` – Eliminado (archivo “basura”)
- `MENSAJES_DE_ERROR.md` – Eliminado
- `REVISION_PDF.md` – Eliminado
- `VERIFICACION_ENDPOINTS_VALIDACIONES_ERRORES.md` – Eliminado
- `VERIFICACION_PDF_COMPLETA.md` – Eliminado

### 2.3 Archivos renombrados / reubicados (R)

- `Postman_Collection.json` → `docs/Postman_Collection.json`

### 2.4 Archivos modificados (M)

**Configuración**

- `configs/app.js` – Registro de nuevas rutas (role, information)

**Middlewares**

- `middlewares/handle-errors.js` – Ajustes en manejo de errores 

**Controladores**

- `src/controllers/contact.controller.js`
- `src/controllers/coupon.controller.js`
- `src/controllers/events.controller.js`
- `src/controllers/information.controller.js`
- `src/controllers/inventory.controller.js`
- `src/controllers/menu.controller.js`
- `src/controllers/orders.controller.js`
- `src/controllers/report.controller.js` – Cambios grandes 
- `src/controllers/reservation.controller.js` – Cambios grandes 
- `src/controllers/restaurant.controller.js`
- `src/controllers/review.controller.js`
- `src/controllers/role.controller.js`
- `src/controllers/table.controller.js`

**Modelos**

- `src/models/events.model.js`
- `src/models/information.model.js`
- `src/models/menu.model.js`
- `src/models/orders.model.js`
- `src/models/reservation.model.js`
- `src/models/review.model.js`
- `src/models/table.model.js`

**Rutas**

- `src/routes/information.routes.js`
- `src/routes/orders.routes.js`
- `src/routes/report.routes.js` – Reorganización de rutas de reportes
- `src/routes/reservation.routes.js`
- `src/routes/restaurant.routes.js`
- `src/routes/table.routes.js`

**Servicios**

- `src/services/orders.service.js`

---

## 3. Cambios en endpoints y rutas

### 3.1 Nuevas rutas registradas en `configs/app.js`

- **Role:** `GET /GestorRestaurante/v1/role` (ya existía el archivo de rutas, se agregó al app)
- **Information:** `GET/POST/PUT/DELETE /GestorRestaurante/v1/information`

Base path: `/GestorRestaurante/v1`.

### 3.2 Rutas que usan validadores nuevos (lógica de validación)

- **Restaurant (POST):** `validateCreateRestaurant` (nombre, tipo, dirección, horarios, precio, IDs opcionales).
- **Restaurant (PUT):** `validateUpdateRestaurant` (id en params, campos opcionales).
- **Reservation (POST):** `validateCreateReservation` (restaurant_id, reservation_type, fecha/hora, precio, user_id, table_id opcional).
- **Table (POST):** `validateCreateTable` (nombre, número, ubicación, capacidad, restaurant_id, estado opcional).
- **Order (creación):** `validateCreateOrder` (domicilio, número orden, factura, descripción, Restaurant_id, Menu_id, User_id opcional).

### 3.3 Reportes (rutas sin cambio de path, sí de implementación)

- `GET /reports/demanda-restaurantes`
- `GET /reports/top-platos`
- `GET /reports/ingresos`
- `GET /reports/horas-pico`
- `GET /reports/reservaciones`
- `GET /reports/desempeno-restaurante/:restaurantID`
- `GET /reports/ocupacion/:restaurantID`
- `GET /reports/clientes-frecuentes/:restaurantID`
- `GET /reports/pedidos-recurrentes/:restaurantID`

Todas protegidas con `reportAuth` (JWT + rol ADMIN o GERENTE).

---

## 4. Cambios de lógica y comportamiento

### 4.1 Nuevo middleware `route-validators.js`

- Validaciones con **express-validator** para:
  - Crear/actualizar restaurante.
  - Crear reservación (tipos: `mesa`, `domicilio`, `para_llevar`; fechas ISO8601).
  - Crear mesa (capacidad y número enteros positivos, estado opcional).
  - Crear orden (campos obligatorios y MongoIds).
- Uso de `checkValidators` para centralizar respuestas de error de validación.

### 4.2 Reservaciones

- Modelo: más campos y validaciones ( líneas nuevas en `reservation.model.js`).
- Controlador: lógica ampliada ( líneas nuevas en el commit inicial del día), seguramente alineada con los validadores y tipos de reserva.
- Rutas: uso de `validateCreateReservation` en POST.

### 4.3 Órdenes

- Modelo `orders.model.js`: cambios en estructura/validaciones .
- Servicio `orders.service.js`: ajustes de lógica ( líneas en total entre commits).
- Controlador y rutas: integración con `validateCreateOrder` y posibles correcciones de flujo.

### 4.4 Mesas

- Modelo: al menos un campo nuevo (`table.model.js` ).
- Controlador y rutas: uso de `validateCreateTable` y correcciones de errores.

### 4.5 Reportes

- `report.controller.js`: cambios grandes ; misma lista de endpoints, posiblemente corrección de consultas, agregaciones o respuestas.
- `report.routes.js`: reorganización de rutas , mismo conjunto de endpoints listado arriba.

### 4.6 Otros controladores

- **Contact, coupon, events, inventory, restaurant, review, role:** cambios menores (manejo de errores, rutas o respuestas).
- **Information:** controlador y rutas ajustados; modelo con cambio mínimo .
- **Menu:** controlador con cambios de lógica .
- **Events:** modelo con 8 líneas de cambios.

### 4.7 Manejo de errores

- `middlewares/handle-errors.js`: 8 líneas añadidas para unificar o ampliar el manejo de errores en la app.

---

## 5. Documentación y assets

- **Añadido:** carpeta `docs/` con:
  - Documentación técnica (Word).
  - Documentación de endpoints (Word).
  - Documento de exposición (Word).
  - `Postman_Collection.json` (movido desde la raíz).
- **Eliminados:** archivos markdown de revisión/verificación y listados de endpoints/errores en la raíz (considerados “archivos basura”).

---

## 6. Resumen ejecutivo

- **Errores y lógica:** Se corrigieron errores críticos y de lógica en reservaciones, órdenes, mesas, menú y reportes; se añadió un middleware de validación (`route-validators.js`) y se mejoró el manejo de errores global.
- **Endpoints:** Se registraron en `app.js` las rutas `/role` e `/information`; se revisaron y ajustaron rutas de reportes, reservaciones, restaurantes y mesas; la colección de Postman se movió a `docs/`.
- **Archivos:** 36 archivos tocados; 1 archivo nuevo relevante (middleware), 5 documentos nuevos en `docs/`, 5 markdown eliminados de la raíz y 1 archivo movido (Postman).
- **Nombres de archivos:** No hubo renombres de archivos de código; solo reubicación de `Postman_Collection.json` a `docs/`.

Si necesitas el diff línea por línea de algún archivo o commit concreto, se puede extraer con `git show <hash> -- <archivo>`.
