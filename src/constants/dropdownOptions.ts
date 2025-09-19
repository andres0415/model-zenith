// Configuration for dropdown options - Easy to modify for customization

export const ALGORITHM_OPTIONS = [
  { value: 'xgboost', label: 'XGBoost' },
  { value: 'random_forest', label: 'Random Forest' },
  { value: 'svm', label: 'Support Vector Machine' },
  { value: 'neural_network', label: 'Neural Network' },
  { value: 'linear_regression', label: 'Linear Regression' },
  { value: 'logistic_regression', label: 'Logistic Regression' },
  { value: 'kmeans', label: 'K-Means' },
  { value: 'dbscan', label: 'DBSCAN' },
  { value: 'transformer', label: 'Transformer' },
  { value: 'lstm', label: 'LSTM' },
  { value: 'gpt', label: 'GPT' },
  { value: 'bert', label: 'BERT' },
  { value: 'other', label: 'Other' },
];

export const FUNCTION_OPTIONS = [
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Regression' },
  { value: 'clustering', label: 'Clustering' },
  { value: 'recommendation', label: 'Recommendation' },
  { value: 'generation', label: 'Generation' },
];

export const MODEL_TYPE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'scala', label: 'Scala' },
  { value: 'java', label: 'Java' },
  { value: 'other', label: 'Other' },
];

export const TARGET_LEVEL_OPTIONS = [
  { value: 'nominal', label: 'Nominal' },
  { value: 'ordinal', label: 'Ordinal' },
  { value: 'interval', label: 'Interval' },
  { value: 'ratio', label: 'Ratio' },
];

export const STATUS_OPTIONS = [
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'production', label: 'Production' },
  { value: 'deprecated', label: 'Deprecated' },
];

export const RISK_LEVEL_OPTIONS = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' },
];

// Business/Organization specific dropdowns - EDIT THESE FOR YOUR ORGANIZATION
export const ADL_ACRE_OPTIONS = [
  { value: 'analitica_core', label: 'Analítica Core' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'machine_learning', label: 'Machine Learning' },
  { value: 'ai_research', label: 'AI Research' },
];

export const ADL_ARES_OPTIONS = [
  { value: 'ingenieria', label: 'Ingeniería' },
  { value: 'investigacion', label: 'Investigación' },
  { value: 'desarrollo', label: 'Desarrollo' },
  { value: 'produccion', label: 'Producción' },
];

export const ADL_ARUS_OPTIONS = [
  { value: 'bac', label: 'BAC' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'retail', label: 'Retail' },
  { value: 'investment', label: 'Investment Banking' },
];

export const DS_CAMD_OPTIONS = [
  { value: 'clasificacion', label: 'Clasificación' },
  { value: 'regresion', label: 'Regresión' },
  { value: 'clustering', label: 'Clustering' },
  { value: 'recomendacion', label: 'Recomendación' },
  { value: 'generacion', label: 'Generación' },
];

export const DS_PRMD_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'scala', label: 'Scala' },
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
];

export const TOOL_OPTIONS = [
  { value: 'python_39', label: 'Python 3.9' },
  { value: 'python_310', label: 'Python 3.10' },
  { value: 'python_311', label: 'Python 3.11' },
  { value: 'r_411', label: 'R 4.1.1' },
  { value: 'r_420', label: 'R 4.2.0' },
  { value: 'jupyter', label: 'Jupyter Notebook' },
  { value: 'rstudio', label: 'RStudio' },
  { value: 'databricks', label: 'Databricks' },
  { value: 'sagemaker', label: 'AWS SageMaker' },
  { value: 'mlflow', label: 'MLflow' },
  { value: 'kubeflow', label: 'Kubeflow' },
];

// Helper function to get option label by value
export const getOptionLabel = (options: { value: string; label: string }[], value: string): string => {
  const option = options.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Helper function to validate if value exists in options
export const isValidOption = (options: { value: string; label: string }[], value: string): boolean => {
  return options.some(opt => opt.value === value);
};