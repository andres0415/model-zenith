import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart3,
  Database,
  FileText,
  Activity,
  Beaker,
  Settings,
  User,
  LogOut,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3, permission: 'view' },
  { name: 'Registro de Modelos', href: '/register', icon: Database, permission: 'create' },
  { name: 'Informes', href: '/reports', icon: FileText, permission: 'view' },
  { name: 'Seguimiento', href: '/monitoring', icon: Activity, permission: 'view' },
  { name: 'Experimentos', href: '/experiments', icon: Beaker, permission: 'view' },
  { name: 'Configuración', href: '/settings', icon: Settings, permission: 'edit' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

  const filteredNavigation = navigation.filter(item => hasPermission(item.permission));

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-card border-r border-border lg:block hidden">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ModelGov</h1>
            <p className="text-sm text-muted-foreground">Gobierno de Modelos</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-soft",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-border px-4 py-4">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role.toUpperCase()}
              </p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};