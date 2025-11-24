import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUsuarioActivo, obtenerRol } from '@/utils/localStorage';
import { authService } from '@/services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = getUsuarioActivo();
  const rol = obtenerRol();

  const handleLogout = async () => {
    try {
      // Intentar notificar al backend (opcional, pero recomendado)
      await authService.logout();
    } catch (error) {
      // Continuar con logout local incluso si falla la petición
      console.warn('No se pudo notificar logout al servidor:', error);
    } finally {
      // SIEMPRE eliminar el token y limpiar el estado, independientemente de la respuesta del servidor
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('cedula');
      localStorage.removeItem('rol');
      localStorage.removeItem('rolUsuario');
      
      // Redirigir a login
      navigate('/login');
    }
  };

  if (!usuario) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="gradient-primary shadow-medium sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center space-x-3 text-white hover:opacity-90 transition-opacity">
            <div className="bg-accent rounded-full p-2">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:inline">Sistema de Transporte</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-white">
              <User className="h-4 w-4" />
              <span className="text-sm">{usuario.nombre} {usuario.apellido}</span>
            </div>
            
            <Badge className="bg-accent text-white border-0 hidden sm:inline-flex">
              {rol}
            </Badge>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
