# 📋 Guía: Orders - DetallePedido - Inventory Integration

**Última actualización:** Mayo 11, 2026  
**Estado:** ✅ Sistema operacional con consumo automático de inventario

---

## 🎯 Resumen de Cambios

El sistema de órdenes ahora está **completamente integrado** con DetallePedido e Inventory. Cuando creas un DetallePedido (producto en una orden), el sistema:

1. ✅ Busca la **Receta** asociada al producto (dish o beverage)
2. ✅ **Valida que haya stock** suficiente de TODOS los ingredientes
3. ✅ **Consume automáticamente** del inventario (si hay stock)
4. ✅ **Crea el DetallePedido** y lo vincula a la Order
5. ✅ **Retorna error** si no hay stock (sin modificar nada)

---

## 🔄 Flujo Completo de Creación de Orden

### Paso 1: Crear la Orden (vacía)

```bash
POST /GestorRestaurante/v1/orders
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "Orders_domicile": "Calle Principal 123",
  "Orders_number": "12345",
  "Orders_facture": "FAC-001",
  "Orders_facture_descripcion": "Pedido a domicilio",
  "Orders_cupon": null,
  "Restaurant_id": "67012345000000000000001",
  "Menu_id": "67012345000000000000002",
  "User_id": "67012345000000000000003"
}
```

**Respuesta (HTTP 201):**
```json
{
  "message": "Orden creada exitosamente",
  "data": {
    "_id": "670abcde000000000000001",
    "Orders_id": "ORD-1715414412345-a1b2c3d4",
    "Orders_domicile": "Calle Principal 123",
    "Orders_number": "12345",
    "Orders_facture": "FAC-001",
    "Orders_facture_descripcion": "Pedido a domicilio",
    "Orders_status": "en_preparacion",
    "Restaurant_id": "67012345000000000000001",
    "Menu_id": "67012345000000000000002",
    "User_id": "67012345000000000000003",
    "detallePedidos": [],
    "estado": true,
    "createdAt": "2026-05-11T12:00:00.000Z",
    "updatedAt": "2026-05-11T12:00:00.000Z"
  }
}
```

---

### Paso 2: Agregar Productos a la Orden

#### Ejemplo A: Agregar 2 Platillos (Dishes)

```bash
POST /GestorRestaurante/v1/detallepedido
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "orders_id": "670abcde000000000000001",
  "producto": "67012345000000000010",
  "productType": "dish",
  "candidadproducto": 2,
  "preciounitario": 85.50,
  "restaurant_id": "67012345000000000000001"
}
```

**Lo que sucede internamente:**
1. Busca Receta donde `dish_id = 67012345000000000010`
2. Obtiene ingredientes: `[{inventory_id: inv1, quantity: 0.5}, {inventory_id: inv2, quantity: 1.0}]`
3. Valida stock:
   - inv1: necesita 1.0 (0.5 × 2), ¿hay disponible? ✅
   - inv2: necesita 2.0 (1.0 × 2), ¿hay disponible? ✅
4. Consume del inventario:
   - inv1: quantity -= 1.0
   - inv2: quantity -= 2.0
5. Crea DetallePedido con total = 2 × 85.50 = 171.00
6. Agrega DetallePedido al array de la orden

**Respuesta (HTTP 201):**
```json
{
  "success": true,
  "message": "Detalle de pedido creado correctamente y inventario actualizado",
  "detallePedido": {
    "_id": "670def12000000000000001",
    "orders_id": "670abcde000000000000001",
    "producto": "67012345000000000010",
    "productType": "dish",
    "recipe_id": "670recipe0000000000001",
    "candidadproducto": 2,
    "preciounitario": 85.50,
    "total": 171.00,
    "restaurant_id": "67012345000000000000001",
    "estado": true,
    "createdAt": "2026-05-11T12:00:30.000Z",
    "updatedAt": "2026-05-11T12:00:30.000Z"
  }
}
```

#### Ejemplo B: Agregar Bebida (Beverage)

```bash
POST /GestorRestaurante/v1/detallepedido
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "orders_id": "670abcde000000000000001",
  "producto": "67012345000000000020",
  "productType": "beverage",
  "candidadproducto": 3,
  "preciounitario": 25.00,
  "restaurant_id": "67012345000000000000001"
}
```

