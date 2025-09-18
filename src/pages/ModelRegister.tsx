import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Save, FileText, BarChart3, Code, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Model } from '@/types/model';

export const ModelRegister: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Model>>({
    name: '',
    description: '',
    algorithm: '',
    function: 'classification',
    modelType: 'python',
    tool: '',
    toolVersion: '',
    targetLevel: 'ordinal',
    scoreCodeType: 'python',
    trainCodeType: 'python',
    externalUrl: '',
    modelVersionName: '1.0',
    ADL_ACRE: '',
    ADL_ARES: '',
    ADL_ARUS: '',
    DS_CAMD: '',
    DS_PRMD: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof Model, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Modelo registrado exitosamente');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        algorithm: '',
        function: 'classification',
        modelType: 'python',
        tool: '',
        toolVersion: '',
        targetLevel: 'ordinal',
        scoreCodeType: 'python',
        trainCodeType: 'python',
        externalUrl: '',
        modelVersionName: '1.0',
        ADL_ACRE: '',
        ADL_ARES: '',
        ADL_ARUS: '',
        DS_CAMD: '',
        DS_PRMD: ''
      });
    } catch (error) {
      toast.error('Error al registrar el modelo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Registro de Modelos</h1>
        <p className="text-muted-foreground">
          Registra nuevos modelos de Machine Learning e IA Generativa
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Información Básica
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Detalles Técnicos
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Negocio
            </TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Información Básica del Modelo</CardTitle>
                <CardDescription>
                  Datos generales y descripción del modelo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Modelo *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="BAC_VALOR-CLIENTE-CRI-HIP-12M_PRED_XGB_M"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="version">Versión del Modelo *</Label>
                    <Input
                      id="version"
                      value={formData.modelVersionName || ''}
                      onChange={(e) => handleInputChange('modelVersionName', e.target.value)}
                      placeholder="1.0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe el propósito y funcionamiento del modelo..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modeler">Modelador *</Label>
                    <Input
                      id="modeler"
                      value={formData.modeler || ''}
                      onChange={(e) => handleInputChange('modeler', e.target.value)}
                      placeholder="andres.acevedo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="externalUrl">URL Externa</Label>
                    <Input
                      id="externalUrl"
                      value={formData.externalUrl || ''}
                      onChange={(e) => handleInputChange('externalUrl', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Details */}
          <TabsContent value="technical">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Detalles Técnicos</CardTitle>
                <CardDescription>
                  Configuración técnica y algoritmos utilizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="algorithm">Algoritmo *</Label>
                    <Input
                      id="algorithm"
                      value={formData.algorithm || ''}
                      onChange={(e) => handleInputChange('algorithm', e.target.value)}
                      placeholder="XGBoost, Random Forest, LSTM..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="function">Función del Modelo *</Label>
                    <Select value={formData.function} onValueChange={(value) => handleInputChange('function', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la función" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classification">Clasificación</SelectItem>
                        <SelectItem value="regression">Regresión</SelectItem>
                        <SelectItem value="clustering">Clustering</SelectItem>
                        <SelectItem value="recommendation">Recomendación</SelectItem>
                        <SelectItem value="generation">Generación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelType">Tipo de Modelo *</Label>
                    <Select value={formData.modelType} onValueChange={(value) => handleInputChange('modelType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="r">R</SelectItem>
                        <SelectItem value="scala">Scala</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetLevel">Nivel del Target *</Label>
                    <Select value={formData.targetLevel} onValueChange={(value) => handleInputChange('targetLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nominal">Nominal</SelectItem>
                        <SelectItem value="ordinal">Ordinal</SelectItem>
                        <SelectItem value="interval">Intervalo</SelectItem>
                        <SelectItem value="ratio">Ratio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tool">Herramienta *</Label>
                    <Input
                      id="tool"
                      value={formData.tool || ''}
                      onChange={(e) => handleInputChange('tool', e.target.value)}
                      placeholder="Python 3, R Studio, Spark..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="toolVersion">Versión de Herramienta *</Label>
                    <Input
                      id="toolVersion"
                      value={formData.toolVersion || ''}
                      onChange={(e) => handleInputChange('toolVersion', e.target.value)}
                      placeholder="3.9, 4.2.1..."
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Metrics */}
          <TabsContent value="performance">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
                <CardDescription>
                  Métricas de evaluación y artefactos del modelo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accuracy">Precisión (%)</Label>
                    <Input
                      id="accuracy"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.accuracy || ''}
                      onChange={(e) => handleInputChange('accuracy', parseFloat(e.target.value))}
                      placeholder="85.5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="precision">Precisión</Label>
                    <Input
                      id="precision"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.precision || ''}
                      onChange={(e) => handleInputChange('precision', parseFloat(e.target.value))}
                      placeholder="0.87"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recall">Recall</Label>
                    <Input
                      id="recall"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.recall || ''}
                      onChange={(e) => handleInputChange('recall', parseFloat(e.target.value))}
                      placeholder="0.82"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Artefactos del Modelo</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Subir archivo PKL
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Seleccionar archivo
                        </Button>
                      </div>
                      
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Subir SHAP Values
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Seleccionar archivo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Information */}
          <TabsContent value="business">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Información de Negocio</CardTitle>
                <CardDescription>
                  Clasificación y metadatos de negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ADL_ACRE">ADL ACRE *</Label>
                    <Input
                      id="ADL_ACRE"
                      value={formData.ADL_ACRE || ''}
                      onChange={(e) => handleInputChange('ADL_ACRE', e.target.value)}
                      placeholder="Analitica Core"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ADL_ARES">ADL ARES *</Label>
                    <Input
                      id="ADL_ARES"
                      value={formData.ADL_ARES || ''}
                      onChange={(e) => handleInputChange('ADL_ARES', e.target.value)}
                      placeholder="Ingenieria"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ADL_ARUS">ADL ARUS *</Label>
                    <Input
                      id="ADL_ARUS"
                      value={formData.ADL_ARUS || ''}
                      onChange={(e) => handleInputChange('ADL_ARUS', e.target.value)}
                      placeholder="BAC"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="DS_CAMD">DS CAMD *</Label>
                    <Input
                      id="DS_CAMD"
                      value={formData.DS_CAMD || ''}
                      onChange={(e) => handleInputChange('DS_CAMD', e.target.value)}
                      placeholder="Clasificación"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="DS_PRMD">DS PRMD *</Label>
                  <Input
                    id="DS_PRMD"
                    value={formData.DS_PRMD || ''}
                    onChange={(e) => handleInputChange('DS_PRMD', e.target.value)}
                    placeholder="Python"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Registrar Modelo
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};