# Guía de Conexión con Backend Spring

Esta guía te ayudará a conectar el frontend React con tu backend Spring Boot.

## 📋 Requisitos Previos

- Backend Spring Boot ejecutándose (puerto 8080 por defecto)
- Endpoints REST configurados en el backend
- CORS configurado en el backend para permitir peticiones desde el frontend

## 🔧 Paso 1: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# URL del backend Spring
VITE_API_BASE_URL=http://localhost:8080/api

# Tiempo de espera para las peticiones (en milisegundos)
VITE_API_TIMEOUT=10000
```

**Nota:** Ajusta la URL según tu configuración del backend. Si tu backend corre en otro puerto o tiene un contexto diferente, modifica `VITE_API_BASE_URL`.

## 🔧 Paso 2: Configurar CORS en Spring Boot

En tu aplicación Spring Boot, asegúrate de tener configurado CORS para permitir peticiones desde el frontend:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:8080") // Puerto del frontend Vite
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

O usando anotaciones en tu controlador principal:

```java
@CrossOrigin(origins = "http://localhost:8080", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TuControlador {
    // ...
}
```

## 📡 Paso 3: Estructura de Endpoints Esperados

El frontend espera los siguientes endpoints en tu backend Spring:

### Autenticación (`/api/auth`)

- **POST** `/api/auth/login`
  - Body: `{ "identificador": "string", "password": "string" }`
  - Response: `{ "token": "string", "usuario": { ... } }`

- **POST** `/api/auth/register`
  - Body: `{ "cedula": "string", "nombre": "string", "apellido": "string", "email": "string", "celular": "string", "rol": "string", "password": "string" }`
  - Response: `{ ...usuario }`

- **GET** `/api/auth/me`
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ ...usuario }`

### Usuarios (`/api/usuarios`)

- **GET** `/api/usuarios` - Obtener todos los usuarios
- **GET** `/api/usuarios/{cedula}` - Obtener usuario por cédula
- **GET** `/api/usuarios/rol/{rol}` - Obtener usuarios por rol
- **PUT** `/api/usuarios/{cedula}` - Actualizar usuario
- **DELETE** `/api/usuarios/{cedula}` - Eliminar usuario

### Rutas (`/api/rutas`)

- **GET** `/api/rutas` - Obtener todas las rutas
- **GET** `/api/rutas/{idRuta}` - Obtener ruta por ID
- **GET** `/api/rutas/conductor/{cedula}` - Obtener rutas por conductor
- **POST** `/api/rutas` - Crear nueva ruta
- **PUT** `/api/rutas/{idRuta}` - Actualizar ruta
- **DELETE** `/api/rutas/{idRuta}` - Eliminar ruta

## 📦 Paso 4: Modelos de Datos Esperados

### Usuario

```typescript
interface Usuario {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  rol: 'Gestor de Rutas' | 'Auditor' | 'Conductor';
  password?: string; // Solo para registro, no debe enviarse en respuestas
}
```

### Ruta

```typescript
interface Ruta {
  idRuta: string;
  distanciaTotal: number;
  tiempoPromedio: number;
  traficoPromedio: string; // 'Bajo' | 'Moderado' | 'Alto' | 'Muy Alto'
  prioridad: string; // 'Baja' | 'Media' | 'Alta'
  estadoRuta: string; // 'Pendiente' | 'Activa' | 'En Proceso' | 'Completada' | 'Cancelada'
  vehiculoAsignado?: {
    placaVehiculo: string;
  };
  conductorAsignado?: {
    cedula: string;
    nombre: string;
  };
}
```

## 🔐 Paso 5: Autenticación JWT

El frontend espera que el backend use JWT (JSON Web Tokens) para autenticación:

1. Al hacer login, el backend debe devolver un token JWT
2. El frontend guarda el token en `localStorage`
3. Todas las peticiones autenticadas incluyen el header: `Authorization: Bearer {token}`
4. Si el backend responde con 401, el frontend redirige automáticamente al login

### Ejemplo de respuesta de login en Spring:

```java
@PostMapping("/auth/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    // Validar credenciales
    Usuario usuario = usuarioService.validarCredenciales(
        request.getIdentificador(), 
        request.getPassword()
    );
    
    if (usuario == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    // Generar token JWT
    String token = jwtUtil.generateToken(usuario);
    
    // Devolver respuesta
    AuthResponse response = new AuthResponse();
    response.setToken(token);
    response.setUsuario(usuario);
    
    return ResponseEntity.ok(response);
}
```

## 🚀 Paso 6: Iniciar la Aplicación

1. **Inicia tu backend Spring:**
   ```bash
   mvn spring-boot:run
   # o
   ./mvnw spring-boot:run
   ```

2. **Inicia el frontend:**
   ```bash
   npm run dev
   ```

3. El frontend estará disponible en `http://localhost:8080` (configurado en `vite.config.ts`)

## 🔍 Paso 7: Verificar la Conexión

1. Abre las herramientas de desarrollador del navegador (F12)
2. Ve a la pestaña "Network" (Red)
3. Intenta hacer login o cualquier operación
4. Verifica que las peticiones se envíen correctamente al backend
5. Revisa las respuestas del servidor

## ⚠️ Solución de Problemas

### Error: CORS policy blocked

**Solución:** Asegúrate de que CORS esté configurado correctamente en tu backend Spring (ver Paso 2).

### Error: Network Error o Connection Refused

**Solución:** 
- Verifica que el backend esté ejecutándose
- Verifica que la URL en `.env` sea correcta
- Verifica que el puerto del backend sea el correcto

### Error: 401 Unauthorized

**Solución:**
- Verifica que el token JWT se esté enviando correctamente
- Verifica que el token no haya expirado
- Verifica la configuración de seguridad en Spring

### Error: 404 Not Found

**Solución:**
- Verifica que los endpoints en el backend coincidan con los esperados
- Verifica que el contexto de la aplicación (`/api`) esté configurado correctamente

## 📝 Notas Importantes

1. **Variables de entorno:** En Vite, las variables de entorno deben comenzar con `VITE_` para ser accesibles en el código del frontend.

2. **Proxy en desarrollo:** Si prefieres usar un proxy en lugar de CORS, puedes configurarlo en `vite.config.ts` (ver configuración adicional abajo).

3. **Producción:** En producción, asegúrate de actualizar `VITE_API_BASE_URL` con la URL real de tu backend.

4. **Seguridad:** Nunca expongas tokens o credenciales en el código del frontend. El token se guarda en `localStorage` pero esto tiene implicaciones de seguridad que debes considerar.

## 🔄 Migración de localStorage a API

Los servicios ya están creados en:
- `src/services/api.ts` - Cliente base de axios
- `src/services/authService.ts` - Servicios de autenticación
- `src/services/usuarioService.ts` - Servicios de usuarios
- `src/services/rutaService.ts` - Servicios de rutas

**Próximos pasos:** Actualizar los componentes para usar estos servicios en lugar de `localStorage`. Esto se puede hacer gradualmente, componente por componente.

