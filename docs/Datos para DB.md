# Datos para exposición – Gestor de Restaurante

**Base URL:** `http://localhost:3000/GestorRestaurante/v1`  
*(Si usas otro puerto, cambia `3000`)*

**Headers para rutas protegidas:** después de hacer login, agrega:
- `Authorization: Bearer <token>`  
  **o**
- `x-token: <token>`

**Orden recomendado:** ejecutar en este orden porque unos dependen de los otros (IDs).

---

## 1. Registrar usuarios (público – sin token)

**Endpoint:** `POST /auth/register`

Crea primero los usuarios. Anota el **\_id** de cada uno para usarlo en reservaciones y pedidos.  
El **rol_id** define el tipo: `ADMIN`, `GERENTE` o `CLIENTE`.

- Teléfono: exactamente **8 dígitos**.
- Contraseña: mínimo 8 caracteres, al menos una **mayúscula** y un **número**.
- Username: solo letras, números y `_` (mínimo 3 caracteres).

### 5 Administradores

```json
{"nombre":"Ana Admin","username":"anaadmin","email":"ana@restaurante.com","password":"Admin123","telefono":"12345678","rol_id":"ADMIN"}
```

```json
{"nombre":"Carlos Admin","username":"carlosadmin","email":"carlos@restaurante.com","password":"Admin123","telefono":"22345678","rol_id":"ADMIN"}
```

```json
{"nombre":"María Admin","username":"mariaadmin","email":"maria@restaurante.com","password":"Admin123","telefono":"32345678","rol_id":"ADMIN"}
```

```json
{"nombre":"Luis Admin","username":"luisadmin","email":"luis@restaurante.com","password":"Admin123","telefono":"42345678","rol_id":"ADMIN"}
```

```json
{"nombre":"Sofia Admin","username":"sofiaadmin","email":"sofia@restaurante.com","password":"Admin123","telefono":"52345678","rol_id":"ADMIN"}
```

### 5 Gerentes

```json
{"nombre":"Pedro Gerente","username":"pedrogerente","email":"pedro@restaurante.com","password":"Gerente123","telefono":"62345678","rol_id":"GERENTE"}
```

```json
{"nombre":"Laura Gerente","username":"lauagerente","email":"laura@restaurante.com","password":"Gerente123","telefono":"72345678","rol_id":"GERENTE"}
```

```json
{"nombre":"Roberto Gerente","username":"robertogerente","email":"roberto@restaurante.com","password":"Gerente123","telefono":"82345678","rol_id":"GERENTE"}
```

```json
{"nombre":"Elena Gerente","username":"elenagerente","email":"elena@restaurante.com","password":"Gerente123","telefono":"92345678","rol_id":"GERENTE"}
```

```json
{"nombre":"Diego Gerente","username":"diegogerente","email":"diego@restaurante.com","password":"Gerente123","telefono":"01345678","rol_id":"GERENTE"}
```

### 5 Clientes

```json
{"nombre":"Juan Cliente","username":"juancliente","email":"juan@mail.com","password":"Cliente123","telefono":"11345678","rol_id":"CLIENTE"}
```

```json
{"nombre":"Carmen Cliente","username":"carmencliente","email":"carmen@mail.com","password":"Cliente123","telefono":"12345679","rol_id":"CLIENTE"}
```

```json
{"nombre":"Miguel Cliente","username":"miguelcliente","email":"miguel@mail.com","password":"Cliente123","telefono":"13345678","rol_id":"CLIENTE"}
```

```json
{"nombre":"Rosa Cliente","username":"rosacliente","email":"rosa@mail.com","password":"Cliente123","telefono":"14345678","rol_id":"CLIENTE"}
```

```json
{"nombre":"Pablo Cliente","username":"pablocliente","email":"pablo@mail.com","password":"Cliente123","telefono":"15345678","rol_id":"CLIENTE"}
```

---

## 2. Login (obtener token)

**Endpoint:** `POST /auth/login`

Usa un ADMIN o GERENTE para crear contactos, restaurantes, mesas y reservaciones.

```json
{"email":"ana@restaurante.com","password":"Admin123"}
```

La respuesta trae `token`. Copia ese valor y úsalo en **Authorization: Bearer &lt;token&gt;** (o en **x-token**) en el resto de peticiones.

---

## 3. Crear contactos (token ADMIN o GERENTE)

**Endpoint:** `POST /contact`  
**Headers:** `Authorization: Bearer <token>` + `Content-Type: application/json`

Cada restaurante necesita un contacto. Anota el **\_id** del contacto para el siguiente paso.

```json
{"contact_type":"Restaurante","contact_name":"Contacto La Terraza","contact_position":"Gerente","contact_phone_number":"23456789","contact_email":"contacto@laterraza.com"}
```

```json
{"contact_type":"Restaurante","contact_name":"Contacto El Jardín","contact_position":"Gerente","contact_phone_number":"34567890","contact_email":"contacto@eljardin.com"}
```

