import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
  const [openDialog, setOpenDialog] = useState<'total' | 'production' | 'review' | 'risk' | null>(null);

  // Leer modelos desde la carpeta public
  const [allModels, setAllModels] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalModels: 0,
    modelsInProduction: 0,
    modelsNeedingReview: 0,
    highRiskModels: 0,
    averageAccuracy: 0,
    modelsCreatedThisMonth: 0
  });

  useEffect(() => {
    // Listado de archivos JSON en public
    const modelFiles = [
      'ModelProperties_bac_clvt (1).json',
      'ModelProperties_bac_clvt_2.json',
      'ModelProperties_bac_clvt_3.json',
      'ModelProperties_bac_clvt_4.json',
      'ModelProperties_bac_clvt_5.json',
      'ModelProperties_bac_clvt_6.json'
    ];

    Promise.all(
      modelFiles.map(file =>
        fetch(`/public/${file}`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(models => {
      const validModels = models.filter(Boolean);
      setAllModels(validModels);

      // Calcular métricas
      const totalModels = validModels.length;
      const modelsInProduction = validModels.filter(m => m.status === 'production').length;
      const modelsNeedingReview = validModels.filter(m => m.status === 'review').length;
      const highRiskModels = validModels.filter(m => m.risk === 'high').length;
      const averageAccuracy = 0; // No hay campo accuracy en los JSON actuales
      const modelsCreatedThisMonth = validModels.filter(m => {
        const created = new Date(m.creationTimeStamp);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length;
      setMetrics({
        totalModels,
        modelsInProduction,
        modelsNeedingReview,
        highRiskModels,
        averageAccuracy,
        modelsCreatedThisMonth
      });
    });
  }, []);

  const recentModels = allModels.slice(0, 3);
  const productionModels = allModels.filter(model => model.status === 'production');
  const reviewModels = allModels.filter(model => model.status === 'review');
  const riskModels = allModels.filter(model => model.risk === 'high');

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

  const getDialogTitle = (type: string) => {
    switch (type) {
      case 'total': return 'Todos los Modelos';
      case 'production': return 'Modelos en Producción';
      case 'review': return 'Modelos que Requieren Revisión';
      case 'risk': return 'Modelos de Alto Riesgo';
      default: return 'Modelos';
    }
  };

  const getModelsList = (type: string) => {
    switch (type) {
      case 'total': return allModels;
      case 'production': return productionModels;
      case 'review': return reviewModels;
      case 'risk': return riskModels;
      default: return [];
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
        <Card 
          className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow"
        >
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
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setOpenDialog('total')}>Ver modelos</Button>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow"
        >
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
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setOpenDialog('production')}>Ver modelos</Button>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow"
        >
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
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setOpenDialog('review')}>Ver modelos</Button>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow"
        >
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
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setOpenDialog('risk')}>Ver modelos</Button>
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
                <div key={model.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{model.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`}></div>
                      <span className="text-xs text-muted-foreground">
                        {model.status} • {model.accuracy}% • {model.lastUpdate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={getRiskColor(model.risk)}>
                      {model.risk}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/models/${model.id}`}>Ver</Link>
                    </Button>
                  </div>
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

      {/* Models Dialog */}
      <Dialog open={!!openDialog} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{openDialog && getDialogTitle(openDialog)}</DialogTitle>
            <DialogDescription>
              Lista detallada de modelos en esta categoría
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {openDialog && getModelsList(openDialog).map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{model.name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`}></div>
                      <span>{model.status}</span>
                    </div>
                    <span>Precisión: {model.accuracy}%</span>
                    <span>Actualizado: {model.lastUpdate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="secondary" className={getRiskColor(model.risk)}>
                    {model.risk}
                  </Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/models/${model.id}`}>Ver Detalles</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};