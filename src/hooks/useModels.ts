import { useState, useEffect, useCallback } from 'react';
import { modelService } from '@/services/modelService';
import { Model, CreateModelRequest, UpdateModelRequest } from '@/types/model';
import { useToast } from '@/hooks/use-toast';

export const useModels = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const { toast } = useToast();

  // Fetch models with filters
  const fetchModels = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    algorithm?: string;
    status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await modelService.getModels(params);
      
      setModels(response.models);
      setPagination({
        page: response.page,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch models';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create new model
  const createModel = useCallback(async (modelData: CreateModelRequest): Promise<boolean> => {
    try {
      setLoading(true);
      await modelService.createModel(modelData);
      
      toast({
        title: 'Success',
        description: 'Model created successfully',
      });
      
      // Refresh models list
      await fetchModels();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create model';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchModels, toast]);

  // Update model
  const updateModel = useCallback(async (
    id: string, 
    modelData: UpdateModelRequest
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await modelService.updateModel(id, modelData);
      
      toast({
        title: 'Success',
        description: 'Model updated successfully',
      });
      
      // Refresh models list
      await fetchModels();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update model';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchModels, toast]);

  // Delete model
  const deleteModel = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await modelService.deleteModel(id);
      
      toast({
        title: 'Success',
        description: 'Model deleted successfully',
      });
      
      // Refresh models list
      await fetchModels();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete model';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchModels, toast]);

  // Upload artifact
  const uploadArtifact = useCallback(async (
    modelId: string, 
    file: File, 
    type: 'pkl' | 'graph' | 'other'
  ): Promise<string | null> => {
    try {
      setLoading(true);
      const response = await modelService.uploadArtifact(modelId, file, type);
      
      toast({
        title: 'Success',
        description: 'Artifact uploaded successfully',
      });
      
      return response.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload artifact';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    loading,
    error,
    pagination,
    fetchModels,
    createModel,
    updateModel,
    deleteModel,
    uploadArtifact,
  };
};

// Hook for single model operations
export const useModel = (id?: string) => {
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchModel = useCallback(async (modelId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await modelService.getModel(modelId);
      setModel(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch model';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (id) {
      fetchModel(id);
    }
  }, [id, fetchModel]);

  return {
    model,
    loading,
    error,
    fetchModel,
  };
};