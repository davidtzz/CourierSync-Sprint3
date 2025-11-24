# Endpoints Requeridos del Backend Spring

Este documento detalla todos los endpoints que el frontend espera encontrar en tu backend Spring Boot.

## 🔐 Autenticación (`/api/auth`)

### POST `/api/auth/login`
Inicia sesión de un usuario.

**Request Body:**
```json
{
  "identificador": "string",  // Puede ser cédula o email
  "password": "string"
}
```

**Response 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "cedula": "1234567890",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "celular": "3001234567",
    "rol": "Gestor de Rutas"
  }
}
```

**Response 401 Unauthorized:**
```json
{
  "message": "Credenciales inválidas"
}
```

---

### POST `/api/auth/register`
Registra un nuevo usuario.

**Request Body:**
```json
{
  "cedula": "string",
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "celular": "string",
  "rol": "Gestor de Rutas" | "Auditor" | "Conductor",
  "password": "string"
}
```

**Response 201 Created:**
```json
{
  "cedula": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "celular": "3001234567",
  "rol": "Gestor de Rutas"
}
```

**Response 400 Bad Request:**
```json
{
  "message": "La cédula o email ya están registrados"
}
```

---

### GET `/api/auth/me`
Obtiene el usuario actual autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200 OK:**
```json
{
  "cedula": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "celular": "3001234567",
  "rol": "Gestor de Rutas"
}
```

**Response 401 Unauthorized:**
```json
{
  "message": "Token inválido o expirado"
}
```

---

## 👥 Usuarios (`/api/usuarios`)

### GET `/api/usuarios`
Obtiene todos los usuarios registrados.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200 OK:**
```json
[
  {
    "cedula": "1234567890",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "celular": "3001234567",
    "rol": "Gestor de Rutas"
  },
  {
    "cedula": "0987654321",
    "nombre": "María",
    "apellido": "González",
    "email": "maria@example.com",
    "celular": "3007654321",
    "rol": "Conductor"
  }
]
```

---

### GET `/api/usuarios/{cedula}`
Obtiene un usuario por su cédula.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `cedula` (string): Cédula del usuario

**Response 200 OK:**
```json
{
  "cedula": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "celular": "3001234567",
  "rol": "Gestor de Rutas"
}
```

**Response 404 Not Found:**
```json
{
  "message": "Usuario no encontrado"
}
```

---

### GET `/api/usuarios/rol/{rol}`
Obtiene usuarios filtrados por rol.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `rol` (string): Rol a filtrar ("Gestor de Rutas", "Auditor", "Conductor")

**Response 200 OK:**
```json
[
  {
    "cedula": "1234567890",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "celular": "3001234567",
    "rol": "Conductor"
  }
]
```

---

### PUT `/api/usuarios/{cedula}`
Actualiza un usuario existente.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `cedula` (string): Cédula del usuario a actualizar

**Request Body:**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "email": "juancarlos@example.com",
  "celular": "3001234567",
  "rol": "Gestor de Rutas"
}
```

**Response 200 OK:**
```json
{
  "cedula": "1234567890",
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "email": "juancarlos@example.com",
  "celular": "3001234567",
  "rol": "Gestor de Rutas"
}
```

---

### DELETE `/api/usuarios/{cedula}`
Elimina un usuario.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `cedula` (string): Cédula del usuario a eliminar

**Response 200 OK:**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

**Response 404 Not Found:**
```json
{
  "message": "Usuario no encontrado"
}
```

---

## 🛣️ Rutas (`/api/rutas`)

### GET `/api/rutas`
Obtiene todas las rutas.

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200 OK:**
```json
[
  {
    "idRuta": "RUTA_001",
    "distanciaTotal": 45.5,
    "tiempoPromedio": 60,
    "traficoPromedio": "Moderado",
    "prioridad": "Alta",
    "estadoRuta": "Activa",
    "vehiculoAsignado": {
      "placaVehiculo": "ABC123"
    },
    "conductorAsignado": {
      "cedula": "1234567890",
      "nombre": "Juan"
    }
  }
]
```

---

### GET `/api/rutas/{idRuta}`
Obtiene una ruta por su ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `idRuta` (string): ID de la ruta (ej: "RUTA_001")

**Response 200 OK:**
```json
{
  "idRuta": "RUTA_001",
  "distanciaTotal": 45.5,
  "tiempoPromedio": 60,
  "traficoPromedio": "Moderado",
  "prioridad": "Alta",
  "estadoRuta": "Activa",
  "vehiculoAsignado": {
    "placaVehiculo": "ABC123"
  },
  "conductorAsignado": {
    "cedula": "1234567890",
    "nombre": "Juan"
  }
}
```

