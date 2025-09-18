import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        toast.success('¡Bienvenido a ModelGov!');
        navigate('/');
      } else {
        setError('Credenciales inválidas. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="bg-gradient-primary p-4 rounded-2xl w-16 h-16 mx-auto mb-4 shadow-strong">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ModelGov</h1>
          <p className="text-muted-foreground mt-2">
            Plataforma de Gobierno de Modelos de ML e IA
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-medium border-0 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Credenciales de demostración:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div><strong>Admin:</strong> admin / password</div>
                <div><strong>Editor:</strong> editor / password</div>
                <div><strong>Visualizador:</strong> viewer / password</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};