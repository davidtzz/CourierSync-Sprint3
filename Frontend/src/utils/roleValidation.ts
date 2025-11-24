import { authService } from '@/services/authService';
import { Rol, rolNumberToString } from '@/types/backend';

export const ROLES = {
  ADMIN: 'Admin',
  GESTOR: 'Gestor de Rutas',
  AUDITOR: 'Auditor',
  CONDUCTOR: 'Conductor',
} as const;

export const tienePermiso = (rolesPermitidos: string[]): boolean => {
  const rolNum = authService.getRol();
  if (!rolNum) return false;
  const rolString = rolNumberToString(rolNum);
  return rolesPermitidos.includes(rolString);
};

export const esAdmin = (): boolean => {
  return authService.getRol() === Rol.ADMIN;
};

export const esGestor = (): boolean => {
  const rol = authService.getRol();
  // Admin también tiene permisos de gestor
  return rol === Rol.GESTOR_RUTA || rol === Rol.ADMIN;
};

export const esAuditor = (): boolean => {
  // El backend no tiene rol Auditor separado, pero lo mantenemos por compatibilidad
  return false;
};

export const esConductor = (): boolean => {
  return authService.getRol() === Rol.CONDUCTOR;
};
