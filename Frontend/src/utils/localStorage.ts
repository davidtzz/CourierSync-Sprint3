// Interfaces para compatibilidad con componentes existentes
export interface Usuario {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  rol: 'Gestor de Rutas' | 'Auditor' | 'Conductor' | 'Admin';
  password?: string;
}

export interface Ruta {
  idRuta: string;
  distanciaTotal: number;
  tiempoPromedio: number;
  traficoPromedio: string;
  prioridad: string;
  estadoRuta: string;
  vehiculoAsignado?: { placaVehiculo: string };
  conductorAsignado?: { cedula: string; nombre: string };
}

// Funciones de compatibilidad - ahora usan authService
import { authService } from '@/services/authService';
import { rolNumberToString } from '@/types/backend';

// Sesión - Compatibilidad con componentes existentes
export const getUsuarioActivo = (): Usuario | null => {
  const usuarioStr = localStorage.getItem('usuarioActivo');
  if (usuarioStr) {
    try {
      return JSON.parse(usuarioStr);
    } catch {
      return null;
    }
  }
  
  // Si no hay usuario guardado pero hay token, intentar obtenerlo
  if (authService.isAuthenticated()) {
    const cedula = authService.getCedula();
    const rol = authService.getRol();
    if (cedula && rol) {
      return {
        cedula,
        nombre: '', // Se puede obtener del backend si es necesario
        apellido: '',
        email: '',
        celular: '',
        rol: rolNumberToString(rol) as 'Gestor de Rutas' | 'Auditor' | 'Conductor' | 'Admin',
      };
    }
  }
  
  return null;
};

export const setUsuarioActivo = (usuario: Usuario): void => {
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  localStorage.setItem('rolUsuario', usuario.rol);
};

export const logout = async (): Promise<void> => {
  try {
    await authService.logout();
  } catch (error) {
    // Si falla el logout del backend, limpiar localStorage de todas formas
    console.error('Error al hacer logout:', error);
  }
  localStorage.removeItem('usuarioActivo');
  localStorage.removeItem('rolUsuario');
};

export const obtenerRol = (): string | null => {
  return localStorage.getItem('rolUsuario');
};

// Funciones legacy - mantener para compatibilidad pero no usar en nuevos componentes
export const getUsuarios = (): Usuario[] => {
  const usuarios = localStorage.getItem("usuarios");
  return usuarios ? JSON.parse(usuarios) : [];
};

export const saveUsuario = (usuario: Usuario): boolean => {
  const usuarios = getUsuarios();
  const existe = usuarios.some(u => u.cedula === usuario.cedula || u.email === usuario.email);
  if (existe) return false;
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return true;
};

export const validarCredenciales = (identificador: string, password: string): Usuario | null => {
  const usuarios = getUsuarios();
  const usuario = usuarios.find(u => 
    (u.cedula === identificador || u.email === identificador) && u.password === password
  );
  return usuario || null;
};

// Rutas - Legacy (los componentes deben migrar a rutaService)
export const getRutas = (): Ruta[] => {
  const rutas = localStorage.getItem("rutas");
  return rutas ? JSON.parse(rutas) : [];
};

export const saveRuta = (ruta: Ruta): void => {
  const rutas = getRutas();
  rutas.push(ruta);
  localStorage.setItem("rutas", JSON.stringify(rutas));
};

export const updateRuta = (rutaActualizada: Ruta): void => {
  const rutas = getRutas();
  const index = rutas.findIndex(r => r.idRuta === rutaActualizada.idRuta);
  if (index !== -1) {
    rutas[index] = rutaActualizada;
    localStorage.setItem("rutas", JSON.stringify(rutas));
  }
};

export const deleteRuta = (idRuta: string): void => {
  const rutas = getRutas();
  const rutasFiltradas = rutas.filter(r => r.idRuta !== idRuta);
  localStorage.setItem("rutas", JSON.stringify(rutasFiltradas));
};

export const generarIdRuta = (): string => {
  const rutas = getRutas();
  const numero = rutas.length + 1;
  return `RUTA_${numero.toString().padStart(3, '0')}`;
};

export const getRutasPorConductor = (cedula: string): Ruta[] => {
  const rutas = getRutas();
  return rutas.filter(r => r.conductorAsignado?.cedula === cedula);
};
