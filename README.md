# Guía: Ejecutar Endpoints en Postman

## 1. Requisitos Previos

Asegúrate de que tu proyecto esté corriendo:
```bash
npm run dev
# O para producción:
npm start
```

El servidor debe estar disponible en: `http://localhost:3006/GestorRestaurante/v1`

## 2. Importar la Colección en Postman

### Opción A: Importar archivo JSON
1. Abre **Postman**
2. Haz clic en **Import** (arriba a la izquierda)
3. Selecciona **Upload Files** y elige `Postman_Collection.json`
4. Haz clic en **Import**

### Opción B: Crear colección manualmente
1. Crea una nueva colección llamada "Gestor de Restaurante"
2. Configura las variables de entorno (ver sección 3)

## 3. Configurar Variables de Entorno

Es crucial para que los endpoints funcionen correctamente.

### Variables necesarias:
```
base_url = http://localhost:3006/GestorRestaurante/v1
token = (se completa automáticamente después del login)
userId = (se completa automáticamente)
restaurantId = (se completa automáticamente)
tableId = (se completa automáticamente)
menuId = (se completa automáticamente)
orderId = (se completa automáticamente)
```

**¿Cómo configurarlas?**
1. En Postman, ve a **Environments** (lado izquierdo)
2. Haz clic en **+ Create**
3. Nombra como "Restaurante Dev"
4. Agrega las variables listadas arriba
5. Establécela como activa (en el dropdown superior derecho)

## 4. ORDEN DE EJECUCIÓN RECOMENDADO

### **Orden Crítico (debe respetarse):**

#### 1. **HEALTH CHECK** (opcional)
   - GET `/health` 
   - Verifica que el servidor esté funcionando

#### 2. **AUTHENTICATION** (OBLIGATORIO primero)
   ```
   Register User
   ↓
   Login User (obtiene token)
   ↓
   Get Profile
   └─ Get All Users
   ```
   
   **⚠️ IMPORTANTE:** 
   - El script POST `/login` guarda el token automáticamente
   - Sin el token, los demás endpoints fallarán
   - Cambia el email/password si ya existe un usuario

#### 3. **RESTAURANTS**
   ```
   Create Restaurant (genera restaurantId + 3 mesas automáticas)
   ↓
   Get All Restaurants
   ├─ Get Restaurant by ID
   └─ Update Restaurant
   ```

#### 4. **CONTACT** (opcional, para gestionar contactos)
   ```
   Create Contact
   ↓
   Get All Contacts
   ```

#### 5. **TABLES** (OMITIR - Se crean automáticamente)
   ```
   ⚠️ Se generan 3 mesas automáticamente al crear restaurante
   
   Opcional: Crear mesas adicionales
   ↓
   Get All Tables
   ├─ Get Table by ID
   └─ Update Table
   ```

#### 6. **ROLES**
   ```
   Get All Roles
   ```

#### 7. **MENU**
   ```
   Create Menu (genera menuId)
   ↓
   Get All Menus
   ├─ Get Menu by ID
   └─ Update Menu
   ```

#### 8. **ORDERS**
   ```
   Create Order (genera orderId)
   ↓
   Get All Orders
   └─ Get Order by ID
   ```

#### 9. **EVENTS**
   ```
   Create Event
   ↓
   Get All Events
   ```

## 5. Ejecutar en Orden Automático

### Opción A: Usar Runner de Postman (Recomendado)
1. Abre tu colección
2. Haz clic en **Run** (botón azul arriba)
3. Selecciona los requests en el orden correcto
4. Haz clic en **Run Gestor de Restaurante API**

### Opción B: Ejecutar manualmente
1. Expande cada carpeta en la colección
2. Ejecuta cada request de arriba a abajo
3. Verifica que cada uno sea exitoso antes del siguiente

## 6. Detalles Importantes

### **Scripts de Extracción Automática**
La colección incluye scripts que extraen IDs automáticamente:

```javascript
// Estos scripts se ejecutan después de cada request
// y guardan los IDs en las variables de entorno

if (pm.response.code === 201 || pm.response.code === 200) {
  var jsonData = pm.response.json();
  if (jsonData.data) {
    pm.environment.set('restaurantId', jsonData.data._id || jsonData.data.id);
  }
}
```

### **Variables que se completan automáticamente:**
- `token` → al hacer login
- `restaurantId` → al crear restaurante
- `tableId` → al crear mesa
- `menuId` → al crear menú
- `orderId` → al crear orden

### **Headers Automáticos**
Todos los requests protegidos incluyen:
```
Authorization: Bearer {{token}}
x-token: {{token}}
```

## 7. Solucionar Problemas

### Error: "Endpoint no encontrado"
- Verifica que el servidor esté corriendo
- Comprueba que `base_url` sea correcto en las variables

