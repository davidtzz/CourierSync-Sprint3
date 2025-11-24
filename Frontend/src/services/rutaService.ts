import apiClient from './api';
import { RutaBackend, RutaRequest, EstadoRuta } from '@/types/backend';

/**
 * Servicio para gestión de rutas en CourierSync
 */
export const rutaService = {
  /**
   * Obtiene todas las rutas
   * Requiere rol: ADMIN, GESTORRUTA o AUDITOR
   * @returns Lista de rutas
   */
  async getAll(): Promise<RutaBackend[]> {
    const response = await apiClient.get<RutaBackend[]>('/routes/get/all');
    return response.data;
  },

  /**
   * Obtiene una ruta por su ID
   * @param id - ID numérico de la ruta
   * @returns Ruta encontrada
   */
  async getById(id: number): Promise<RutaBackend> {
    // Primero intentar obtener todas y filtrar, ya que no hay endpoint específico
    // O si hay endpoint específico, usarlo: `/routes/${id}`
    const allRoutes = await this.getAll();
    const ruta = allRoutes.find(r => r.idRuta === id);
    if (!ruta) {
      throw new Error(`Ruta con ID ${id} no encontrada`);
    }
    return ruta;
  },

  /**
   * Crea una nueva ruta
   * Requiere rol: ADMIN
   * @param rutaData - Datos de la nueva ruta
   * @returns Ruta creada
   */
  async create(rutaData: RutaRequest): Promise<RutaBackend> {
    const response = await apiClient.post<RutaBackend>('/routes/create', rutaData);
    return response.data;
  },

  /**
   * Actualiza una ruta existente
   * Requiere rol: ADMIN o GESTORRUTA
   * @param id - ID de la ruta a actualizar
   * @param rutaData - Datos actualizados
   * @returns Ruta actualizada
   */
  async update(id: number, rutaData: RutaRequest): Promise<RutaBackend> {
    const response = await apiClient.put<RutaBackend>(`/routes/update/${id}`, rutaData);
    return response.data;
  },

  /**
   * Elimina una ruta por su ID
   * @param id - ID de la ruta a eliminar
   * @returns Mensaje de confirmación
   */
  async delete(id: number): Promise<string> {
    const response = await apiClient.delete<string>(`/routes/delete/${id}`);
    return response.data;
  },

  /**
   * Obtiene todas las rutas ordenadas por tráfico ascendente
   * Requiere rol: ADMIN, GESTORRUTA o AUDITOR
   * @returns Lista de rutas ordenadas por tráfico
   */
  async getAllByTrafico(): Promise<RutaBackend[]> {
    const response = await apiClient.get<RutaBackend[]>('/routes/trafico/all');
    return response.data;
  },

  /**
   * Busca rutas por nivel de tráfico
   * Requiere rol: ADMIN, GESTORRUTA o AUDITOR
   * @param nivelTrafico - Nivel de tráfico (ej: "BAJO", "MEDIO", "ALTO")
   * @returns Lista de rutas con ese nivel de tráfico
   */
  async getByTrafico(nivelTrafico: string): Promise<RutaBackend[]> {
    const response = await apiClient.get<RutaBackend[]>(`/routes/trafico/${nivelTrafico}`);
    return response.data;
  },

  /**
   * Busca rutas por nombre de estado
   * @param nombreEstado - Nombre del estado (ej: "Activa", "Completada")
   * @returns Lista de rutas con ese estado
   */
  async getByEstado(nombreEstado: string): Promise<RutaBackend[]> {
    const response = await apiClient.get<RutaBackend[]>(`/routes/by-estado?estado=${encodeURIComponent(nombreEstado)}`);
    return response.data;
  },

  /**
   * Obtiene todos los estados de ruta disponibles
   * No requiere autenticación (público)
   * @returns Lista de estados
   */
  async getEstados(): Promise<EstadoRuta[]> {
    const response = await apiClient.get<EstadoRuta[]>('/routes/estados');
    return response.data;
  },
};
