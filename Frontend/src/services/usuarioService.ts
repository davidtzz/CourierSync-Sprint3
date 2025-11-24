import apiClient from './api';
import { UsuarioBackend, CambiarRolRequest } from '@/types/backend';

/**
 * Servicio para gestión de usuarios en CourierSync
 */
export const usuarioService = {
  /**
   * Cambia el rol de un usuario
   * Requiere rol: ADMIN o GESTORRUTA
   * No se puede cambiar el propio rol
   * @param cedula - Cédula del usuario cuyo rol se desea cambiar
   * @param nuevoRol - Nuevo rol (1=Admin, 2=GestorRuta, 3=Conductor)
   * @returns Mensaje de confirmación
   */
  async cambiarRol(cedula: string, nuevoRol: number): Promise<string> {
    const request: CambiarRolRequest = { nuevoRol };
    const response = await apiClient.patch<string>(`/users/${cedula}/rol`, request);
    return response.data;
  },

  /**
   * Obtiene información de un usuario por cédula
   * @param cedula - Cédula del usuario
   * @returns Datos del usuario
   */
  async getByCedula(cedula: string): Promise<UsuarioBackend> {
    const response = await apiClient.get<UsuarioBackend>(`/user?cedula=${cedula}`);
    return response.data;
  },
};
