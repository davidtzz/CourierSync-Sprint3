/**
 * Tipos e interfaces para el backend CourierSync
 */

// Roles del sistema (valores numéricos)
export enum Rol {
  ADMIN = 1,
  GESTOR_RUTA = 2,
  CONDUCTOR = 3,
}

// Mapeo de roles numéricos a strings para el frontend
export const RolNames: Record<number, string> = {
  1: 'Admin',
  2: 'Gestor de Rutas',
  3: 'Conductor',
};

// Mapeo inverso: strings a números
export const RolValues: Record<string, number> = {
  'Admin': 1,
  'Gestor de Rutas': 2,
  'Conductor': 3,
};

/**
 * Convierte un rol número a string
 */
export function rolNumberToString(rol: number): string {
  return RolNames[rol] || 'Conductor';
}

/**
 * Convierte un rol string a número
 */
export function rolStringToNumber(rol: string): number {
  return RolValues[rol] || 3;
}

// Usuario del backend
export interface UsuarioBackend {
  cedula: string;
  usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  rol: number; // 1=Admin, 2=GestorRuta, 3=Conductor
  mfaEnabled?: boolean;
}

// Ruta del backend
export interface RutaBackend {
  idRuta: number;
  vehiculoAsociado: string | null;
  conductorAsignado: string | null;
  idEstado: number;
  distanciaTotal: number;
  tiempoPromedio: number;
  idTrafico: number;
  prioridad: number; // short
}

// Estado de ruta
export interface EstadoRuta {
  idEstado: number;
  nombreEstado: string;
}

// Request de Login
export interface LoginRequest {
  username: string;
  contraseña: string;
  rol: number; // 1=Admin, 2=GestorRuta, 3=Conductor
}

// Response de Login (sin MFA)
export interface LoginResponse {
  token: string;
  message: string;
  cedula: string;
  rol: number;
}

// Response de Login (con MFA requerido)
export interface LoginMfaResponse {
  message: string;
  requiresMfa: boolean;
  cedula: string;
}

// Request de Register
export interface RegisterRequest {
  usuario: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  contraseña: string;
  confirmarContraseña: string;
  rol: number; // 1=Admin, 2=GestorRuta, 3=Conductor
}

// Response de Logout
export interface LogoutResponse {
  message: string;
  cedula: string;
}

// Request para cambiar rol
export interface CambiarRolRequest {
  nuevoRol: number; // 1=Admin, 2=GestorRuta, 3=Conductor
}

// Request para crear/actualizar ruta
export interface RutaRequest {
  idRuta?: number; // Opcional, auto-generado si no se proporciona
  vehiculoAsociado?: string; // máx 25 caracteres
  conductorAsociado?: string; // máx 25 caracteres
  idEstado: number;
  distanciaTotal: number;
  tiempoPromedio: number;
  idTrafico: number;
  prioridad: number; // short
}

// MFA - Generar secret
export interface MfaGenerateRequest {
  cedula: string;
}

export interface MfaGenerateResponse {
  secret: string;
  message: string;
}

// MFA - Verificar código
export interface MfaVerifyRequest {
  cedula: string;
  code: string; // Código TOTP de 6 dígitos
}

export interface MfaVerifyResponse {
  token: string;
  message: string;
  cedula: string;
  rol: number;
}

