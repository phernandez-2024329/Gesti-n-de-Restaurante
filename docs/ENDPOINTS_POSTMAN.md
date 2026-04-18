# Endpoints completos – Postman (:id)

**Base URL:** `http://localhost:3000/GestorRestaurante/v1`  
*(Cambia `3000` si usas otro puerto)*

**Headers para rutas protegidas:**
- `Authorization: Bearer {{token}}`  
- o `x-token: {{token}}`

---

## 1. Reservaciones (reservation)

Rutas con `:id` para usar en Postman (Params → Path Variables → key `id`).

| Método    | Endpoint completo |
|-----------|--------------------|
| **POST**  | `http://localhost:3000/GestorRestaurante/v1/reservation` |
| **GET**   | `http://localhost:3000/GestorRestaurante/v1/reservation` |
| **GET**   | `http://localhost:3000/GestorRestaurante/v1/reservation?restaurant_id=:restaurant_id` |
| **GET**   | `http://localhost:3000/GestorRestaurante/v1/reservation?user_id=:user_id` |
| **GET**   | `http://localhost:3000/GestorRestaurante/v1/reservation/:id` |
| **PUT**   | `http://localhost:3000/GestorRestaurante/v1/reservation/:id` |
| **DELETE**| `http://localhost:3000/GestorRestaurante/v1/reservation/:id` |

**Notas:** POST y PUT requieren JWT + rol ADMIN o GERENTE. DELETE solo ADMIN. GET listar y GET por :id requieren JWT.

---

## 2. Reseñas (review)

| Método    | Endpoint completo |
|-----------|--------------------|
| **POST**  | `http://localhost:3000/GestorRestaurante/v1/review` |
| **GET**   | `http://localhost:3000/GestorRestaurante/v1/review` |
| **GET**   | `http://localhost:3000/GestorRestaurante/v1/review?restaurant_id=:restaurant_id` |
| **GET**   | `http://localhost:3000/GestorRestaurante/v1/review/:id` |
| **PUT**   | `http://localhost:3000/GestorRestaurante/v1/review/:id` |
| **DELETE**| `http://localhost:3000/GestorRestaurante/v1/review/:id` |

**Notas:** GET listar y GET por :id son públicos (sin token). POST, PUT y DELETE requieren JWT. En Postman puedes usar variable `{{id}}` y definirla en Params o en la colección.

---

## Uso en Postman

1. Crea una variable de entorno (o de colección) `baseUrl` = `http://localhost:3000/GestorRestaurante/v1`.
2. Otra variable `id` para el ID del recurso (reservación o reseña).
3. URLs de ejemplo:
   - Reservación por ID: `{{baseUrl}}/reservation/{{id}}`
   - Reseña por ID: `{{baseUrl}}/review/{{id}}`

Así Postman reconoce `:id` en la ruta y puedes asignar el valor en la pestaña **Params** (Path Variables) o en **Variables** de la colección.
