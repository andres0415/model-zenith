import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModel } from '@/hooks/useModel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, Code, BarChart3, Settings } from 'lucide-react';

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-sm text-foreground break-all">{value ?? <span className="text-muted-foreground">—</span>}</p>
  </div>
);

export const ModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const modelId = id || '';
  const { data: model, isLoading, error } = useModel(modelId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="px-2">
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Detalle del Modelo</h1>
          <p className="text-muted-foreground">Visualización completa de metadatos y métricas</p>
        </div>
      </div>

      {isLoading && (
        <Card className="bg-gradient-card shadow-soft p-8 text-center">Cargando modelo...</Card>
      )}
      {error && !isLoading && (
        <Card className="bg-gradient-card shadow-soft p-8 text-center text-red-600">Error: {error.message}</Card>
      )}
      {!isLoading && !model && !error && (
        <Card className="bg-gradient-card shadow-soft p-8 text-center">Modelo no encontrado</Card>
      )}
      {model && (
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Básico</TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2"><Code className="h-4 w-4" /> Técnico</TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Métricas</TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Negocio</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Datos generales del modelo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Versión {model.modelVersionName}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{model.status}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">Riesgo {model.riskLevel}</Badge>
                  {model.needsRecalibration && <Badge variant="destructive" className="text-xs">Recalibración</Badge>}
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Nombre" value={model.name} />
                  <Field label="Modeler" value={model.modeler} />
                  <Field label="Creado" value={new Date(model.createdAt).toLocaleString()} />
                  <Field label="Modificado" value={new Date(model.modifiedAt).toLocaleString()} />
                  <div className="md:col-span-2">
                    <Field label="Descripción" value={model.description} />
                  </div>
                  <Field label="URL Externa" value={model.externalUrl ? <a className="text-primary underline" href={model.externalUrl} target="_blank" rel="noreferrer">{model.externalUrl}</a> : '—'} />
                  <Field label="Próxima Revisión" value={model.nextReviewDate} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Detalles Técnicos</CardTitle>
                <CardDescription>Algoritmos y configuración</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Algoritmo" value={model.algorithm} />
                <Field label="Función" value={model.function} />
                <Field label="Tipo" value={model.modelType} />
                <Field label="Target Level" value={model.targetLevel} />
                <Field label="Score Code" value={model.scoreCodeType} />
                <Field label="Train Code" value={model.trainCodeType} />
                <Field label="Herramienta" value={model.tool} />
                <Field label="Versión Herramienta" value={model.toolVersion} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
                <CardDescription>Valores reportados del último ciclo</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Accuracy" value={model.accuracy?.toString()} />
                <Field label="Precision" value={model.precision?.toString()} />
                <Field label="Recall" value={model.recall?.toString()} />
                <Field label="F1 Score" value={model.f1Score?.toString()} />
                <Field label="ROC AUC" value={model.rocAuc?.toString()} />
                <Field label="Requiere Recalibración" value={model.needsRecalibration ? 'Sí' : 'No'} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Información de Negocio</CardTitle>
                <CardDescription>Clasificaciones y metadatos corporativos</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="ADL ACRE" value={model.ADL_ACRE} />
                <Field label="ADL ARES" value={model.ADL_ARES} />
                <Field label="ADL ARUS" value={model.ADL_ARUS} />
                <Field label="DS CAMD" value={model.DS_CAMD} />
                <Field label="DS PRMD" value={model.DS_PRMD} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ModelDetail;
