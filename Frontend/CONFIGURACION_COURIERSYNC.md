# Configuración para CourierSync Backend

## ✅ Cambios Realizados

Todos los servicios han sido actualizados para coincidir con tu backend CourierSync:

### 1. URL Base Actualizada
- **Antes**: `http://localhost:8080/api`
- **Ahora**: `http://localhost:8080/CourierSync/api`

### 2. Servicios Actualizados

#### Autenticación (`authService.ts`)
- ✅ `login()` - Soporta MFA y login normal
- ✅ `register()` - Registro con estructura correcta
- ✅ `logout()` - Cierre de sesión
- ✅ `getUser()` - Obtener usuario por cédula
- ✅ `getCurrentUser()` - Obtener usuario actual

#### MFA (`mfaService.ts`)
- ✅ `generateSecret()` - Generar secreto MFA
- ✅ `verify()` - Verificar código TOTP

#### Rutas (`rutaService.ts`)
- ✅ `getAll()` - Obtener todas las rutas
- ✅ `create()` - Crear ruta (solo ADMIN)
- ✅ `update()` - Actualizar ruta (ADMIN o GESTORRUTA)
- ✅ `delete()` - Eliminar ruta
- ✅ `getAllByTrafico()` - Rutas ordenadas por tráfico
- ✅ `getByTrafico()` - Filtrar por nivel de tráfico
- ✅ `getByEstado()` - Filtrar por estado
- ✅ `getEstados()` - Obtener estados disponibles

#### Usuarios (`usuarioService.ts`)
- ✅ `cambiarRol()` - Cambiar rol de usuario
- ✅ `getByCedula()` - Obtener usuario por cédula

### 3. Tipos TypeScript (`types/backend.ts`)
- ✅ Interfaces para todas las entidades
- ✅ Enums para roles
- ✅ Tipos para requests y responses
- ✅ Soporte completo para MFA

### 4. Utilidades de Mapeo (`utils/backendMapper.ts`)
- ✅ Conversión entre tipos frontend y backend
- ✅ Mapeo de roles (string ↔ número)
- ✅ Mapeo de rutas (formato frontend ↔ backend)

## 📝 Configuración Requerida

### 1. Archivo `.env`

Crea o actualiza el archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8080/CourierSync/api
VITE_API_TIMEOUT=10000
```

### 2. CORS en Backend

Asegúrate de que tu backend Spring tenga configurado CORS para aceptar peticiones desde `http://localhost:8080`:

```java
@CrossOrigin(origins = "http://localhost:8080")
```

O si prefieres usar proxy en Vite, descomenta la configuración en `vite.config.ts`.

## 🔄 Diferencias Clave con el Frontend Original

### Autenticación
- **Login requiere**: `username`, `contraseña`, `rol` (número)
- **Roles son números**: 1=Admin, 2=GestorRuta, 3=Conductor
- **Soporte MFA**: El login puede retornar `requiresMfa: true`

### Rutas
- **ID es numérico**: No usa formato "RUTA_001", usa números enteros
- **Estados y tráfico son IDs**: No son strings, son números que referencian tablas
- **Estructura diferente**: Campos como `vehiculoAsociado`, `conductorAsignado` son strings, no objetos

### Usuarios
- **Campo `usuario`**: Además de `cedula`, hay un campo `usuario` (username)
- **Rol numérico**: El rol es un integer, no un string

## 🚀 Próximos Pasos

### 1. Actualizar Componentes

Los componentes actuales usan `localStorage` directamente. Necesitas actualizarlos para usar los servicios:

**Ejemplo de Login actualizado**: Ver `src/pages/Login.actualizado.tsx`

### 2. Mapear Datos

Usa las utilidades en `utils/backendMapper.ts` para convertir entre formatos:

```typescript
import { mapRutaBackendToFrontend, mapRutaToBackendRequest } from '@/utils/backendMapper';
import { rutaService } from '@/services/rutaService';

// Obtener rutas del backend
const rutasBackend = await rutaService.getAll();

// Convertir a formato del frontend
const rutasFrontend = rutasBackend.map(ruta => mapRutaBackendToFrontend(ruta));
```

### 3. Manejar Estados y Tráfico

Necesitarás obtener los mapeos de estados y tráfico del backend:

```typescript
// Obtener estados disponibles
const estados = await rutaService.getEstados();
const estadosMap = new Map(estados.map(e => [e.idEstado, e.nombreEstado]));

// Usar el mapa para convertir
const rutaFrontend = mapRutaBackendToFrontend(rutaBackend, estadosMap);
```

### 4. Actualizar Formularios

Los formularios de registro y creación de rutas necesitan ajustarse:

- **Registro**: Usar `mapUsuarioToRegisterRequest()` para convertir
- **Rutas**: Usar `mapRutaToBackendRequest()` para convertir

## ⚠️ Notas Importantes

1. **Roles**: Siempre usar números (1, 2, 3) al comunicarse con el backend
2. **MFA**: Implementar el flujo completo si tu aplicación lo requiere
3. **IDs de Ruta**: El backend usa números, el frontend puede mantener el formato "RUTA_001" para display
4. **Validación**: El backend valida con `@Valid`, asegúrate de validar en el frontend también
5. **Errores**: Los mensajes de error pueden venir como strings simples o objetos JSON

## 📚 Archivos de Referencia

- `src/services/authService.ts` - Autenticación
- `src/services/mfaService.ts` - MFA
- `src/services/rutaService.ts` - Rutas
- `src/services/usuarioService.ts` - Usuarios
- `src/types/backend.ts` - Tipos TypeScript
- `src/utils/backendMapper.ts` - Utilidades de mapeo
- `src/pages/Login.actualizado.tsx` - Ejemplo de login con MFA

## 🐛 Solución de Problemas

### Error: 404 Not Found
- Verifica que la URL base sea correcta: `http://localhost:8080/CourierSync/api`
- Verifica que el backend esté ejecutándose

### Error: CORS
- Verifica la configuración CORS en el backend
- O usa el proxy en Vite (descomenta en `vite.config.ts`)

### Error: 401 Unauthorized
- Verifica que el token se esté enviando correctamente
- Verifica que el token no haya expirado (24 horas)

### Error: 403 Forbidden
- Verifica que el usuario tenga el rol necesario para la operación
- Algunos endpoints requieren roles específicos

