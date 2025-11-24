import { useState, useEffect } from 'react';
import { rutaService } from '@/services/rutaService';
import { authService } from '@/services/authService';
import { RutaBackend } from '@/types/backend';
import { mapRutaBackendToFrontend, Ruta } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

export const useRutas = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRutas();
  }, []);

  const loadRutas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener estados para mapeo
      const estados = await rutaService.getEstados();
      const estadosMap = new Map(estados.map(e => [e.idEstado, e.nombreEstado]));
      
      // Obtener rutas
      let rutasBackend: RutaBackend[];
      const cedula = authService.getCedula();
      const rol = authService.getRol();
      
      // Si es conductor, obtener solo sus rutas (necesitarías un endpoint específico)
      // Por ahora obtenemos todas y filtramos
      rutasBackend = await rutaService.getAll();
      
      // Convertir a formato frontend
      const rutasFrontend = rutasBackend.map(r => mapRutaBackendToFrontend(r, estadosMap));
      
      // Filtrar por conductor si es necesario
      if (rol === 3 && cedula) {
        const rutasFiltradas = rutasFrontend.filter(r => 
          r.conductorAsignado?.cedula === cedula
        );
        setRutas(rutasFiltradas);
      } else {
        setRutas(rutasFrontend);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Error al cargar rutas';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: typeof errorMessage === 'string' ? errorMessage : 'Error al cargar rutas',
      });
    } finally {
      setLoading(false);
    }
  };

  return { rutas, loading, error, reload: loadRutas };
};