### Error: "No autorizado" o "Invalid token"
- Haz login primero
- Verifica que el token se haya guardado en las variables
- El token puede haber expirado, vuelve a hacer login

### Error: "ID no encontrado"
- Asegúrate de ejecutar los requests en orden
- Verifica que el ID se haya guardado en las variables
- Siempre crea primero, luego consulta

### Error 422 o 400 en Create
- Revisa el body JSON
- Algunos campos pueden ser obligatorios
- El email debe ser único para registro

## 8. Endpoints por Autenticación

### **Públicos (sin token):**
- POST `/auth/register`
- POST `/auth/login`

### **Requieren Autenticación:**
- GET `/auth/profile`
- GET `/auth/users` (solo ADMIN)
- GET `/restaurant`
- POST `/restaurant` (ADMIN/GERENTE)
- GET `/table` (Listar mesas - se crean automáticamente)
- POST `/table` (Opcional - crear mesas adicionales - ADMIN/GERENTE)
- GET `/menu`
- POST `/menu`
- GET `/order`
- POST `/order`
- GET `/events`
- POST `/events` (ADMIN/GERENTE)
- GET `/role`

## 9. Flujo Completo Simplificado

```
1. Health Check
   ↓
2. Register (crear usuario)
   ↓
3. Login (obtener token)
   ↓
4. Get Profile
   ↓
5. Create Restaurant (✅ se generan automáticamente 3 mesas por defecto)
   ↓
6. Create Menu
   ↓
7. Create Order
   ↓
8. Create Event
   ↓
9. Get All de cada recurso
```

⚠️ **Nota:** Al crear un restaurante, se generan automáticamente 3 mesas:
- Mesa 1 (Zona principal, capacidad 4)
- Mesa 2 (Zona principal, capacidad 4)
- Mesa 3 (Zona terraza, capacidad 6)

Si necesitas crear mesas adicionales, usa el endpoint POST `/table` (ADMIN/GERENTE).

## 10. Datos para cada Endpoint

### **Create Restaurant** (contact_id y table_id son opcionales)
```json
{
  "restaurant_name": "La Pizzería Italiana",
  "restaurant_type": "Pizzería",
  "restaurant_type_gastronomic": "Italiana",
  "restaurant_direction": "Calle Principal 456",
  "restaurant_time_start": "10:00",
  "restaurant_time_close": "23:00",
  "restaurant_mean_price": 25.50,
  "restaurant_images": ["https://ejemplo.com/foto1.jpg"]
}
```

✅ **Si contact_id y table_id no se proporcionan, se generan automáticamente IDs aleatorios.**

### **Create Menu**
```json
{
  "nombre": "Ensalada César",
  "descripcion": "Ensalada fresca con pollo y aderezo César",
  "precio": 12.99,
  "categoria": "Ensaladas",
  "restaurantId": "{{restaurantId}}"
}
```

### **Create Table** (Opcional - ADMIN/GERENTE)

⚠️ **Nota:** Se crean 3 mesas automáticamente al crear un restaurante. Este endpoint es solo si quieres crear mesas adicionales.

**Endpoint:**
```
POST http://localhost:3006/GestorRestaurante/v1/table
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body:**
```json
{
  "table_name": "Mesa VIP",
  "table_number": 4,
  "table_ubication": "Área privada",
  "table_capacity": 8,
  "table_time_available": "10:00",
  "table_state": "Disponible",
  "restaurant_id": "{{restaurantId}}"
}
```

**Estados válidos:**
- `"Disponible"` (con mayúscula)
- `"Ocupada"` (con mayúscula)
- `"Reservada"` (con mayúscula)

### **Create Contact** (opcional)
```json
{
  "contact_type": "Gerente",
  "contact_name": "Juan García",
  "contact_position": "Gerente General",
  "contact_phone_number": "87654321",
  "contact_email": "juan@restaurante.com"
}
```

### **Create Order**
```json
{
  "mesa_id": "{{tableId}}",
  "items": [
    {
      "menu_id": "{{menuId}}",
      "cantidad": 2,
      "especificaciones": "Sin cebolla"
    }
  ],
  "total": 29.98,
  "estado": "Pendiente"
}
```

### **Create Event**
```json
{
  "nombre": "Cena Especial",
  "descripcion": "Cena con degustación de vinos",
  "fecha": "2026-03-15",
  "hora": "19:00",
  "capacidad": 30,
  "restaurantId": "{{restaurantId}}"
}
```

### Usar Postman Monitor
1. Ve a **Monitors** 
2. Crea un nuevo monitor
3. Selecciona tu colección
4. Ejecuta automáticamente en intervalos

### Exportar Resultados
1. Haz clic en **...** → **Export Results**
2. Guarda en formato JSON

¡Listo! Ahora puedes ejecutar todos los endpoints en orden. 🚀
