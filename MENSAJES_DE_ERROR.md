# Mensajes de error de la API

Todos los errores de la API siguen un formato coherente para que el cliente pueda interpretarlos de forma uniforme.

## Formato estándar de error

```json
{
  "success": false,
  "message": "Descripción legible del error en español",
  "error": "CODIGO_OPCIONAL"
}
```

En validaciones (express-validator o Mongoose) se añade un array `errors` con detalle por campo cuando aplica.

## Códigos HTTP y uso

| Código | Uso |
|--------|-----|
| **400** | Petición inválida: datos faltantes, validación, ID inválido (CastError), archivo no válido, reserva duplicada, pedido incompleto. |
| **401** | No autenticado: token faltante, token inválido, token expirado. |
| **403** | Sin permisos: rol no permitido para la acción. |
| **404** | Recurso no encontrado: restaurante, mesa, menú, orden, reservación, contacto, etc. |
| **409** | Conflicto: correo o username ya en uso (usuario). |
| **423** | Cuenta desactivada (login). |
| **429** | Demasiadas peticiones (rate limit). |
| **500** | Error interno del servidor o error no clasificado. |

## Códigos `error` (campo opcional)

- `INVALID_ID` – ID de MongoDB inválido (formato incorrecto).
- `INVALID_TOKEN` – JWT mal formado.
- `TOKEN_EXPIRED` – JWT expirado.
- `DUPLICATE_FIELD` – Valor único duplicado (ej. email).
- `FORBIDDEN` – Acceso denegado por rol.
- `ACCOUNT_DISABLED` – Usuario desactivado.
- `RATE_LIMIT_EXCEEDED` – Límite general de peticiones.
- `AUTH_RATE_LIMIT_EXCEEDED` – Límite de intentos de login.
- `FILE_ERROR` – Error en subida de archivo (tamaño o tipo).
- `INCOMPLETE_ORDER` – Pedido con datos obligatorios faltantes.

## Dónde se manejan los errores

1. **middlewares/handle-errors.js** – Errores globales: ValidationError (Mongoose), duplicados (11000), CastError, JWT, Multer/file.
2. **middlewares/checkValidators.js** – Errores de express-validator (400 con `errors` por campo).
3. **middlewares/validate-JWT.js** – Token faltante, inválido o expirado (401).
4. **middlewares/validate-role.js** – Sin usuario en request (500) o rol no permitido (403).
5. **middlewares/request-limit.js** – Rate limit (429).
6. **Controladores** – Validaciones de negocio (400/404), CastError por recurso (400 con mensaje concreto), y catch genérico (500).

## Mensajes por recurso (resumen)

- **Auth**: Token de verificación faltante/inválido o expirado, credenciales inválidas, cuenta desactivada, campo ya registrado, error al registrar/iniciar sesión/obtener perfil/usuarios/actualizar/desactivar.
- **Restaurante**: Campo requerido, no encontrado, ID no válido, error al crear/obtener/actualizar/eliminar.
- **Mesa**: Restaurante no encontrado, mesa no encontrada, ID no válido, error al crear/obtener/actualizar/eliminar.
- **Menú**: Término de búsqueda obligatorio, menú no encontrado, no se encontraron menús, ID obligatorio o no válido, sin datos para actualizar, error al crear/obtener/buscar/actualizar/eliminar.
- **Orden**: Pedido incompleto, término de búsqueda obligatorio, orden no encontrada, ID obligatorio o no válido, sin datos para actualizar, error al crear/obtener/buscar/actualizar/eliminar.
- **Reservación**: Faltan campos obligatorios, table_id requerido para mesa, fecha inválida, mesa ya reservada, misma fecha/hora en el restaurante, reservación no encontrada, ID no válido, error al crear/obtener/actualizar/eliminar.
- **Evento**: Evento no encontrado, ID no válido, error al crear/obtener/actualizar/eliminar.
- **Contacto, Cupón, Reseña, Inventario, Información**: Recurso no encontrado, ID no válido, error al crear/obtener/actualizar/eliminar o desactivar.
- **Reportes**: Error al generar cada tipo de reporte (500).
- **Roles**: Error al obtener los roles (500).

En todos los `catch` de los controladores que usan `:id` se trata `CastError` y se devuelve 400 con mensaje tipo "ID de [recurso] no válido" y `error: 'INVALID_ID'` cuando aplica.
