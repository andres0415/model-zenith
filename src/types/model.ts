export interface Model {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  modifiedAt: string;
  scoreCodeType: string;
  algorithm: string;
  function: 'classification' | 'regression' | 'clustering' | 'recommendation' | 'generation';
  modeler: string;
  modelType: 'python' | 'r' | 'scala' | 'java' | 'other';
  trainCodeType: string;
  targetLevel: 'nominal' | 'ordinal' | 'interval' | 'ratio';
  tool: string;
  toolVersion: string;
  externalUrl?: string;
  modelVersionName: string;
  status: 'development' | 'testing' | 'production' | 'deprecated';
  
  // Performance metrics
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rocAuc?: number;
  mse?: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;
  
  // Artifacts
  pklPath?: string;
  shapValuesPath?: string;
  metricsPlotPath?: string;
  confusionMatrixPath?: string;
  
  // Business fields
  ADL_ACRE: string;
  ADL_ARES: string;
  ADL_ARUS: string;
  DS_CAMD: string;
  DS_PRMD: string;
  
  // Risk assessment
  riskLevel: 'low' | 'medium' | 'high';
  needsRecalibration: boolean;
  lastBacktestDate?: string;
  nextReviewDate?: string;
}

export interface Experiment {
  id: string;
  name: string;
  modelId?: string;
  runId: string;
  status: 'running' | 'completed' | 'failed';
  metrics: Record<string, number>;
  parameters: Record<string, any>;
  artifacts: string[];
  startTime: string;
  endTime?: string;
  duration?: number;
  createdBy: string;
  tags: string[];
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  fullName: string;
  createdAt: string;
  lastLogin: string;
}

export interface ModelMetrics {
  totalModels: number;
  modelsInProduction: number;
  modelsNeedingReview: number;
  highRiskModels: number;
  averageAccuracy: number;
  modelsCreatedThisMonth: number;
}