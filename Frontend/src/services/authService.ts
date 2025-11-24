import apiClient from './api';
import {
  LoginRequest,
  LoginResponse,
  LoginMfaResponse,
  RegisterRequest,
  LogoutResponse,
  UsuarioBackend,
} from '@/types/backend';

/**
 * Servicio de autenticación para CourierSync
 */
export const authService = {
  /**
   * Iniciar sesión
   * @param credentials - Credenciales de login (username, contraseña, rol)
   * @returns Token y datos del usuario, o información de MFA si es requerido
   */
  async login(credentials: LoginRequest): Promise<LoginResponse | LoginMfaResponse> {
    const response = await apiClient.post<LoginResponse | LoginMfaResponse>('/login', credentials);
    
    const data = response.data;
    
    // Si requiere MFA, retornar la respuesta con requiresMfa
    if ('requiresMfa' in data && data.requiresMfa) {
      return data as LoginMfaResponse;
    }
    
    // Si no requiere MFA, guardar token y datos del usuario
    const loginData = data as LoginResponse;
    if (loginData.token) {
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('cedula', loginData.cedula);
      localStorage.setItem('rol', loginData.rol.toString());
      
      // Guardar usuario activo (necesitamos obtener los datos completos)
      // Por ahora guardamos lo que tenemos
      const usuarioActivo = {
        cedula: loginData.cedula,
        rol: loginData.rol,
      };
      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
    }
    
    return loginData;
  },

  /**
   * Registrar nuevo usuario
   * @param userData - Datos del nuevo usuario
   * @returns Mensaje de éxito
   */
  async register(userData: RegisterRequest): Promise<string> {
    const response = await apiClient.post<string>('/register', userData);
    return response.data;
  },

  /**
   * Cerrar sesión
   * IMPORTANTE: El backend NO invalida el token. El frontend DEBE eliminar el token.
   * @returns Mensaje de confirmación o null si falla
   */
  async logout(): Promise<LogoutResponse | null> {
    try {
      // Intentar notificar al backend (opcional, pero recomendado)
      const response = await apiClient.post<LogoutResponse>('/logout');
      return response.data;
    } catch (error) {
      // Continuar con logout local incluso si falla la petición
      console.warn('No se pudo notificar logout al servidor:', error);
      return null;
    } finally {
      // SIEMPRE eliminar el token y limpiar el estado, independientemente de la respuesta del servidor
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('cedula');
      localStorage.removeItem('rol');
      localStorage.removeItem('rolUsuario');
    }
  },

  /**
   * Obtener información de un usuario por cédula
   * @param cedula - Cédula del usuario
   * @returns Datos del usuario
   */
  async getUser(cedula: string): Promise<UsuarioBackend> {
    const response = await apiClient.get<UsuarioBackend>(`/user?cedula=${cedula}`);
    return response.data;
  },

  /**
   * Obtener usuario actual (usando la cédula del token)
   * @returns Datos del usuario actual
   */
  async getCurrentUser(): Promise<UsuarioBackend> {
    const cedula = localStorage.getItem('cedula');
    if (!cedula) {
      throw new Error('No hay usuario autenticado');
    }
    return this.getUser(cedula);
  },

  /**
   * Verificar si hay un token guardado
   * @returns true si hay token, false en caso contrario
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener el token actual
   * @returns Token JWT o null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Obtener la cédula del usuario actual
   * @returns Cédula o null
   */
  getCedula(): string | null {
    return localStorage.getItem('cedula');
  },

  /**
   * Obtener el rol del usuario actual
   * @returns Rol numérico o null
   */
  getRol(): number | null {
    const rol = localStorage.getItem('rol');
    return rol ? parseInt(rol, 10) : null;
  },
};
