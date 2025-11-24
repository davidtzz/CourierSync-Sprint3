# 🧪 Guía de Pruebas de Conexión

## ✅ Checklist de Verificación

### 1. Verificar Archivo .env
- [x] Archivo `.env` creado con la URL correcta
- [x] `VITE_API_BASE_URL=http://localhost:8080/CourierSync/api`

### 2. Verificar Backend
- [ ] Backend ejecutándose en `http://localhost:8080`
- [ ] Swagger UI accesible (generalmente en `http://localhost:8080/swagger-ui.html`)
- [ ] Endpoints visibles en Swagger

### 3. Verificar Frontend
- [ ] Frontend ejecutándose (`npm run dev`)
- [ ] Sin errores en la consola del navegador
- [ ] Sin errores en la terminal del frontend

## 🔍 Pruebas Manuales

### Prueba 1: Verificar Conexión Básica

1. Abre el navegador en `http://localhost:8080`
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Network** (Red)
4. Intenta hacer login
5. Verifica que aparezca una petición a `/CourierSync/api/login`

### Resultado Esperado:
- ✅ Petición HTTP aparece en Network
- ✅ Status code: 200 (éxito) o 401 (credenciales inválidas)
- ✅ Respuesta JSON visible

### Si hay Error:
- ❌ **CORS Error**: Verificar configuración CORS en backend
- ❌ **404 Not Found**: Verificar URL base en `.env`
- ❌ **Network Error**: Verificar que backend esté corriendo

### Prueba 2: Login Exitoso

1. Intenta hacer login con credenciales válidas
2. Verifica en **Application** → **Local Storage** que se guarde:
   - `token`
   - `cedula`
   - `rol`
   - `usuarioActivo`

### Resultado Esperado:
- ✅ Token guardado en localStorage
- ✅ Redirección a `/dashboard`
- ✅ Navbar muestra nombre de usuario

### Prueba 3: Obtener Rutas

1. Después de login, navega a "Ver Rutas"
2. Verifica en Network que se haga petición a `/CourierSync/api/routes/get/all`
3. Verifica que las rutas se muestren en la tabla

### Resultado Esperado:
- ✅ Petición con header `Authorization: Bearer {token}`
- ✅ Status code: 200
- ✅ Rutas mostradas en la tabla

### Prueba 4: Crear Ruta (si tienes permisos)

1. Navega a "Crear Ruta"
2. Completa el formulario
3. Envía el formulario
4. Verifica petición a `/CourierSync/api/routes/create`

### Resultado Esperado:
- ✅ Petición POST con datos correctos
- ✅ Status code: 201 (Created)
- ✅ Ruta creada y visible en la lista

## 🐛 Errores Comunes y Soluciones

### Error: "Network Error" o "Failed to fetch"

**Causa:** Backend no está corriendo o URL incorrecta

**Solución:**
1. Verifica que el backend esté ejecutándose
2. Verifica la URL en `.env`
3. Prueba acceder a `http://localhost:8080/CourierSync/api/routes/estados` directamente en el navegador

### Error: "CORS policy blocked"

**Causa:** CORS no configurado en el backend

**Solución:**
```java
@CrossOrigin(origins = "http://localhost:8080")
```

O configuración global en el backend.

### Error: "401 Unauthorized"

**Causa:** Token inválido o expirado

**Solución:**
1. Haz login nuevamente
2. Verifica que el token se esté enviando en el header
3. Verifica que el token no haya expirado (24 horas)

### Error: "404 Not Found"

**Causa:** Endpoint no existe o URL incorrecta

**Solución:**
1. Verifica en Swagger que el endpoint exista
2. Verifica la URL completa en Network tab
3. Verifica que el context path sea `/CourierSync/api`

## 📊 Verificación de Endpoints

Usa Swagger para verificar que estos endpoints estén disponibles:

### Auth Controller
- [ ] POST `/login`
- [ ] POST `/register`
- [ ] POST `/logout`
- [ ] GET `/user?cedula={cedula}`

### MFA Controller
- [ ] POST `/api/mfa/generate-secret`
- [ ] POST `/api/mfa/verify`

### Ruta Controller
- [ ] GET `/routes/get/all`
- [ ] GET `/routes/estados`
- [ ] GET `/routes/by-estado?estado={estado}`
- [ ] GET `/routes/trafico/all`
- [ ] GET `/routes/trafico/{nivelTrafico}`
- [ ] POST `/routes/create`
- [ ] PUT `/routes/update/{id}`
- [ ] DELETE `/routes/delete/{id}`

### Usuario Controller
- [ ] PATCH `/users/{cedula}/rol`

## 🎯 Próximos Pasos

Una vez que todas las pruebas pasen:

1. ✅ Login funciona
2. ✅ Rutas se cargan correctamente
3. ✅ Crear/Editar/Eliminar rutas funciona
4. ✅ Permisos por rol funcionan correctamente

---

**Nota:** Si encuentras algún error, revisa la consola del navegador y los logs del backend para más detalles.

