import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authService } from '@/services/authService';
import { mfaService } from '@/services/mfaService';
import { Rol, rolNumberToString } from '@/types/backend';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<number>(Rol.CONDUCTOR);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para MFA
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [cedulaMfa, setCedulaMfa] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        username,
        contraseña: password,
        rol,
      });

      if ('requiresMfa' in response && response.requiresMfa) {
        setRequiresMfa(true);
        setCedulaMfa(response.cedula);
        toast({
          title: "Verificación MFA requerida",
          description: "Ingresa el código de tu aplicación autenticadora",
        });
      } else if ('token' in response) {
        const rolString = rolNumberToString(response.rol);
        toast({
          title: "¡Bienvenido!",
          description: `Has iniciado sesión como ${rolString}`,
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || 
                          error.message || 
                          "Usuario o contraseña incorrectos";
      
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: typeof errorMessage === 'string' ? errorMessage : "Credenciales inválidas",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaLoading(true);

    try {
      const response = await mfaService.verify(cedulaMfa, mfaCode);
      const rolString = rolNumberToString(response.rol);
      
      toast({
        title: "¡Verificación exitosa!",
        description: `Has iniciado sesión como ${rolString}`,
      });
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data || 
                          error.message || 
                          "Código MFA inválido";
      
      toast({
        variant: "destructive",
        title: "Error de verificación",
        description: typeof errorMessage === 'string' ? errorMessage : "Código inválido",
      });
    } finally {
      setMfaLoading(false);
    }
  };

  if (requiresMfa) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-medium animate-fade-in">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto bg-accent rounded-full p-4 w-fit">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Verificación MFA</CardTitle>
            <CardDescription>
              Ingresa el código de 6 dígitos de tu aplicación autenticadora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mfaCode">Código de Verificación</Label>
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="000000"
                  value={mfaCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setMfaCode(value);
                  }}
                  maxLength={6}
                  required
                  className="border-input focus:ring-accent text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white"
                disabled={mfaLoading || mfaCode.length !== 6}
              >
                <Shield className="h-4 w-4 mr-2" />
                {mfaLoading ? 'Verificando...' : 'Verificar'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setRequiresMfa(false);
                  setMfaCode('');
                  setCedulaMfa('');
                }}
              >
                Volver
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select 
                value={rol.toString()} 
                onValueChange={(value) => setRol(parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Rol.ADMIN.toString()}>Admin</SelectItem>
                  <SelectItem value={Rol.GESTOR_RUTA.toString()}>Gestor de Rutas</SelectItem>
                  <SelectItem value={Rol.CONDUCTOR.toString()}>Conductor</SelectItem>
                </SelectContent>
              </Select>
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
