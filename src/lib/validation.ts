import { z } from 'zod';
import { 
  ALGORITHM_OPTIONS, 
  FUNCTION_OPTIONS, 
  MODEL_TYPE_OPTIONS, 
  TARGET_LEVEL_OPTIONS,
  ADL_ACRE_OPTIONS,
  ADL_ARES_OPTIONS,
  ADL_ARUS_OPTIONS,
  DS_CAMD_OPTIONS,
  DS_PRMD_OPTIONS 
} from '@/constants/dropdownOptions';

// Helper function to create enum schema from options
const createEnumFromOptions = (options: { value: string; label: string }[]) => {
  const values = options.map(opt => opt.value) as [string, ...string[]];
  return z.enum(values);
};

// Model validation schemas
export const createModelSchema = z.object({
  name: z
    .string()
    .min(3, 'Model name must be at least 3 characters')
    .max(100, 'Model name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9_\-\.]+$/, 'Model name can only contain letters, numbers, underscores, hyphens, and dots'),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  
  algorithm: createEnumFromOptions(ALGORITHM_OPTIONS),
  
  function: createEnumFromOptions(FUNCTION_OPTIONS),
  
  modelType: createEnumFromOptions(MODEL_TYPE_OPTIONS),
  
  scoreCodeType: z
    .string()
    .optional(),
  
  modeler: z
    .string()
    .min(2, 'Modeler name must be at least 2 characters')
    .optional(),
  
  trainCodeType: z
    .string()
    .optional(),
  
  targetLevel: createEnumFromOptions(TARGET_LEVEL_OPTIONS).optional(),
  
  tool: z
    .string()
    .optional(),
  
  toolVersion: z
    .string()
    .optional(),
  
  externalUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  modelVersionName: z
    .string()
    .regex(/^\d+\.\d+(\.\d+)?$/, 'Version must follow semantic versioning (e.g., 1.0, 1.0.1)')
    .optional(),
  
  // Business fields - validate against dropdown options
  ADL_ACRE: createEnumFromOptions(ADL_ACRE_OPTIONS).optional(),
  ADL_ARES: createEnumFromOptions(ADL_ARES_OPTIONS).optional(),
  ADL_ARUS: createEnumFromOptions(ADL_ARUS_OPTIONS).optional(),
  DS_CAMD: createEnumFromOptions(DS_CAMD_OPTIONS).optional(),
  DS_PRMD: createEnumFromOptions(DS_PRMD_OPTIONS).optional(),
});

export const updateModelSchema = createModelSchema.partial().extend({
  status: z.enum(['development', 'testing', 'production', 'deprecated']).optional(),
  
  // Performance metrics validation
  accuracy: z
    .number()
    .min(0, 'Accuracy must be between 0 and 1')
    .max(1, 'Accuracy must be between 0 and 1')
    .optional(),
  
  precision: z
    .number()
    .min(0, 'Precision must be between 0 and 1')
    .max(1, 'Precision must be between 0 and 1')
    .optional(),
  
  recall: z
    .number()
    .min(0, 'Recall must be between 0 and 1')
    .max(1, 'Recall must be between 0 and 1')
    .optional(),
  
  f1Score: z
    .number()
    .min(0, 'F1 Score must be between 0 and 1')
    .max(1, 'F1 Score must be between 0 and 1')
    .optional(),
  
  rocAuc: z
    .number()
    .min(0, 'ROC AUC must be between 0 and 1')
    .max(1, 'ROC AUC must be between 0 and 1')
    .optional(),
  
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  
  needsRecalibration: z.boolean().optional(),
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const registerSchema = loginSchema.extend({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  
  confirmPassword: z
    .string(),
  
  role: z.enum(['admin', 'editor', 'viewer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// MLflow integration validation
export const mlflowImportSchema = z.object({
  experimentId: z
    .string()
    .min(1, 'Experiment ID is required'),
  
  s3Path: z
    .string()
    .regex(/^s3:\/\/[a-z0-9.\-]+\/.*/, 'Please enter a valid S3 path (s3://bucket/path)')
    .optional(),
  
  modelName: z
    .string()
    .min(1, 'Model name is required'),
  
  stage: z
    .enum(['staging', 'production', 'archived'])
    .optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, 'File size must be less than 50MB')
    .refine(
      (file) => ['application/octet-stream', 'image/png', 'image/jpeg', 'application/json'].includes(file.type),
      'File type must be PKL, PNG, JPEG, or JSON'
    ),
  
  type: z.enum(['pkl', 'graph', 'other']),
});

// Export types for use in components
export type CreateModelFormData = z.infer<typeof createModelSchema>;
export type UpdateModelFormData = z.infer<typeof updateModelSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type MLflowImportFormData = z.infer<typeof mlflowImportSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;