import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authService } from '@/services/authService';
import { Rol } from '@/types/backend';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormData {
  usuario: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  contraseña: string;
  confirmarContraseña: string;
  rol: number;
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    usuario: '',
    cedula: '',
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    contraseña: '',
    confirmarContraseña: '',
    rol: Rol.CONDUCTOR,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.contraseña !== formData.confirmarContraseña) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Las contraseñas no coinciden",
      });
      setLoading(false);
      return;
    }

    if (formData.contraseña.length < 4) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña debe tener al menos 4 caracteres",
      });
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
      });
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data || 
                          error.message || 
                          "Error al crear la cuenta";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof errorMessage === 'string' ? errorMessage : "Error al registrar usuario",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-medium animate-fade-in">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-accent rounded-full p-4 w-fit">
            <Truck className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Crear Cuenta</CardTitle>
          <CardDescription>
            Completa el formulario para registrarte en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario *</Label>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={formData.usuario}
                  onChange={(e) => handleChange('usuario', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Número de cédula"
                  value={formData.cedula}
                  onChange={(e) => handleChange('cedula', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange('apellido', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">Celular *</Label>
                <Input
                  id="celular"
                  type="tel"
                  placeholder="3001234567"
                  value={formData.celular}
                  onChange={(e) => handleChange('celular', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select 
                  value={formData.rol.toString()} 
                  onValueChange={(value) => handleChange('rol', parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Rol.ADMIN.toString()}>Admin</SelectItem>
                    <SelectItem value={Rol.GESTOR_RUTA.toString()}>Gestor de Rutas</SelectItem>
                    <SelectItem value={Rol.CONDUCTOR.toString()}>Conductor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña">Contraseña *</Label>
              <div className="relative">
                <Input
                  id="contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crea una contraseña segura"
                  value={formData.contraseña}
                  onChange={(e) => handleChange('contraseña', e.target.value)}
                  required
                  minLength={4}
                  className="pr-10"
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
              <Label htmlFor="confirmarContraseña">Confirmar Contraseña *</Label>
              <div className="relative">
                <Input
                  id="confirmarContraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmarContraseña}
                  onChange={(e) => handleChange('confirmarContraseña', e.target.value)}
                  required
                  minLength={4}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={loading}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
