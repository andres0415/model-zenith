import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Clock,
  RefreshCw,
  Search,
  Filter,
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const Monitoring: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const monitoringData = [
    {
      id: '1',
      name: 'CREDIT_SCORE_LGBM_PROD',
      status: 'critical',
      accuracy: 78.5,
      lastCheck: '2024-01-15T10:30:00Z',
      nextReview: '2024-01-20',
      drift: 'high',
      predictions: 1247,
      errors: 23,
      latency: 145,
      needsRecalibration: true
    },
    {
      id: '2',
      name: 'CHURN_PREDICTION_RF_V2',
      status: 'warning',
      accuracy: 84.2,
      lastCheck: '2024-01-15T09:45:00Z',
      nextReview: '2024-01-18',
      drift: 'medium',
      predictions: 892,
      errors: 5,
      latency: 98,
      needsRecalibration: false
    },
    {
      id: '3',
      name: 'FRAUD_DETECTION_NN_LIVE',
      status: 'healthy',
      accuracy: 96.1,
      lastCheck: '2024-01-15T11:00:00Z',
      nextReview: '2024-01-25',
      drift: 'low',
      predictions: 2341,
      errors: 1,
      latency: 67,
      needsRecalibration: false
    },
    {
      id: '4',
      name: 'RECOMMENDATION_ENGINE_V3',
      status: 'healthy',
      accuracy: 91.8,
      lastCheck: '2024-01-15T10:15:00Z',
      nextReview: '2024-01-22',
      drift: 'low',
      predictions: 5678,
      errors: 12,
      latency: 234,
      needsRecalibration: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDriftColor = (drift: string) => {
    switch (drift) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredData = monitoringData.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seguimiento de Modelos</h1>
          <p className="text-muted-foreground">
            Monitoreo en tiempo real del rendimiento y salud de tus modelos en producción
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Modelos Monitoreados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {monitoringData.length}
            </div>
            <p className="text-xs text-muted-foreground">
              En producción activa
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado Saludable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {monitoringData.filter(m => m.status === 'healthy').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Funcionando correctamente
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Requieren Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {monitoringData.filter(m => m.status === 'warning').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Monitoreo cercano
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {monitoringData.filter(m => m.status === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Acción inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar modelos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="healthy">Saludable</SelectItem>
                <SelectItem value="warning">Advertencia</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Models List */}
      <div className="space-y-4">
        {filteredData.map((model) => (
          <Card key={model.id} className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(model.status)}
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>
                      Última verificación: {new Date(model.lastCheck).toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(model.status)}>
                    {model.status.toUpperCase()}
                  </Badge>
                  {model.needsRecalibration && (
                    <Badge variant="destructive">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Recalibrar
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                  <TabsTrigger value="performance">Rendimiento</TabsTrigger>
                  <TabsTrigger value="alerts">Alertas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-lg font-bold text-foreground">
                        {model.accuracy}%
                      </div>
                      <div className="text-xs text-muted-foreground">Precisión</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-lg font-bold text-foreground">
                        {model.predictions.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Predicciones</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-lg font-bold text-foreground">
                        {model.errors}
                      </div>
                      <div className="text-xs text-muted-foreground">Errores</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-lg font-bold text-foreground">
                        {model.latency}ms
                      </div>
                      <div className="text-xs text-muted-foreground">Latencia</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="performance" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Deriva de Datos</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${getDriftColor(model.drift)}`}>
                          {model.drift.toUpperCase()}
                        </span>
                        {model.drift === 'high' ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : model.drift === 'medium' ? (
                          <Activity className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Próxima Revisión</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{model.nextReview}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="alerts" className="mt-4">
                  <div className="space-y-3">
                    {model.status === 'critical' && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-red-800">
                            Precisión por debajo del umbral
                          </h4>
                          <p className="text-xs text-red-700">
                            La precisión ha caído por debajo del 80% requerido
                          </p>
                        </div>
                      </div>
                    )}
                    {model.needsRecalibration && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                        <RefreshCw className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-800">
                            Recalibración recomendada
                          </h4>
                          <p className="text-xs text-yellow-700">
                            El modelo podría beneficiarse de una recalibración
                          </p>
                        </div>
                      </div>
                    )}
                    {model.status === 'healthy' && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-green-800">
                            Modelo funcionando correctamente
                          </h4>
                          <p className="text-xs text-green-700">
                            Todas las métricas están dentro de los rangos esperados
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configurar Alertas
                </Button>
                {model.needsRecalibration && (
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recalibrar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron modelos
            </h3>
            <p className="text-muted-foreground">
              Ajusta los filtros de búsqueda para ver más resultados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};