**Respuesta (HTTP 201):** Similar al ejemplo A

---

### Paso 3: Error - Stock Insuficiente

Si intentas crear un DetallePedido y NO hay suficiente stock:

```bash
POST /GestorRestaurante/v1/detallepedido
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "orders_id": "670abcde000000000000001",
  "producto": "67012345000000000030",
  "productType": "dish",
  "candidadproducto": 100,  # Cantidad muy alta
  "preciounitario": 50,
  "restaurant_id": "67012345000000000000001"
}
```

**Respuesta (HTTP 400):**
```json
{
  "success": false,
  "message": "Stock insuficiente para completar la orden",
  "error": "Stock insuficiente para Harina. Disponible: 500g, Requerido: 5000g",
  "code": "INSUFFICIENT_STOCK"
}
```

**Lo importante:** ⚠️ Ningún inventario se modificó. La orden se rechaza ANTES de consumir.

---

### Paso 4: Obtener Orden Completa con Detalles

```bash
GET /GestorRestaurante/v1/orders/670abcde000000000000001/details
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta (HTTP 200):**
```json
{
  "message": "Orden con detalles obtenida exitosamente",
  "data": {
    "_id": "670abcde000000000000001",
    "Orders_id": "ORD-1715414412345-a1b2c3d4",
    "Orders_domicile": "Calle Principal 123",
    "Orders_number": "12345",
    "Orders_facture": "FAC-001",
    "Orders_status": "en_preparacion",
    "Restaurant_id": {...},
    "User_id": {...},
    "detallePedidos": [
      {
        "_id": "670def12000000000000001",
        "orders_id": "670abcde000000000000001",
        "producto": "67012345000000000010",
        "productType": "dish",
        "recipe_id": {
          "_id": "670recipe0000000000001",
          "dish_id": "67012345000000000010",
          "ingredients": [
            {
              "inventory_id": "67inventory001",
              "quantity": 0.5,
              "unit": "kg"
            }
          ]
        },
        "candidadproducto": 2,
        "preciounitario": 85.50,
        "total": 171.00
      },
      {
        "_id": "670def12000000000000002",
        "orders_id": "670abcde000000000000001",
        "producto": "67012345000000000020",
        "productType": "beverage",
        "recipe_id": {...},
        "candidadproducto": 3,
        "preciounitario": 25.00,
        "total": 75.00
      }
    ],
    "estado": true,
    "createdAt": "2026-05-11T12:00:00.000Z",
    "updatedAt": "2026-05-11T12:00:35.000Z"
  }
}
```

---

## 📊 Estructura de Datos

### Relación Orders ↔ DetallePedido ↔ Recipe ↔ Inventory

```
Order
├── _id: ObjectId
├── Orders_id: String (ORD-TIMESTAMP-HASH)
├── Restaurant_id: ObjectId → Restaurant
├── User_id: ObjectId → Usuario
├── detallePedidos: [ObjectId] → [DetallePedido]
│   ├── DetallePedido
│   │   ├── _id: ObjectId
│   │   ├── orders_id: ObjectId → Order
│   │   ├── producto: ObjectId (dish_id o beverage_id)
│   │   ├── productType: "dish" | "beverage"
│   │   ├── recipe_id: ObjectId → Recipe
│   │   │   ├── dish_id o beverage_id
│   │   │   ├── ingredients: [{
│   │   │   │   ├── inventory_id: ObjectId → Inventory
│   │   │   │   ├── quantity: Number
│   │   │   │   ├── unit: String
│   │   │   }]
│   │   ├── candidadproducto: Number
│   │   ├── preciounitario: Number
│   │   └── total: Number
│   └── [más detalles...]
└── Orders_status: "en_preparacion" | "listo" | "entregado" | "cancelado"
```

---

## 🔧 Casos de Uso

### Caso 1: Producto SIN Receta

Si un producto (dish o beverage) no tiene Receta asociada:
- ✅ Se puede crear DetallePedido normalmente
- ✅ No se consume inventario
- ✅ `recipe_id` será `null`

```bash
POST /GestorRestaurante/v1/detallepedido
{
  "orders_id": "670abcde000000000000001",
  "producto": "67012345000000000099",  # Sin receta
  "productType": "dish",
  "candidadproducto": 1,
  "preciounitario": 30,
  "restaurant_id": "67012345000000000000001"
}