---

### GET `/api/rutas/conductor/{cedula}`
Obtiene todas las rutas asignadas a un conductor.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `cedula` (string): Cédula del conductor

**Response 200 OK:**
```json
[
  {
    "idRuta": "RUTA_001",
    "distanciaTotal": 45.5,
    "tiempoPromedio": 60,
    "traficoPromedio": "Moderado",
    "prioridad": "Alta",
    "estadoRuta": "Activa",
    "vehiculoAsignado": {
      "placaVehiculo": "ABC123"
    },
    "conductorAsignado": {
      "cedula": "1234567890",
      "nombre": "Juan"
    }
  }
]
```

---

### POST `/api/rutas`
Crea una nueva ruta.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "distanciaTotal": 45.5,
  "tiempoPromedio": 60,
  "traficoPromedio": "Moderado",
  "prioridad": "Alta",
  "estadoRuta": "Pendiente",
  "vehiculoAsignado": {
    "placaVehiculo": "ABC123"
  },
  "conductorAsignado": {
    "cedula": "1234567890",
    "nombre": "Juan"
  }
}
```

**Nota:** El `idRuta` puede ser generado automáticamente por el backend o enviado en el body.

**Response 201 Created:**
```json
{
  "idRuta": "RUTA_001",
  "distanciaTotal": 45.5,
  "tiempoPromedio": 60,
  "traficoPromedio": "Moderado",
  "prioridad": "Alta",
  "estadoRuta": "Pendiente",
  "vehiculoAsignado": {
    "placaVehiculo": "ABC123"
  },
  "conductorAsignado": {
    "cedula": "1234567890",
    "nombre": "Juan"
  }
}
```

---

### PUT `/api/rutas/{idRuta}`
Actualiza una ruta existente.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `idRuta` (string): ID de la ruta a actualizar

**Request Body:**
```json
{
  "distanciaTotal": 50.0,
  "tiempoPromedio": 65,
  "traficoPromedio": "Alto",
  "prioridad": "Media",
  "estadoRuta": "Activa",
  "vehiculoAsignado": {
    "placaVehiculo": "XYZ789"
  },
  "conductorAsignado": {
    "cedula": "0987654321",
    "nombre": "María"
  }
}
```

**Response 200 OK:**
```json
{
  "idRuta": "RUTA_001",
  "distanciaTotal": 50.0,
  "tiempoPromedio": 65,
  "traficoPromedio": "Alto",
  "prioridad": "Media",
  "estadoRuta": "Activa",
  "vehiculoAsignado": {
    "placaVehiculo": "XYZ789"
  },
  "conductorAsignado": {
    "cedula": "0987654321",
    "nombre": "María"
  }
}
```

---

### DELETE `/api/rutas/{idRuta}`
Elimina una ruta.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `idRuta` (string): ID de la ruta a eliminar

**Response 200 OK:**
```json
{
  "message": "Ruta eliminada correctamente"
}
```

**Response 404 Not Found:**
```json
{
  "message": "Ruta no encontrada"
}
```

---

## 📝 Notas Importantes

1. **Autenticación:** Todos los endpoints excepto `/api/auth/login` y `/api/auth/register` requieren el header `Authorization: Bearer {token}`.

2. **Códigos de Estado HTTP:**
   - `200 OK`: Operación exitosa
   - `201 Created`: Recurso creado exitosamente
   - `400 Bad Request`: Error en los datos enviados
   - `401 Unauthorized`: No autenticado o token inválido
   - `403 Forbidden`: No tiene permisos para la operación
   - `404 Not Found`: Recurso no encontrado
   - `500 Internal Server Error`: Error del servidor

3. **Formato de Datos:**
   - Todas las peticiones y respuestas deben usar `Content-Type: application/json`
   - Las fechas pueden enviarse como strings en formato ISO 8601

4. **Validaciones Esperadas:**
   - Email debe tener formato válido
   - Cédula debe ser única
   - Password debe tener al menos 4 caracteres (o según tu política)
   - Campos requeridos deben estar presentes

5. **Valores Enum:**
   - `rol`: "Gestor de Rutas" | "Auditor" | "Conductor"
   - `traficoPromedio`: "Bajo" | "Moderado" | "Alto" | "Muy Alto"
   - `prioridad`: "Baja" | "Media" | "Alta"
   - `estadoRuta`: "Pendiente" | "Activa" | "En Proceso" | "Completada" | "Cancelada"

