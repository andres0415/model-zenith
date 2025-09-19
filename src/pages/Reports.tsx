import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { toast } = useToast();

  // Handler functions
  const handleFilter = () => {
    toast({
      title: "Filtros",
      description: "Función de filtros próximamente disponible",
    });
  };

  const handleDateRange = () => {
    toast({
      title: "Rango de Fechas", 
      description: "Selector de fechas próximamente disponible",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exportando...",
      description: "Generando reporte en formato PDF",
    });
  };

  const handleViewDetails = (modelName: string) => {
    toast({
      title: "Ver Detalles",
      description: `Abriendo detalles del modelo ${modelName}`,
    });
  };

  const handleViewList = () => {
    toast({
      title: "Lista de Modelos Críticos",
      description: "Mostrando modelos que requieren recalibración",
    });
  };

  const handleScheduleReview = () => {
    toast({
      title: "Revisión Programada",
      description: "Revisión de deriva de datos programada para mañana",
    });
  };

  const handleAssignTask = () => {
    toast({
      title: "Tarea Asignada",
      description: "Actualización de documentación asignada al equipo",
    });
  };

  // Leer modelos desde la carpeta public
  const [models, setModels] = useState<any[]>([]);
  const [modelHealth, setModelHealth] = useState({ healthy: 0, warning: 0, critical: 0 });
  const [riskAssessment, setRiskAssessment] = useState<any[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
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
        fetch(`/${file}`)
          .then(res => {
            if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
            return res.json();
          })
          .catch((err) => {
            setLoadError(`Error al cargar modelos: ${err.message}`);
            return null;
          })
      )
    ).then(models => {
      const validModels = models.filter(Boolean);
      setModels(validModels);
      if (validModels.length === 0) {
        setLoadError('No se encontraron modelos válidos en la carpeta public.');
      }
      // Simulación de salud: todos saludables si existen
      setModelHealth({
        healthy: validModels.length,
        warning: 0,
        critical: 0
      });
      // Simulación de riesgo: todos bajo
      setRiskAssessment(validModels.map(m => ({
        model: m.name,
        risk: 'low',
        reason: 'Funcionando correctamente',
        lastReview: m.modifiedTimeStamp
      })));
    });
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {loadError && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 mb-4">
          {loadError}
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Informes y Analytics</h1>
          <p className="text-muted-foreground">
            Análisis detallado del rendimiento y salud de tus modelos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" onClick={handleDateRange}>
            <Calendar className="h-4 w-4 mr-2" />
            Rango de Fechas
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen Ejecutivo</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="risk">Análisis de Riesgo</TabsTrigger>
          <TabsTrigger value="health">Salud de Modelos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Modelos Saludables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">{modelHealth.healthy}</span>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {((modelHealth.healthy / 95) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Requieren Atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-yellow-600">{modelHealth.warning}</span>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Monitoreo cercano necesario
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Estado Crítico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-red-600">{modelHealth.critical}</span>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Acción inmediata requerida
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Insights Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-green-200 bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Mejora en Precisión General</h4>
                    <p className="text-sm text-green-700">
                      Los modelos han mostrado una mejora del 2.3% en precisión promedio este mes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Deriva de Datos Detectada</h4>
                    <p className="text-sm text-yellow-700">
                      3 modelos han mostrado indicios de deriva de datos en las últimas 2 semanas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Aumento en Modelos Productivos</h4>
                    <p className="text-sm text-blue-700">
                      8 nuevos modelos han sido promovidos a producción este mes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Tendencia de Precisión</CardTitle>
                <CardDescription>Evolución de la precisión promedio por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{trend.month}</span>
                        <p className="text-sm text-muted-foreground">{trend.models} modelos</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{trend.accuracy}%</span>
                        <Progress value={trend.accuracy} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Top Modelos por Rendimiento</CardTitle>
                <CardDescription>Modelos con mejor desempeño este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'FRAUD_DETECTION_NN', accuracy: 96.8, change: '+2.1%' },
                    { name: 'CREDIT_SCORE_LGBM', accuracy: 94.5, change: '+1.8%' },
                    { name: 'CHURN_PREDICTION_RF', accuracy: 91.2, change: '-0.5%' }
                  ].map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{model.name}</p>
                        <p className="text-xs text-muted-foreground">#{index + 1} mejor rendimiento</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{model.accuracy}%</span>
                        <p className={`text-xs ${model.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {model.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Tab */}
        <TabsContent value="risk" className="space-y-6">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Evaluación de Riesgo
              </CardTitle>
              <CardDescription>
                Modelos que requieren atención basado en métricas de riesgo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessment.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{item.model}</h4>
                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Última revisión: {item.lastReview}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(item.risk)}>
                        {item.risk.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(item.model)}>
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Distribución de Salud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Saludables</span>
                    </div>
                    <span className="font-semibold">{modelHealth.healthy}</span>
                  </div>
                  <Progress value={(modelHealth.healthy / 95) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Advertencia</span>
                    </div>
                    <span className="font-semibold">{modelHealth.warning}</span>
                  </div>
                  <Progress value={(modelHealth.warning / 95) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Crítico</span>
                    </div>
                    <span className="font-semibold">{modelHealth.critical}</span>
                  </div>
                  <Progress value={(modelHealth.critical / 95) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Acciones Recomendadas</CardTitle>
                <CardDescription>Próximos pasos para mejorar la salud general</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border bg-background/30">
                    <h4 className="font-medium text-sm">Recalibrar Modelos Críticos</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      5 modelos necesitan recalibración inmediata
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleViewList}>
                      Ver Lista
                    </Button>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-border bg-background/30">
                    <h4 className="font-medium text-sm">Revisar Deriva de Datos</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Verificar calidad de datos en 8 modelos
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleScheduleReview}>
                      Programar Revisión
                    </Button>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-border bg-background/30">
                    <h4 className="font-medium text-sm">Actualizar Documentación</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      12 modelos requieren documentación actualizada
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleAssignTask}>
                      Asignar Tarea
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};