# Respuesta: Success 201
# recipe_id: null
# Inventario: sin cambios
```

---

### Caso 2: Producto CON Receta VACÍA (sin ingredientes)

Si un producto tiene Receta pero no hay ingredientes definidos:
- ✅ Se puede crear DetallePedido
- ✅ No se consume inventario (lista vacía)
- ✅ `recipe_id` estará poblado

---

### Caso 3: Producto CON Receta CON ingredientes

Si hay ingredientes en la Receta:
- ✅ Se valida stock de TODOS
- ⚠️ Si UNO falla: error 400, nada se modifica
- ✅ Si todos OK: se consumen todos

---

## 🚨 Manejo de Errores

### 1. Stock Insuficiente (HTTP 400)
```json
{
  "success": false,
  "message": "Stock insuficiente para completar la orden",
  "error": "Stock insuficiente para [nombre_item]. Disponible: X unit, Requerido: Y unit",
  "code": "INSUFFICIENT_STOCK"
}
```
**Acción:** Reducir cantidad solicitada o esperar restock.

### 2. Tipo de Producto Inválido (HTTP 400)
```json
{
  "success": false,
  "message": "Tipo de producto inválido",
  "error": "productType debe ser \"dish\" o \"beverage\"",
  "code": "INVALID_PRODUCT_TYPE"
}
```
**Acción:** Usar "dish" o "beverage".

### 3. Inventario No Encontrado (HTTP 404)
```json
{
  "success": false,
  "message": "Artículo de inventario no encontrado",
  "error": "Artículo de inventario no encontrado: [inventory_id]",
  "code": "INVENTORY_NOT_FOUND"
}
```
**Acción:** Verificar que los ingredients en la Recipe tengan inventario_id válido.

### 4. Orden No Encontrada (HTTP 404)
```json
{
  "success": false,
  "message": "Orden no encontrada"
}
```
**Acción:** Verificar que orders_id existe y es válido.

---

## 📝 Campos Requeridos

### POST /detallepedido

| Campo | Tipo | Requerido | Ejemplo |
|-------|------|----------|---------|
| `orders_id` | ObjectId | ✅ | `"670abcde000000000000001"` |
| `producto` | ObjectId | ✅ | `"67012345000000000010"` (dish_id) |
| `productType` | String | ✅ | `"dish"` o `"beverage"` |
| `candidadproducto` | Number | ✅ | `2` (mínimo 1) |
| `preciounitario` | Number | ✅ | `85.50` (mínimo 0) |
| `restaurant_id` | ObjectId | ✅ | `"67012345000000000000001"` |

---

## 🔍 Endpoints Disponibles

### Orders
- `POST /GestorRestaurante/v1/orders` - Crear orden
- `GET /GestorRestaurante/v1/orders` - Obtener todas
- `GET /GestorRestaurante/v1/orders/:id` - Obtener por ID
- **`GET /GestorRestaurante/v1/orders/:id/details`** - Obtener con detalles completos ⭐
- `GET /GestorRestaurante/v1/orders/search?searchTerm=...` - Buscar
- `PUT /GestorRestaurante/v1/orders/:id` - Actualizar
- `DELETE /GestorRestaurante/v1/orders/:id` - Eliminar

### DetallePedido
- `POST /GestorRestaurante/v1/detallepedido` - Crear detalle ⭐ (con consumo automático)
- `GET /GestorRestaurante/v1/detallepedido` - Obtener todos
- `GET /GestorRestaurante/v1/detallepedido/:id` - Obtener por ID
- **`GET /GestorRestaurante/v1/detallepedido/order/:orderId`** - Obtener por orden ⭐
- `PUT /GestorRestaurante/v1/detallepedido/:id` - Actualizar
- `DELETE /GestorRestaurante/v1/detallepedido/:id` - Eliminar

---

## ✅ Próximos Pasos

1. **Probar creación completa** de orden con múltiples detalles
2. **Verificar consumo** de inventario después de crear detalles
3. **Implementar rollback** en caso de error (opcional)
4. **Crear reportes** de órdenes con consumo de inventario
5. **Conectar con DetallePedido Automation** para cambiar status automáticamente

---

**Dudas o sugerencias:** Contactar al equipo de backend
