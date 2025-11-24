import { useState, useEffect } from 'react';
import { Users, User, Badge as BadgeIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import { getUsuarios } from '@/utils/localStorage';

const Team = () => {
  const [usuarios, setUsuarios] = useState(getUsuarios());

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'Gestor de Rutas': return 'bg-accent text-white';
      case 'Auditor': return 'bg-blue-500 text-white';
      case 'Conductor': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const stats = {
    total: usuarios.length,
    gestores: usuarios.filter(u => u.rol === 'Gestor de Rutas').length,
    auditores: usuarios.filter(u => u.rol === 'Auditor').length,
    conductores: usuarios.filter(u => u.rol === 'Conductor').length,
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Equipo</h1>
          <p className="text-muted-foreground">
            Visualiza todos los usuarios registrados en el sistema
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>Total de Usuarios</CardDescription>
              <CardTitle className="text-4xl text-primary">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardDescription>Gestores</CardDescription>
              <CardTitle className="text-4xl text-accent">{stats.gestores}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardDescription>Auditores</CardDescription>
              <CardTitle className="text-4xl text-blue-600">{stats.auditores}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="shadow-soft border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardDescription>Conductores</CardDescription>
              <CardTitle className="text-4xl text-green-600">{stats.conductores}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabla de usuarios */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-primary">
              <Users className="inline h-6 w-6 mr-2" />
              Usuarios Registrados ({usuarios.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.cedula} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">{usuario.cedula}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="bg-primary text-white rounded-full p-2 mr-3">
                            <User className="h-4 w-4" />
                          </div>
                          {usuario.nombre} {usuario.apellido}
                        </div>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.celular}</TableCell>
                      <TableCell>
                        <Badge className={getRolColor(usuario.rol)}>
                          <BadgeIcon className="h-3 w-3 mr-1" />
                          {usuario.rol}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Team;
