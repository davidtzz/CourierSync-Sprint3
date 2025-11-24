import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import RoleGuard from '@/components/RoleGuard';
import { saveRuta, generarIdRuta, Ruta, getUsuarios } from '@/utils/localStorage';
import { ROLES } from '@/utils/roleValidation';
import { useToast } from '@/hooks/use-toast';

const CreateRoute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const conductores = getUsuarios().filter(u => u.rol === 'Conductor');
  
  const [formData, setFormData] = useState<Partial<Ruta>>({
    idRuta: generarIdRuta(),
    distanciaTotal: 0,
    tiempoPromedio: 0,
    traficoPromedio: '',
    prioridad: '',
    estadoRuta: 'Pendiente',
  });

  const [vehiculoPlaca, setVehiculoPlaca] = useState('');
  const [conductorCedula, setConductorCedula] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.traficoPromedio || !formData.prioridad) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
      });
      return;
    }

    const nuevaRuta: Ruta = {
      ...formData as Ruta,
      vehiculoAsignado: vehiculoPlaca ? { placaVehiculo: vehiculoPlaca } : undefined,
      conductorAsignado: conductorCedula 
        ? { 
            cedula: conductorCedula,
            nombre: conductores.find(c => c.cedula === conductorCedula)?.nombre || ''
          } 
        : undefined,
    };

    saveRuta(nuevaRuta);
    
    toast({
      title: "¡Ruta creada!",
      description: `La ruta ${nuevaRuta.idRuta} ha sido registrada exitosamente`,
    });
    
    navigate('/view-routes');
  };

  const handleChange = (field: keyof Ruta, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <RoleGuard rolesPermitidos={[ROLES.GESTOR]}>
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <Card className="max-w-3xl mx-auto shadow-medium">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Crear Nueva Ruta</CardTitle>
              <CardDescription>
                Completa la información para registrar una nueva ruta en el sistema
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
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Activa">Activa</SelectItem>
                        <SelectItem value="Completada">Completada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
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
                        <SelectValue placeholder="Selecciona nivel" />
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
                        <SelectValue placeholder="Selecciona prioridad" />
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
                    <Label htmlFor="conductor">Conductor Asignado</Label>
                    <Select value={conductorCedula} onValueChange={setConductorCedula}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona conductor" />
                      </SelectTrigger>
                      <SelectContent>
                        {conductores.map(conductor => (
                          <SelectItem key={conductor.cedula} value={conductor.cedula}>
                            {conductor.nombre} {conductor.apellido} - {conductor.cedula}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-accent hover:bg-accent/90 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Crear Ruta
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/view-routes')}
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

export default CreateRoute;
