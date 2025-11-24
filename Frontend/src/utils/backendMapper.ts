/**
 * Utilidades para mapear entre los tipos del frontend y del backend
 */
import { Usuario } from './localStorage';
import { UsuarioBackend, RutaBackend, RolNames, RolValues } from '@/types/backend';
import { Ruta } from './localStorage';

/**
 * Mapea un UsuarioBackend a Usuario (formato del frontend)
 */
export function mapUsuarioBackendToFrontend(usuarioBackend: UsuarioBackend): Usuario {
  return {
    cedula: usuarioBackend.cedula,
    nombre: usuarioBackend.nombre,
    apellido: usuarioBackend.apellido,
    email: usuarioBackend.email,
    celular: usuarioBackend.celular,
    rol: RolNames[usuarioBackend.rol] as 'Gestor de Rutas' | 'Auditor' | 'Conductor',
    password: '', // No se incluye en respuestas del backend
  };
}

/**
 * Mapea un Usuario (frontend) a formato de registro del backend
 */
export function mapUsuarioToRegisterRequest(usuario: Partial<Usuario>): any {
  return {
    usuario: usuario.cedula || '', // Usar cédula como username si no hay otro campo
    cedula: usuario.cedula || '',
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    email: usuario.email || '',
    celular: usuario.celular || '',
    contraseña: usuario.password || '',
    confirmarContraseña: usuario.password || '',
    rol: usuario.rol ? RolValues[usuario.rol] : 3, // Default a Conductor
  };
}

/**
 * Mapea un RutaBackend a Ruta (formato del frontend)
 * Nota: Esto requiere mapear IDs a strings y estados/trafico a strings
 * Necesitarás obtener los estados y niveles de tráfico del backend para hacer el mapeo completo
 */
export function mapRutaBackendToFrontend(
  rutaBackend: RutaBackend,
  estadosMap?: Map<number, string>,
  traficoMap?: Map<number, string>
): Ruta {
  // Mapeo básico de estados (puedes ajustar según tu backend)
  const estadoMap = estadosMap || new Map([
    [1, 'Pendiente'],
    [2, 'Activa'],
    [3, 'En Proceso'],
    [4, 'Completada'],
    [5, 'Cancelada'],
  ]);

  // Mapeo básico de tráfico (puedes ajustar según tu backend)
  const traficoMapDefault = traficoMap || new Map([
    [1, 'Bajo'],
    [2, 'Moderado'],
    [3, 'Alto'],
    [4, 'Muy Alto'],
  ]);

  // Mapeo básico de prioridad (puedes ajustar según tu backend)
  const prioridadMap = new Map([
    [1, 'Baja'],
    [2, 'Media'],
    [3, 'Alta'],
  ]);

  return {
    idRuta: `RUTA_${rutaBackend.idRuta.toString().padStart(3, '0')}`,
    distanciaTotal: rutaBackend.distanciaTotal,
    tiempoPromedio: rutaBackend.tiempoPromedio,
    traficoPromedio: traficoMapDefault.get(rutaBackend.idTrafico) || 'Moderado',
    prioridad: prioridadMap.get(rutaBackend.prioridad) || 'Media',
    estadoRuta: estadoMap.get(rutaBackend.idEstado) || 'Pendiente',
    vehiculoAsignado: rutaBackend.vehiculoAsociado
      ? { placaVehiculo: rutaBackend.vehiculoAsociado }
      : undefined,
    conductorAsignado: rutaBackend.conductorAsignado
      ? {
          cedula: rutaBackend.conductorAsignado,
          nombre: '', // Necesitarías obtener el nombre del conductor por separado
        }
      : undefined,
  };
}

/**
 * Mapea un Ruta (frontend) a RutaRequest (backend)
 */
export function mapRutaToBackendRequest(
  ruta: Partial<Ruta>,
  estadosMap?: Map<string, number>,
  traficoMap?: Map<string, number>,
  prioridadMap?: Map<string, number>
): any {
  // Mapeos inversos
  const estadoMap = estadosMap || new Map([
    ['Pendiente', 1],
    ['Activa', 2],
    ['En Proceso', 3],
    ['Completada', 4],
    ['Cancelada', 5],
  ]);

  const traficoMapDefault = traficoMap || new Map([
    ['Bajo', 1],
    ['Moderado', 2],
    ['Alto', 3],
    ['Muy Alto', 4],
  ]);

  const prioridadMapDefault = prioridadMap || new Map([
    ['Baja', 1],
    ['Media', 2],
    ['Alta', 3],
  ]);

  // Extraer ID numérico si existe (formato RUTA_001 -> 1)
  let idRuta: number | undefined;
  if (ruta.idRuta) {
    const match = ruta.idRuta.match(/RUTA_(\d+)/);
    if (match) {
      idRuta = parseInt(match[1], 10);
    }
  }

  return {
    idRuta,
    vehiculoAsociado: ruta.vehiculoAsignado?.placaVehiculo || null,
    conductorAsociado: ruta.conductorAsignado?.cedula || null,
    idEstado: ruta.estadoRuta ? estadoMap.get(ruta.estadoRuta) || 1 : 1,
    distanciaTotal: ruta.distanciaTotal || 0,
    tiempoPromedio: ruta.tiempoPromedio || 0,
    idTrafico: ruta.traficoPromedio ? traficoMapDefault.get(ruta.traficoPromedio) || 2 : 2,
    prioridad: ruta.prioridad ? prioridadMapDefault.get(ruta.prioridad) || 2 : 2,
  };
}

/**
 * Convierte un rol string a número
 */
export function rolStringToNumber(rol: string): number {
  return RolValues[rol] || 3; // Default a Conductor
}

/**
 * Convierte un rol número a string
 */
export function rolNumberToString(rol: number): string {
  return RolNames[rol] || 'Conductor';
}

