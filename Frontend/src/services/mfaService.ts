import axios, { AxiosInstance } from 'axios';
import {
  MfaGenerateRequest,
  MfaGenerateResponse,
  MfaVerifyRequest,
  MfaVerifyResponse,
} from '@/types/backend';
import apiClient from './api';

// Cliente axios sin autenticación para MFA verify (no requiere token durante login)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/CourierSync/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);

const mfaClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio para autenticación Multi-Factor (MFA)
 */
export const mfaService = {
  /**
   * Genera un secreto MFA para un usuario y lo habilita
   * Requiere autenticación (usuario debe estar logueado)
   * @param cedula - Cédula del usuario
   * @returns Secreto TOTP y mensaje de confirmación
   */
  async generateSecret(cedula: string): Promise<MfaGenerateResponse> {
    const request: MfaGenerateRequest = { cedula };
    // Usar apiClient que incluye el token de autenticación automáticamente
    const response = await apiClient.post<MfaGenerateResponse>('/api/mfa/generate-secret', request);
    return response.data;
  },

  /**
   * Verifica un código TOTP de MFA y retorna el token JWT si es válido
   * Este endpoint NO requiere autenticación (es parte del flujo de login)
   * @param cedula - Cédula del usuario
   * @param code - Código TOTP de 6 dígitos
   * @returns Token JWT y datos del usuario
   */
  async verify(cedula: string, code: string): Promise<MfaVerifyResponse> {
    const request: MfaVerifyRequest = { cedula, code };
    const response = await mfaClient.post<MfaVerifyResponse>('/api/mfa/verify', request);
    
    const data = response.data;
    
    // Guardar token y datos del usuario
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('cedula', data.cedula);
      localStorage.setItem('rol', data.rol.toString());
      
      const usuarioActivo = {
        cedula: data.cedula,
        rol: data.rol,
      };
      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
    }
    
    return data;
  },
};

