import { useQuery } from '@tanstack/react-query';
import { modelService } from '@/services/modelService';
import { Model } from '@/types/model';

// Mock lookup (mismo set base usado en Dashboard para experiencia consistente)
const mockModels: Model[] = [
  {
    id: '1',
    name: 'BAC_VALOR-CLIENTE-CRI-HIP-12M_PRED_XGB_M',
    description: 'Modelo de predicción de valor cliente hipotecario a 12 meses usando XGBoost',
    createdBy: 'admin',
    modifiedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-15T00:00:00Z',
    scoreCodeType: 'python',
    algorithm: 'XGBoost',
    function: 'classification',
    modeler: 'andres.acevedo',
    modelType: 'python',
    trainCodeType: 'python',
    targetLevel: 'ordinal',
    tool: 'Python',
    toolVersion: '3.9',
    externalUrl: 'https://github.com/org/repo/model1',
    modelVersionName: '1.0',
    status: 'production',
    accuracy: 92.5,
    precision: 0.91,
    recall: 0.89,
    f1Score: 0.90,
    rocAuc: 0.95,
    ADL_ACRE: 'Analitica Core',
    ADL_ARES: 'Ingenieria',
    ADL_ARUS: 'BAC',
    DS_CAMD: 'Clasificación',
    DS_PRMD: 'Python',
    riskLevel: 'low',
    needsRecalibration: false,
    lastBacktestDate: '2024-01-10',
    nextReviewDate: '2024-04-10'
  },
];

const findMock = (id: string) => mockModels.find(m => m.id === id);

export const useModel = (id: string) => {
  return useQuery<Model, Error>({
    queryKey: ['model', id],
    queryFn: async () => {
      try {
        // Intento real
        return await modelService.getModel(id);
      } catch (e) {
        const fallback = findMock(id);
        if (fallback) return fallback;
        throw e instanceof Error ? e : new Error('Error obteniendo modelo');
      }
    },
    staleTime: 60_000,
  });
};
