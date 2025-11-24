/**
 * EJEMPLO: Versión actualizada de Login.tsx usando servicios de API
 * 
 * Este archivo muestra cómo migrar del uso de localStorage a servicios de API.
 * Para aplicar estos cambios, actualiza Login.tsx con este código.
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar si ya hay una sesión activa
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Llamar al servicio de autenticación
      const response = await authService.login({
        identificador,
        password,
      });

      // El servicio ya guarda el token y usuario en localStorage
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión como ${response.usuario.rol}`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      // Manejar errores de la API
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Usuario o contraseña incorrectos";
      
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medium animate-fade-in">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-accent rounded-full p-4 w-fit">
            <Truck className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identificador">Cédula o Email</Label>
              <Input
                id="identificador"
                type="text"
                placeholder="Ingresa tu cédula o email"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
                className="border-input focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-input focus:ring-accent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={loading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-accent hover:underline font-medium">
                Regístrate aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

