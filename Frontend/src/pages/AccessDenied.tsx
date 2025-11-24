import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { obtenerRol } from '@/utils/localStorage';

const AccessDenied = () => {
  const navigate = useNavigate();
  const rol = obtenerRol();

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-medium text-center animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="mx-auto bg-red-100 rounded-full p-6 w-fit">
              <ShieldAlert className="h-16 w-16 text-red-600" />
            </div>
            <CardTitle className="text-3xl text-primary">Acceso Denegado</CardTitle>
            <CardDescription className="text-base">
              Tu rol actual ({rol}) no tiene permisos para acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Si crees que esto es un error, contacta al administrador del sistema.
            </p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full bg-accent hover:bg-accent/90 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AccessDenied;
