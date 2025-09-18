import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Beaker, 
  Play, 
  Pause, 
  Square, 
  Download,
  Upload,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Folder
} from 'lucide-react';

export const Experiments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const experiments = [
    {
      id: 'exp_001',
      name: 'XGBoost_Hyperparameter_Tuning',
      status: 'completed',
      runId: 'run_12345',
      startTime: '2024-01-15T08:00:00Z',
      endTime: '2024-01-15T10:30:00Z',
      duration: '2h 30m',
      createdBy: 'andres.acevedo',
      metrics: {
        accuracy: 0.924,
        precision: 0.891,
        recall: 0.876,
        f1_score: 0.883
      },
      parameters: {
        learning_rate: 0.1,
        max_depth: 6,
        n_estimators: 100,
        subsample: 0.8
      },
      artifacts: ['model.pkl', 'feature_importance.png', 'confusion_matrix.png'],
      tags: ['classification', 'credit-scoring', 'production-candidate'],
      notes: 'Mejor resultado hasta ahora. Listo para testing en producción.'
    },
    {
      id: 'exp_002',
      name: 'Neural_Network_Architecture_Test',
      status: 'running',
      runId: 'run_12346',
      startTime: '2024-01-15T09:15:00Z',
      endTime: null,
      duration: '2h 15m',
      createdBy: 'katherin.quinones',
      metrics: {
        accuracy: 0.878,
        precision: 0.845,
        recall: 0.892,
        f1_score: 0.868
      },
      parameters: {
        hidden_layers: 3,
        neurons_per_layer: 128,
        dropout: 0.3,
        learning_rate: 0.001
      },
      artifacts: ['training_log.txt', 'loss_curve.png'],
      tags: ['deep-learning', 'fraud-detection', 'experimental'],
      notes: 'Probando nueva arquitectura con mejores resultados en validación.'
    },
    {
      id: 'exp_003',
      name: 'Random_Forest_Feature_Selection',
      status: 'failed',
      runId: 'run_12347',
      startTime: '2024-01-14T14:00:00Z',
      endTime: '2024-01-14T14:45:00Z',
      duration: '45m',
      createdBy: 'maria.rodriguez',
      metrics: {},
      parameters: {
        n_estimators: 200,
        max_features: 'sqrt',
        min_samples_split: 2,
        min_samples_leaf: 1
      },
      artifacts: ['error_log.txt'],
      tags: ['feature-selection', 'churn-prediction'],
      notes: 'Error en el preprocessing de datos. Revisar pipeline de datos.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <Play className="h-4 w-4 text-blue-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Experimentos MLflow</h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de experimentos de Machine Learning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Folder className="h-4 w-4 mr-2" />
            Cargar desde S3
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Beaker className="h-4 w-4 mr-2" />
            Nuevo Experimento
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Experimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {experiments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {experiments.filter(e => e.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Finalizados exitosamente
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Ejecución
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {experiments.filter(e => e.status === 'running').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Actualmente corriendo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fallidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {experiments.filter(e => e.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión
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
                  placeholder="Buscar experimentos..."
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
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="running">En Ejecución</SelectItem>
                <SelectItem value="failed">Fallidos</SelectItem>
                <SelectItem value="paused">Pausados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Experiments List */}
      <div className="space-y-4">
        {filteredExperiments.map((experiment) => (
          <Card key={experiment.id} className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(experiment.status)}
                  <div>
                    <CardTitle className="text-lg">{experiment.name}</CardTitle>
                    <CardDescription>
                      Run ID: {experiment.runId} • Por: {experiment.createdBy}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(experiment.status)}>
                    {experiment.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {experiment.duration}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                  <TabsTrigger value="parameters">Parámetros</TabsTrigger>
                  <TabsTrigger value="artifacts">Artefactos</TabsTrigger>
                  <TabsTrigger value="notes">Notas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics" className="mt-4">
                  {Object.keys(experiment.metrics).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(experiment.metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-3 rounded-lg bg-muted/30">
                          <div className="text-lg font-bold text-foreground">
                            {(value as number).toFixed(3)}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {key.replace('_', ' ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay métricas disponibles</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="parameters" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(experiment.parameters).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 rounded-lg bg-muted/30">
                        <span className="font-medium text-foreground capitalize">
                          {key.replace('_', ' ')}:
                        </span>
                        <span className="text-muted-foreground font-mono">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="artifacts" className="mt-4">
                  {experiment.artifacts.length > 0 ? (
                    <div className="space-y-2">
                      {experiment.artifacts.map((artifact, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{artifact}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay artefactos disponibles</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="notes" className="mt-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-foreground">
                      {experiment.notes || 'No hay notas disponibles para este experimento.'}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                {experiment.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                {experiment.status === 'running' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Square className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
                {experiment.status === 'completed' && (
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                    Promover a Producción
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExperiments.length === 0 && (
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="text-center py-12">
            <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron experimentos
            </h3>
            <p className="text-muted-foreground">
              Ajusta los filtros de búsqueda para ver más resultados
            </p>
          </CardContent>
        </Card>
      )}

      {/* MLflow Integration Card */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Integración MLflow
          </CardTitle>
          <CardDescription>
            Conecta tus experimentos existentes desde MLflow o S3
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-background/50">
              <h4 className="font-semibold text-foreground mb-2">Cargar desde Carpeta Local</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Importa experimentos desde una carpeta local con estructura MLflow
              </p>
              <Button variant="outline" className="w-full">
                <Folder className="h-4 w-4 mr-2" />
                Seleccionar Carpeta
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-background/50">
              <h4 className="font-semibold text-foreground mb-2">Conectar S3</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Conecta con tu bucket de S3 donde tienes tus experimentos MLflow
              </p>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Configurar S3
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};