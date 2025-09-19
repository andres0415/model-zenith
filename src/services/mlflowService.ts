import { apiClient } from './api';
import { config } from '@/config/environment';

// MLflow integration service - Ready for AWS integration
export class MLflowService {
  private readonly endpoint = '/mlflow';

  // Get experiments from MLflow tracking server
  async getExperiments(): Promise<any[]> {
    return apiClient.get(`${this.endpoint}/experiments`);
  }

  // Get runs for a specific experiment
  async getRuns(experimentId: string, params?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const query = queryParams.toString();
    const url = query ? `${this.endpoint}/experiments/${experimentId}/runs?${query}` : 
                       `${this.endpoint}/experiments/${experimentId}/runs`;
    
    return apiClient.get(url);
  }

  // Get specific run details
  async getRun(runId: string): Promise<any> {
    return apiClient.get(`${this.endpoint}/runs/${runId}`);
  }

  // Import MLflow experiment to ModelGov
  async importExperiment(experimentId: string, s3Path?: string): Promise<{ modelId: string }> {
    return apiClient.post(`${this.endpoint}/import`, {
      experimentId,
      s3Path,
    });
  }

  // Sync with S3 MLflow artifacts
  async syncS3Artifacts(s3Path: string): Promise<any> {
    return apiClient.post(`${this.endpoint}/sync-s3`, {
      s3Path,
      trackingUri: config.mlflow.trackingUri,
    });
  }

  // Get model artifacts from MLflow/S3
  async getArtifacts(runId: string, path?: string): Promise<any[]> {
    const query = path ? `?path=${encodeURIComponent(path)}` : '';
    return apiClient.get(`${this.endpoint}/runs/${runId}/artifacts${query}`);
  }

  // Download artifact from S3
  async downloadArtifact(runId: string, artifactPath: string): Promise<Blob> {
    const response = await fetch(
      `${config.api.baseUrl}${this.endpoint}/runs/${runId}/artifacts/download?path=${encodeURIComponent(artifactPath)}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      }
    );
    return response.blob();
  }

  // Register MLflow model to ModelGov registry
  async registerModel(runId: string, modelName: string, stage?: string): Promise<any> {
    return apiClient.post(`${this.endpoint}/register`, {
      runId,
      modelName,
      stage,
    });
  }
}

export const mlflowService = new MLflowService();