```json
{"contact_type":"Restaurante","contact_name":"Contacto Sabor Local","contact_position":"Encargado","contact_phone_number":"45678901","contact_email":"info@saborlocal.com"}
```

Después de crear, anota por ejemplo:
- Contacto 1 → `<CONTACT_ID_1>`
- Contacto 2 → `<CONTACT_ID_2>`

---

## 4. Crear restaurantes (token ADMIN o GERENTE)

**Endpoint:** `POST /restaurant`  
**Headers:** `Authorization: Bearer <token>` + `Content-Type: application/json`

Puedes omitir `contact_id` y `table_id`; el backend puede generar IDs y crea 3 mesas por defecto. Si ya tienes contactos, pásalos.

Reemplaza `<CONTACT_ID_1>` por el _id real del contacto.

```json
{"restaurant_name":"La Terraza","restaurant_type":"Restaurante","restaurant_type_gastronomic":"Internacional","restaurant_direction":"Zona 10, Ciudad","restaurant_time_start":"11:00","restaurant_time_close":"22:00","restaurant_mean_price":85,"contact_id":"<CONTACT_ID_1>"}
```

```json
{"restaurant_name":"El Jardín","restaurant_type":"Cafetería","restaurant_type_gastronomic":"Fusión","restaurant_direction":"Zona 4, Ciudad","restaurant_time_start":"08:00","restaurant_time_close":"20:00","restaurant_mean_price":45,"contact_id":"<CONTACT_ID_2>"}
```

Anota los **\_id** de cada restaurante como `<RESTAURANT_ID_1>` y `<RESTAURANT_ID_2>` (para menú, mesas y reservaciones).

---

## 5. Crear mesas adicionales (opcional)

**Endpoint:** `POST /table`  
**Headers:** `Authorization: Bearer <token>` + `Content-Type: application/json`

El crear restaurante ya agrega 3 mesas. Si quieres más, usa este body. Reemplaza `<RESTAURANT_ID_1>` por el _id del restaurante.

```json
{"table_name":"Mesa 4","table_number":4,"table_ubication":"Terraza","table_capacity":4,"restaurant_id":"<RESTAURANT_ID_1>","table_state":"Disponible"}
```

```json
{"table_name":"Mesa 5","table_number":5,"table_ubication":"Interior","table_capacity":6,"restaurant_id":"<RESTAURANT_ID_1>","table_state":"Disponible"}
```

Anota el **\_id** de una mesa como `<TABLE_ID>` para reservaciones tipo **mesa**.

---

## 6. Crear platos de menú (token JWT)

**Endpoint:** `POST /menu`  
**Headers:** `Authorization: Bearer <token>` + `Content-Type: application/json`

Reemplaza `<RESTAURANT_ID_1>` por el _id del restaurante. Anota **\_id** de al menos un plato para pedidos.

```json
{"Menu_id":1,"Menu_Plate":"Pasta Alfredo","Menu_Price":65,"Menu_Drink":"Limonada","Menu_type_plate":"Plato_fuerte","Menu_type_drink":"Bebidas_sin_alcohol","Menu_description_plate":"Pasta en salsa cremosa","Menu_ingredients":["pasta","crema","queso"],"Restaurant_id":"<RESTAURANT_ID_1>"}
```

```json
{"Menu_id":2,"Menu_Plate":"Ensalada César","Menu_Price":45,"Menu_Drink":"Agua","Menu_type_plate":"Entrada","Menu_type_drink":"Bebidas_sin_alcohol","Menu_description_plate":"Lechuga con aderezo césar","Menu_ingredients":["lechuga","crutones","queso"],"Restaurant_id":"<RESTAURANT_ID_1>"}
```

```json
{"Menu_id":3,"Menu_Plate":"Pizza Margarita","Menu_Price":75,"Menu_Drink":"Cerveza","Menu_type_plate":"Plato_fuerte","Menu_type_drink":"Cerveza","Menu_description_plate":"Pizza clásica","Menu_ingredients":["masa","tomate","mozzarella"],"Restaurant_id":"<RESTAURANT_ID_1>"}
```

```json
{"Menu_id":4,"Menu_Plate":"Brownie","Menu_Price":35,"Menu_Drink":"Café","Menu_type_plate":"Postre","Menu_type_drink":"Bebidas_calientes","Menu_description_plate":"Brownie de chocolate","Menu_ingredients":["chocolate","harina"],"Restaurant_id":"<RESTAURANT_ID_1>"}
```

```json
{"Menu_id":5,"Menu_Plate":"Hamburguesa","Menu_Price":55,"Menu_Drink":"Refresco","Menu_type_plate":"Plato_fuerte","Menu_type_drink":"Bebidas_sin_alcohol","Menu_description_plate":"Hamburguesa clásica","Menu_ingredients":["carne","pan","lechuga"],"Restaurant_id":"<RESTAURANT_ID_1>"}
```

Anota un **\_id** de menú como `<MENU_ID>`.

---

## 7. Crear reservaciones (token ADMIN o GERENTE)

**Endpoint:** `POST /reservation`  
**Headers:** `Authorization: Bearer <token>` + `Content-Type: application/json`

