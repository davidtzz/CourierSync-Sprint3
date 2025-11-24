import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, LogIn, UserPlus, Route, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getUsuarioActivo } from '@/utils/localStorage';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = getUsuarioActivo();
    if (usuario) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="container max-w-6xl animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto bg-accent rounded-full p-6 w-fit mb-6 shadow-medium">
            <Truck className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Sistema de Transporte y Distribución
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Optimiza tus rutas, gestiona tu equipo y controla tu distribución con eficiencia
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card 
            className="p-8 shadow-medium hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
            onClick={() => navigate('/login')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-accent rounded-full p-4">
                <LogIn className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-primary">Iniciar Sesión</h2>
              <p className="text-muted-foreground text-lg">
                Accede a tu cuenta y gestiona tus rutas
              </p>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white mt-4 text-lg py-6">
                <LogIn className="h-5 w-5 mr-2" />
                Ingresar
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 shadow-medium hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
            onClick={() => navigate('/register')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary rounded-full p-4">
                <UserPlus className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-primary">Registrarse</h2>
              <p className="text-muted-foreground text-lg">
                Crea una cuenta nueva y únete al equipo
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4 text-lg py-6">
                <UserPlus className="h-5 w-5 mr-2" />
                Crear Cuenta
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center shadow-soft bg-white/95">
            <div className="mx-auto bg-accent rounded-full p-3 w-fit mb-4">
              <Route className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Gestión de Rutas</h3>
            <p className="text-muted-foreground">
              Crea, edita y optimiza rutas de distribución
            </p>
          </Card>

          <Card className="p-6 text-center shadow-soft bg-white/95">
            <div className="mx-auto bg-primary rounded-full p-3 w-fit mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Control de Equipo</h3>
            <p className="text-muted-foreground">
              Administra conductores y asignaciones
            </p>
          </Card>

          <Card className="p-6 text-center shadow-soft bg-white/95">
            <div className="mx-auto bg-accent rounded-full p-3 w-fit mb-4">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Análisis y Reportes</h3>
            <p className="text-muted-foreground">
              Visualiza métricas y optimiza operaciones
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
