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

// API Request/Response types
export interface CreateModelRequest {
  name: string;
  description: string;
  algorithm: string;
  function: 'classification' | 'regression' | 'clustering' | 'recommendation' | 'generation';
  modelType: 'python' | 'r' | 'scala' | 'java' | 'other';
  scoreCodeType?: string;
  modeler?: string;
  trainCodeType?: string;
  targetLevel?: 'nominal' | 'ordinal' | 'interval' | 'ratio';
  tool?: string;
  toolVersion?: string;
  externalUrl?: string;
  modelVersionName?: string;
  ADL_ACRE?: string;
  ADL_ARES?: string;
  ADL_ARUS?: string;
  DS_CAMD?: string;
  DS_PRMD?: string;
}

export interface UpdateModelRequest extends Partial<CreateModelRequest> {
  status?: 'development' | 'testing' | 'production' | 'deprecated';
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rocAuc?: number;
  mse?: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  needsRecalibration?: boolean;
  lastBacktestDate?: string;
  nextReviewDate?: string;
}

// Authentication API types
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// MLflow integration types
export interface MLflowExperiment {
  experiment_id: string;
  name: string;
  artifact_location: string;
  lifecycle_stage: string;
  creation_time: number;
  last_update_time: number;
}

export interface MLflowRun {
  info: {
    run_id: string;
    experiment_id: string;
    status: string;
    start_time: number;
    end_time: number;
    artifact_uri: string;
  };
  data: {
    metrics: Record<string, number>;
    params: Record<string, string>;
    tags: Record<string, string>;
  };
}