- **restaurant_id:** _id del restaurante.
- **user_id:** _id de un **cliente** (uno de los 5 que registraste).
- **reservation_type:** `mesa` | `domicilio` | `para_llevar`.
- Si es **mesa**, incluye **table_id** (ej. una mesa creada en el paso 5 o de las que creó el restaurante).
- **reservation_date:** formato ISO, ej. `2026-03-15`.
- **reservation_time:** texto, ej. `19:00`.

Reemplaza `<RESTAURANT_ID_1>`, `<USER_ID_CLIENTE>`, `<TABLE_ID>` por IDs reales.

### Reservación tipo mesa

```json
{"restaurant_id":"<RESTAURANT_ID_1>","reservation_type":"mesa","reservation_date":"2026-03-15","reservation_time":"19:00","reservation_price":50,"user_id":"<USER_ID_CLIENTE>","table_id":"<TABLE_ID>"}
```

### Reservación domicilio

```json
{"restaurant_id":"<RESTAURANT_ID_1>","reservation_type":"domicilio","reservation_date":"2026-03-16","reservation_time":"20:00","reservation_price":60,"user_id":"<USER_ID_CLIENTE>"}
```

### Reservación para llevar

```json
{"restaurant_id":"<RESTAURANT_ID_1>","reservation_type":"para_llevar","reservation_date":"2026-03-17","reservation_time":"13:00","reservation_price":40,"user_id":"<USER_ID_CLIENTE>"}
```

### Más reservaciones (cambiar fecha/hora y user_id)

```json
{"restaurant_id":"<RESTAURANT_ID_1>","reservation_type":"mesa","reservation_date":"2026-03-18","reservation_time":"14:00","reservation_price":50,"user_id":"<USER_ID_CLIENTE>","table_id":"<TABLE_ID>"}
```

```json
{"restaurant_id":"<RESTAURANT_ID_1>","reservation_type":"domicilio","reservation_date":"2026-03-19","reservation_time":"21:00","reservation_price":55,"user_id":"<USER_ID_CLIENTE>"}
```

---

## 8. Crear pedidos / órdenes (token JWT)

**Endpoint:** `POST /order`  
**Headers:** `Authorization: Bearer <token>` + `Content-Type: application/json`

Reemplaza `<RESTAURANT_ID_1>`, `<MENU_ID>`, `<USER_ID_CLIENTE>` por IDs reales.

```json
{"Orders_domicile":"Zona 10, 5ta avenida","Orders_number":"ORD-001","Orders_facture":"FAC-001","Orders_facture_descripcion":"Pasta Alfredo + Limonada","Restaurant_id":"<RESTAURANT_ID_1>","Menu_id":"<MENU_ID>","User_id":"<USER_ID_CLIENTE>"}
```

```json
{"Orders_domicile":"Zona 4, 3ra calle","Orders_number":"ORD-002","Orders_facture":"FAC-002","Orders_facture_descripcion":"Pizza Margarita + Cerveza","Restaurant_id":"<RESTAURANT_ID_1>","Menu_id":"<MENU_ID>","User_id":"<USER_ID_CLIENTE>"}
```

```json
{"Orders_domicile":"Zona 1, Centro","Orders_number":"ORD-003","Orders_facture":"FAC-003","Orders_facture_descripcion":"Hamburguesa + Refresco","Restaurant_id":"<RESTAURANT_ID_1>","Menu_id":"<MENU_ID>","User_id":"<USER_ID_CLIENTE>"}
```

```json
{"Orders_domicile":"Zona 5","Orders_number":"ORD-004","Orders_facture":"FAC-004","Orders_facture_descripcion":"Ensalada + Agua","Restaurant_id":"<RESTAURANT_ID_1>","Menu_id":"<MENU_ID>","User_id":"<USER_ID_CLIENTE>"}
```

```json
{"Orders_domicile":"Zona 7","Orders_number":"ORD-005","Orders_facture":"FAC-005","Orders_facture_descripcion":"Brownie + Café","Restaurant_id":"<RESTAURANT_ID_1>","Menu_id":"<MENU_ID>","User_id":"<USER_ID_CLIENTE>"}
```

---

## Resumen del orden

1. **Registrar** 5 ADMIN, 5 GERENTE, 5 CLIENTE → anotar _id de clientes.
2. **Login** con un ADMIN → copiar token.
3. **Crear contactos** → anotar _id.
4. **Crear restaurantes** (con contact_id) → anotar _id de restaurantes.
5. (Opcional) **Crear mesas** → anotar _id de una mesa.
6. **Crear menú** (con Restaurant_id) → anotar _id de un plato.
7. **Crear reservaciones** (restaurant_id, user_id de cliente, table_id si es mesa).
8. **Crear pedidos** (Restaurant_id, Menu_id, User_id).

Sustituye siempre `<CONTACT_ID_1>`, `<RESTAURANT_ID_1>`, `<TABLE_ID>`, `<MENU_ID>`, `<USER_ID_CLIENTE>` por los **\_id** que devuelve la API en cada paso.
