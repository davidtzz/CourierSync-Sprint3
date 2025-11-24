import { Navigate } from 'react-router-dom';
import { tienePermiso } from '@/utils/roleValidation';

interface RoleGuardProps {
  children: React.ReactNode;
  rolesPermitidos: string[];
}

const RoleGuard = ({ children, rolesPermitidos }: RoleGuardProps) => {
  if (!tienePermiso(rolesPermitidos)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
