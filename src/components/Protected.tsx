import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedProps {
  children: ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const { isAuthenticated, initialize } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize auth state if not already done
    if (!isAuthenticated) {
      initialize();
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, initialize, navigate]);

  // Show loading or nothing while checking auth
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}