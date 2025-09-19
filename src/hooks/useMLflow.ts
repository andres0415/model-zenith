import { useState, useEffect, useCallback } from 'react';
import { mlflowService } from '@/services/mlflowService';
import { useToast } from '@/hooks/use-toast';

export const useMLflow = () => {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch experiments
  const fetchExperiments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mlflowService.getExperiments();
      setExperiments(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch experiments';
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

  // Import experiment to ModelGov
  const importExperiment = useCallback(async (
    experimentId: string, 
    s3Path?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await mlflowService.importExperiment(experimentId, s3Path);
      
      toast({
        title: 'Success',
        description: `Experiment imported as model: ${response.modelId}`,
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import experiment';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Sync S3 artifacts
  const syncS3Artifacts = useCallback(async (s3Path: string): Promise<boolean> => {
    try {
      setLoading(true);
      await mlflowService.syncS3Artifacts(s3Path);
      
      toast({
        title: 'Success',
        description: 'S3 artifacts synced successfully',
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync S3 artifacts';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

  return {
    experiments,
    loading,
    error,
    fetchExperiments,
    importExperiment,
    syncS3Artifacts,
  };
};

// Hook for experiment runs
export const useExperimentRuns = (experimentId?: string) => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRuns = useCallback(async (
    expId: string,
    params?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mlflowService.getRuns(expId, params);
      setRuns(response.runs || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch runs';
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
    if (experimentId) {
      fetchRuns(experimentId);
    }
  }, [experimentId, fetchRuns]);

  return {
    runs,
    loading,
    error,
    fetchRuns,
  };
};