import { apiClient } from './api';
import { Model, CreateModelRequest, UpdateModelRequest } from '@/types/model';

// Service for Model CRUD operations - Ready for AWS Lambda integration
export class ModelService {
  private readonly endpoint = '/models';

  // Get all models with pagination and filters
  async getModels(params?: {
    page?: number;
    limit?: number;
    search?: string;
    algorithm?: string;
    status?: string;
  }): Promise<{ models: Model[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const query = queryParams.toString();
    const url = query ? `${this.endpoint}?${query}` : this.endpoint;
    
    return apiClient.get(url);
  }

  // Get single model by ID
  async getModel(id: string): Promise<Model> {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  // Create new model
  async createModel(model: CreateModelRequest): Promise<Model> {
    return apiClient.post(this.endpoint, model);
  }

  // Update existing model
  async updateModel(id: string, model: UpdateModelRequest): Promise<Model> {
    return apiClient.put(`${this.endpoint}/${id}`, model);
  }

  // Delete model
  async deleteModel(id: string): Promise<void> {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  // Upload model artifact to S3
  async uploadArtifact(modelId: string, file: File, type: 'pkl' | 'graph' | 'other'): Promise<{ url: string }> {
    return apiClient.uploadFile(`${this.endpoint}/${modelId}/artifacts/${type}`, file);
  }

  // Get model metrics and performance data
  async getModelMetrics(id: string, timeRange?: string): Promise<any> {
    const query = timeRange ? `?timeRange=${timeRange}` : '';
    return apiClient.get(`${this.endpoint}/${id}/metrics${query}`);
  }

  // Trigger model retraining
  async retrain(id: string): Promise<{ jobId: string }> {
    return apiClient.post(`${this.endpoint}/${id}/retrain`);
  }

  // Get model predictions/inference
  async predict(id: string, data: any): Promise<any> {
    return apiClient.post(`${this.endpoint}/${id}/predict`, data);
  }

  // Get model comparison data
  async compareModels(modelIds: string[]): Promise<any> {
    return apiClient.post(`${this.endpoint}/compare`, { modelIds });
  }
}

export const modelService = new ModelService();