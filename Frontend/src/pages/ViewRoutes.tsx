import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, MapPin, Clock, TrendingUp, AlertCircle, ArrowUpDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import { getUsuarioActivo, Ruta } from '@/utils/localStorage';
import { esGestor, esConductor } from '@/utils/roleValidation';
import { rutaService } from '@/services/rutaService';
import { mapRutaBackendToFrontend } from '@/utils/backendMapper';
import { useToast } from '@/hooks/use-toast';

const ViewRoutes = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [filteredRutas, setFilteredRutas] = useState<Ruta[]>([]);
  const [filterType, setFilterType] = useState<string>('none');
  const [loading, setLoading] = useState(true);
  const [estadosMap, setEstadosMap] = useState<Map<number, string>>(new Map());
  const usuario = getUsuarioActivo();
  const { toast } = useToast();

  useEffect(() => {
    loadRutas();
  }, []);

  const loadRutas = async () => {
    try {
      setLoading(true);
      
      // Obtener estados primero para mapeo
      const estados = await rutaService.getEstados();
      const estadosMapLocal = new Map(estados.map(e => [e.idEstado, e.nombreEstado]));
      setEstadosMap(estadosMapLocal);
      
      // Obtener rutas
      let rutasBackend = await rutaService.getAll();
      
      // Convertir a formato frontend
      let rutasFrontend = rutasBackend.map(r => mapRutaBackendToFrontend(r, estadosMapLocal));
      
      // Si es conductor, filtrar por su cédula
      if (esConductor() && usuario) {
        rutasFrontend = rutasFrontend.filter(r => 
          r.conductorAsignado?.cedula === usuario.cedula
        );
      }
      
      setRutas(rutasFrontend);
      setFilteredRutas(rutasFrontend);
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al cargar rutas';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: typeof errorMessage === 'string' ? errorMessage : 'Error al cargar las rutas',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilter(filterType);
  }, [rutas, filterType]);

  const applyFilter = (filter: string) => {
    let sorted = [...rutas];
    
    switch (filter) {
      case 'distancia-menor':
        sorted.sort((a, b) => a.distanciaTotal - b.distanciaTotal);
        break;
      case 'distancia-mayor':
        sorted.sort((a, b) => b.distanciaTotal - a.distanciaTotal);
        break;
      case 'trafico-menor':
        sorted.sort((a, b) => {
          const traficoOrder: { [key: string]: number } = { 'Bajo': 1, 'Moderado': 2, 'Alto': 3, 'Muy Alto': 4 };
          return (traficoOrder[a.traficoPromedio] || 0) - (traficoOrder[b.traficoPromedio] || 0);
        });
        break;
      case 'trafico-mayor':
        sorted.sort((a, b) => {
          const traficoOrder: { [key: string]: number } = { 'Bajo': 1, 'Moderado': 2, 'Alto': 3, 'Muy Alto': 4 };
          return (traficoOrder[b.traficoPromedio] || 0) - (traficoOrder[a.traficoPromedio] || 0);
        });
        break;
      case 'prioridad-menor':
        sorted.sort((a, b) => {
          const prioridadOrder: { [key: string]: number } = { 'Baja': 1, 'Media': 2, 'Alta': 3 };
          return (prioridadOrder[a.prioridad] || 0) - (prioridadOrder[b.prioridad] || 0);
        });
        break;
      case 'prioridad-mayor':
        sorted.sort((a, b) => {
          const prioridadOrder: { [key: string]: number } = { 'Baja': 1, 'Media': 2, 'Alta': 3 };
          return (prioridadOrder[b.prioridad] || 0) - (prioridadOrder[a.prioridad] || 0);
        });
        break;
      default:
        break;
    }
    
    setFilteredRutas(sorted);
  };

  const handleDelete = async (idRuta: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta ruta?')) {
      return;
    }

    try {
      // Extraer ID numérico del formato "RUTA_001"
      const match = idRuta.match(/RUTA_(\d+)/);
      if (!match) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'ID de ruta inválido',
        });
        return;
      }
      
      const idNumero = parseInt(match[1], 10);
      await rutaService.delete(idNumero);
      
      toast({
        title: "Ruta eliminada",
        description: "La ruta ha sido eliminada correctamente",
      });
      
      // Recargar rutas
      await loadRutas();
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al eliminar ruta';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: typeof errorMessage === 'string' ? errorMessage : 'Error al eliminar la ruta',
      });
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return 'bg-red-500 text-white';
      case 'Media': return 'bg-yellow-500 text-white';
      case 'Baja': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activa': return 'bg-green-500 text-white';
      case 'Completada': return 'bg-blue-500 text-white';
      case 'Pendiente': return 'bg-yellow-500 text-white';
      case 'Cancelada': return 'bg-red-500 text-white';
      case 'En Proceso': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando rutas...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {esConductor() ? 'Mis Rutas Asignadas' : 'Gestión de Rutas'}
            </h1>
            <p className="text-muted-foreground">
              {esConductor() 
                ? 'Consulta las rutas donde has sido asignado como conductor' 
                : 'Visualiza y administra todas las rutas del sistema'}
            </p>
          </div>
          {esGestor() && (
            <Link to="/create-route">
              <Button className="bg-accent hover:bg-accent/90 text-white">
                + Nueva Ruta
              </Button>
            </Link>
          )}
        </div>

        {/* Filtros */}
        {rutas.length > 0 && (
          <Card className="shadow-soft mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">Ordenar por:</span>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[280px] border-primary/20 focus:ring-primary">
                    <SelectValue placeholder="Seleccionar filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin filtro</SelectItem>
                    <SelectItem value="distancia-menor">📍 Distancia: Menor a Mayor</SelectItem>
                    <SelectItem value="distancia-mayor">📍 Distancia: Mayor a Menor</SelectItem>
                    <SelectItem value="trafico-menor">🚦 Tráfico: Menor a Mayor</SelectItem>
                    <SelectItem value="trafico-mayor">🚦 Tráfico: Mayor a Menor</SelectItem>
                    <SelectItem value="prioridad-menor">⚠️ Prioridad: Menor a Mayor</SelectItem>
                    <SelectItem value="prioridad-mayor">⚠️ Prioridad: Mayor a Menor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {rutas.length === 0 ? (
          <Card className="shadow-soft text-center py-12">
            <CardContent>
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No hay rutas disponibles</h3>
              <p className="text-muted-foreground">
                {esConductor() 
                  ? 'Aún no tienes rutas asignadas. Contacta al gestor de rutas.' 
                  : 'Comienza creando tu primera ruta.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-primary">
                Rutas Registradas ({filteredRutas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Ruta</TableHead>
                      <TableHead>Distancia</TableHead>
                      <TableHead>Tiempo</TableHead>
                      <TableHead>Tráfico</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Conductor</TableHead>
                      {esGestor() && <TableHead className="text-right">Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRutas.map((ruta) => (
                      <TableRow key={ruta.idRuta} className="hover:bg-secondary/50">
                        <TableCell className="font-medium">{ruta.idRuta}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            {ruta.distanciaTotal} km
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {ruta.tiempoPromedio} min
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                            {ruta.traficoPromedio}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPrioridadColor(ruta.prioridad)}>
                            {ruta.prioridad}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getEstadoColor(ruta.estadoRuta)}>
                            {ruta.estadoRuta}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ruta.vehiculoAsignado?.placaVehiculo || 
                            <span className="text-muted-foreground">Sin asignar</span>}
                        </TableCell>
                        <TableCell>
                          {ruta.conductorAsignado?.nombre || 
                            <span className="text-muted-foreground">Sin asignar</span>}
                        </TableCell>
                        {esGestor() && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/edit-route/${ruta.idRuta}`}>
                                <Button variant="outline" size="sm" className="hover:bg-accent hover:text-white">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(ruta.idRuta)}
                                className="hover:bg-destructive hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ViewRoutes;
