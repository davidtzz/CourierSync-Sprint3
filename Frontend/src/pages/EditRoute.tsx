import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import RoleGuard from '@/components/RoleGuard';
import { Ruta } from '@/utils/localStorage';
import { mapRutaBackendToFrontend, mapRutaToBackendRequest } from '@/utils/backendMapper';
import { rutaService } from '@/services/rutaService';
import { usuarioService } from '@/services/usuarioService';
import { ROLES } from '@/utils/roleValidation';
import { useToast } from '@/hooks/use-toast';

const EditRoute = () => {
  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Ruta | null>(null);
  const [vehiculoPlaca, setVehiculoPlaca] = useState('');
  const [conductorCedula, setConductorCedula] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [estadosMap, setEstadosMap] = useState<Map<number, string>>(new Map());
  const [estadosMapInverso, setEstadosMapInverso] = useState<Map<string, number>>(new Map());
  const [traficoMapInverso, setTraficoMapInverso] = useState<Map<string, number>>(new Map());
  const [prioridadMapInverso, setPrioridadMapInverso] = useState<Map<string, number>>(new Map());
  const [conductores, setConductores] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [idRuta]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Obtener estados para mapeo
      const estados = await rutaService.getEstados();
      const estadosMapLocal = new Map(estados.map(e => [e.idEstado, e.nombreEstado]));
      const estadosMapInversoLocal = new Map(estados.map(e => [e.nombreEstado, e.idEstado]));
      setEstadosMap(estadosMapLocal);
      setEstadosMapInverso(estadosMapInversoLocal);
      
      // Mapeos de tráfico y prioridad (ajustar según tu backend)
      const traficoMapInv = new Map([
        ['Bajo', 1],
        ['Moderado', 2],
        ['Alto', 3],
        ['Muy Alto', 4],
      ]);
      setTraficoMapInverso(traficoMapInv);
      
      const prioridadMapInv = new Map([
        ['Baja', 1],
        ['Media', 2],
        ['Alta', 3],
      ]);
      setPrioridadMapInverso(prioridadMapInv);
      
      // Extraer ID numérico del formato "RUTA_001"
      if (!idRuta) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "ID de ruta no válido",
        });
        navigate('/view-routes');
        return;
      }
      
      const match = idRuta.match(/RUTA_(\d+)/);
      if (!match) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Formato de ID de ruta inválido",
        });
        navigate('/view-routes');
        return;
      }
      
      const idNumero = parseInt(match[1], 10);
      
      // Obtener ruta del backend
      const rutaBackend = await rutaService.getById(idNumero);
      
      // Convertir a formato frontend
      const rutaFrontend = mapRutaBackendToFrontend(rutaBackend, estadosMapLocal);
      
      setFormData(rutaFrontend);
      setVehiculoPlaca(rutaFrontend.vehiculoAsignado?.placaVehiculo || '');
      setConductorCedula(rutaFrontend.conductorAsignado?.cedula || '');
      
      // Obtener conductores (necesitarías un endpoint para esto, por ahora usar usuarioService)
      // Por ahora dejamos vacío, se puede mejorar después
      setConductores([]);
      
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al cargar la ruta';
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "No se encontró la ruta",
      });
      navigate('/view-routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;

    if (!formData.traficoPromedio || !formData.prioridad || !formData.estadoRuta) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Extraer ID numérico
      const match = formData.idRuta.match(/RUTA_(\d+)/);
      if (!match) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "ID de ruta inválido",
        });
        return;
      }
      
      const idNumero = parseInt(match[1], 10);
      
      // Preparar datos para el backend
      const rutaParaBackend = {
        ...formData,
        vehiculoAsignado: vehiculoPlaca ? { placaVehiculo: vehiculoPlaca } : undefined,
        conductorAsignado: conductorCedula 
          ? { 
              cedula: conductorCedula,
              nombre: '', // Se puede obtener después si es necesario
            } 
          : undefined,
      };
      
      // Convertir a formato del backend
      const rutaRequest = mapRutaToBackendRequest(
        rutaParaBackend,
        estadosMapInverso,
        traficoMapInverso,
        prioridadMapInverso
      );
      
      // Actualizar en el backend
      await rutaService.update(idNumero, rutaRequest);
      
      toast({
        title: "¡Ruta actualizada!",
        description: `Los cambios en ${formData.idRuta} se guardaron correctamente`,
      });
      
      navigate('/view-routes');
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Error al actualizar la ruta';
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "Error al guardar los cambios",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Ruta, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  if (loading) {
    return (
      <RoleGuard rolesPermitidos={[ROLES.GESTOR]}>
        <div className="min-h-screen bg-secondary/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Cargando ruta...</span>
            </div>
          </main>
        </div>
      </RoleGuard>
    );
  }

  if (!formData) return null;

  return (
    <RoleGuard rolesPermitidos={[ROLES.GESTOR]}>
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate('/view-routes')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <Card className="max-w-3xl mx-auto shadow-medium">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Editar Ruta</CardTitle>
              <CardDescription>
                Modifica la información de la ruta {formData.idRuta}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="idRuta">ID de Ruta</Label>
                    <Input
                      id="idRuta"
                      value={formData.idRuta}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estadoRuta">Estado *</Label>
                    <Select 
                      value={formData.estadoRuta} 
                      onValueChange={(value) => handleChange('estadoRuta', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(estadosMap.values()).map(estado => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distancia">Distancia Total (km) *</Label>
                    <Input
                      id="distancia"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.distanciaTotal}
                      onChange={(e) => handleChange('distanciaTotal', parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tiempo">Tiempo Promedio (min) *</Label>
                    <Input
                      id="tiempo"
                      type="number"
                      min="0"
                      value={formData.tiempoPromedio}
                      onChange={(e) => handleChange('tiempoPromedio', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trafico">Tráfico Promedio *</Label>
                    <Select 
                      value={formData.traficoPromedio} 
                      onValueChange={(value) => handleChange('traficoPromedio', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bajo">Bajo</SelectItem>
                        <SelectItem value="Moderado">Moderado</SelectItem>
                        <SelectItem value="Alto">Alto</SelectItem>
                        <SelectItem value="Muy Alto">Muy Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad *</Label>
                    <Select 
                      value={formData.prioridad} 
                      onValueChange={(value) => handleChange('prioridad', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehiculo">Placa del Vehículo</Label>
                    <Input
                      id="vehiculo"
                      type="text"
                      placeholder="ABC123"
                      value={vehiculoPlaca}
                      onChange={(e) => setVehiculoPlaca(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conductor">Conductor Asignado (Cédula)</Label>
                    <Input
                      id="conductor"
                      type="text"
                      placeholder="Cédula del conductor"
                      value={conductorCedula}
                      onChange={(e) => setConductorCedula(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-accent hover:bg-accent/90 text-white"
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/view-routes')}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </RoleGuard>
  );
};

export default EditRoute;
