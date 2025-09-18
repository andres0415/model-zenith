import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Users,
  Clock,
  Target
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Mock data - in real app this would come from API
  const metrics = {
    totalModels: 87,
    modelsInProduction: 45,
    modelsNeedingReview: 12,
    highRiskModels: 5,
    averageAccuracy: 89.5,
    modelsCreatedThisMonth: 8
  };

  const recentModels = [
    {
      id: '1',
      name: 'BAC_VALOR-CLIENTE-CRI-HIP-12M_PRED_XGB_M',
      status: 'production',
      accuracy: 92.5,
      lastUpdate: '2024-01-15',
      risk: 'low'
    },
    {
      id: '2', 
      name: 'CHURN_PREDICTION_RF_V2',
      status: 'testing',
      accuracy: 87.2,
      lastUpdate: '2024-01-14',
      risk: 'medium'
    },
    {
      id: '3',
      name: 'CREDIT_SCORE_LGBM_PROD',
      status: 'production',
      accuracy: 94.1,
      lastUpdate: '2024-01-13',
      risk: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'bg-green-500';
      case 'testing': return 'bg-yellow-500';
      case 'development': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen ejecutivo del estado de tus modelos de ML e IA
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Modelos
            </CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.totalModels}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.modelsCreatedThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Producción
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.modelsInProduction}</div>
            <p className="text-xs text-muted-foreground">
              {((metrics.modelsInProduction / metrics.totalModels) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Requieren Revisión
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.modelsNeedingReview}</div>
            <p className="text-xs text-muted-foreground">
              Próximas revisiones programadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alto Riesgo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.highRiskModels}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance and Recent Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Rendimiento General
            </CardTitle>
            <CardDescription>
              Métricas de precisión promedio de todos los modelos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Precisión Promedio</span>
                <span className="font-semibold">{metrics.averageAccuracy}%</span>
              </div>
              <Progress value={metrics.averageAccuracy} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-xs text-muted-foreground">Modelos &gt; 85% precisión</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">72h</div>
                <div className="text-xs text-muted-foreground">Tiempo promedio de respuesta</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Models */}
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Modelos Recientes
            </CardTitle>
            <CardDescription>
              Últimos modelos actualizados o creados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {model.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`}></div>
                      <span className="text-xs text-muted-foreground">
                        {model.status} • {model.accuracy}% • {model.lastUpdate}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className={getRiskColor(model.risk)}>
                    {model.risk}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Tareas comunes y enlaces útiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors cursor-pointer">
              <Database className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Registrar Modelo</h3>
              <p className="text-sm text-muted-foreground">Agregar un nuevo modelo al sistema</p>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors cursor-pointer">
              <TrendingUp className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Ver Informes</h3>
              <p className="text-sm text-muted-foreground">Analizar rendimiento y métricas</p>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors cursor-pointer">
              <Users className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Gestionar Usuarios</h3>
              <p className="text-sm text-muted-foreground">Administrar roles y permisos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};