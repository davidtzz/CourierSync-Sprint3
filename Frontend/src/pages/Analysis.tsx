import { BarChart3, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { getRutas, getUsuarioActivo, getRutasPorConductor } from '@/utils/localStorage';
import { esConductor } from '@/utils/roleValidation';

const Analysis = () => {
  const usuario = getUsuarioActivo();
  const todasLasRutas = getRutas();
  const misRutas = esConductor() && usuario ? getRutasPorConductor(usuario.cedula) : [];
  const rutas = esConductor() ? misRutas : todasLasRutas;

  const stats = {
    totalRutas: rutas.length,
    activas: rutas.filter(r => r.estadoRuta === 'Activa').length,
    completadas: rutas.filter(r => r.estadoRuta === 'Completada').length,
    pendientes: rutas.filter(r => r.estadoRuta === 'Pendiente').length,
    canceladas: rutas.filter(r => r.estadoRuta === 'Cancelada').length,
    prioridadAlta: rutas.filter(r => r.prioridad === 'Alta').length,
    distanciaTotal: rutas.reduce((acc, r) => acc + r.distanciaTotal, 0),
    tiempoPromedio: rutas.length > 0 
      ? (rutas.reduce((acc, r) => acc + r.tiempoPromedio, 0) / rutas.length).toFixed(1)
      : 0,
  };

  const traficoStats = {
    bajo: rutas.filter(r => r.traficoPromedio === 'Bajo').length,
    moderado: rutas.filter(r => r.traficoPromedio === 'Moderado').length,
    alto: rutas.filter(r => r.traficoPromedio === 'Alto').length,
    muyAlto: rutas.filter(r => r.traficoPromedio === 'Muy Alto').length,
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            <BarChart3 className="inline h-10 w-10 mr-3" />
            Análisis y Estadísticas
          </h1>
          <p className="text-muted-foreground">
            {esConductor() 
              ? 'Visualiza métricas y estadísticas de tus rutas asignadas'
              : 'Visualiza métricas y estadísticas generales del sistema'}
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>Total de Rutas</CardDescription>
              <CardTitle className="text-4xl text-primary">{stats.totalRutas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardDescription>Rutas Activas</CardDescription>
              <CardTitle className="text-4xl text-green-600">{stats.activas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardDescription>Completadas</CardDescription>
              <CardTitle className="text-4xl text-blue-600">{stats.completadas}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardDescription>Pendientes</CardDescription>
              <CardTitle className="text-4xl text-yellow-600">{stats.pendientes}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Métricas detalladas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-primary">
                <MapPin className="inline h-5 w-5 mr-2" />
                Métricas de Distancia y Tiempo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-muted-foreground">Distancia Total Acumulada</span>
                <span className="text-2xl font-bold text-primary">{stats.distanciaTotal.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-muted-foreground">Tiempo Promedio por Ruta</span>
                <span className="text-2xl font-bold text-accent">{stats.tiempoPromedio} min</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-muted-foreground">Rutas Canceladas</span>
                <span className="text-2xl font-bold text-red-600">{stats.canceladas}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-primary">
                <TrendingUp className="inline h-5 w-5 mr-2" />
                Niveles de Tráfico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">Tráfico Bajo</span>
                <span className="text-2xl font-bold text-green-600">{traficoStats.bajo}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <span className="text-yellow-700 font-medium">Tráfico Moderado</span>
                <span className="text-2xl font-bold text-yellow-600">{traficoStats.moderado}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="text-orange-700 font-medium">Tráfico Alto</span>
                <span className="text-2xl font-bold text-orange-600">{traficoStats.alto}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="text-red-700 font-medium">Tráfico Muy Alto</span>
                <span className="text-2xl font-bold text-red-600">{traficoStats.muyAlto}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        {stats.prioridadAlta > 0 && (
          <Card className="shadow-medium border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">
                <AlertTriangle className="inline h-5 w-5 mr-2" />
                Atención Requerida
              </CardTitle>
              <CardDescription>
                Actualmente hay {stats.prioridadAlta} ruta(s) de prioridad alta que requieren atención inmediata.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Analysis;
