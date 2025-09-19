// Environment configuration for AWS deployment
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },

  // AWS Configuration
  aws: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    s3Bucket: import.meta.env.VITE_S3_BUCKET || 'modelgov-artifacts',
    cognitoUserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
    cognitoClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
  },

  // MLflow Configuration
  mlflow: {
    trackingUri: import.meta.env.VITE_MLFLOW_TRACKING_URI || 'http://localhost:5000',
    s3ExperimentsPath: import.meta.env.VITE_MLFLOW_S3_PATH || 's3://modelgov-experiments/',
  },

  // Database Configuration
  database: {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    port: import.meta.env.VITE_DB_PORT || '5432',
    name: import.meta.env.VITE_DB_NAME || 'modelgov',
  },

  // Features flags
  features: {
    enableMLflowIntegration: import.meta.env.VITE_ENABLE_MLFLOW === 'true',
    enableS3Upload: import.meta.env.VITE_ENABLE_S3_UPLOAD === 'true',
    enableRealTimeMonitoring: import.meta.env.VITE_ENABLE_REALTIME_MONITORING === 'true',
  },

  // Security
  security: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'dev-secret',
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  },
};

// Validation
export const validateConfig = () => {
  const requiredEnvVars = [
    'VITE_API_BASE_URL',
    'VITE_AWS_REGION',
    'VITE_S3_BUCKET',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0 && import.meta.env.PROD) {
    console.warn('Missing required environment variables:', missingVars);
  }
};