-- ModelGov Database Schema for PostgreSQL
-- This schema supports the complete model governance platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (if not using Cognito user management)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    cognito_user_id VARCHAR(255) UNIQUE -- Link to AWS Cognito user
);

-- =====================================================
-- MODELS TABLE - Core model registry
-- =====================================================
CREATE TABLE IF NOT EXISTS models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    modified_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Technical Details
    score_code_type VARCHAR(50),
    algorithm VARCHAR(100) NOT NULL,
    function VARCHAR(50) NOT NULL CHECK (function IN ('classification', 'regression', 'clustering', 'recommendation', 'generation')),
    modeler VARCHAR(255),
    model_type VARCHAR(50) NOT NULL CHECK (model_type IN ('python', 'r', 'scala', 'java', 'other')),
    train_code_type VARCHAR(50),
    target_level VARCHAR(50) CHECK (target_level IN ('nominal', 'ordinal', 'interval', 'ratio')),
    tool VARCHAR(100),
    tool_version VARCHAR(50),
    external_url TEXT,
    model_version_name VARCHAR(50),
    
    -- Status and Lifecycle
    status VARCHAR(50) DEFAULT 'development' CHECK (status IN ('development', 'testing', 'production', 'deprecated')),
    
    -- Performance Metrics
    accuracy DECIMAL(5,4) CHECK (accuracy >= 0 AND accuracy <= 1),
    precision_score DECIMAL(5,4) CHECK (precision_score >= 0 AND precision_score <= 1),
    recall_score DECIMAL(5,4) CHECK (recall_score >= 0 AND recall_score <= 1),
    f1_score DECIMAL(5,4) CHECK (f1_score >= 0 AND f1_score <= 1),
    roc_auc DECIMAL(5,4) CHECK (roc_auc >= 0 AND roc_auc <= 1),
    mse DECIMAL(10,6),
    rmse DECIMAL(10,6),
    mae DECIMAL(10,6),
    r2_score DECIMAL(5,4),
    
    -- Artifact Paths (S3 locations)
    pkl_path TEXT,
    shap_values_path TEXT,
    metrics_plot_path TEXT,
    confusion_matrix_path TEXT,
    
    -- Business/Organization Fields (Customize these for your org)
    adl_acre VARCHAR(100), -- Analítica Core
    adl_ares VARCHAR(100), -- Ingeniería
    adl_arus VARCHAR(100), -- BAC
    ds_camd VARCHAR(100),  -- Clasificación/Metodología
    ds_prmd VARCHAR(100),  -- Python/Herramienta
    
    -- Risk and Governance
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
    needs_recalibration BOOLEAN DEFAULT FALSE,
    last_backtest_date TIMESTAMP WITH TIME ZONE,
    next_review_date TIMESTAMP WITH TIME ZONE,
    
    -- Indexing for performance
    UNIQUE(name, model_version_name)
);

-- =====================================================
-- MODEL VERSIONS TABLE - Track model versions
-- =====================================================
CREATE TABLE IF NOT EXISTS model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    version_number VARCHAR(50) NOT NULL,
    version_notes TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    
    -- Performance metrics for this version
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    
    -- Artifact paths for this version
    pkl_path TEXT,
    config_path TEXT,
    
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(model_id, version_number)
);

-- =====================================================
-- EXPERIMENTS TABLE - MLflow integration
-- =====================================================
CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model_id UUID REFERENCES models(id) ON DELETE SET NULL,
    
    -- MLflow Integration
    mlflow_experiment_id VARCHAR(255),
    mlflow_run_id VARCHAR(255) UNIQUE,
    
    -- Experiment Details
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Metadata
    created_by VARCHAR(255) NOT NULL,
    tags JSONB DEFAULT '{}',
    notes TEXT,
    
    -- S3 paths for MLflow artifacts
    artifact_s3_path TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EXPERIMENT METRICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS experiment_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,6) NOT NULL,
    step INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(experiment_id, metric_name, step)
);

-- =====================================================
-- EXPERIMENT PARAMETERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS experiment_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    param_name VARCHAR(100) NOT NULL,
    param_value TEXT NOT NULL,
    
    UNIQUE(experiment_id, param_name)
);

-- =====================================================
-- MODEL MONITORING TABLE - Track model performance over time
-- =====================================================
CREATE TABLE IF NOT EXISTS model_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    
    -- Performance metrics at this point in time
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    
    -- Data drift metrics
    feature_drift_score DECIMAL(5,4),
    target_drift_score DECIMAL(5,4),
    
    -- Prediction statistics
    predictions_count INTEGER,
    avg_prediction_time_ms DECIMAL(8,2),
    
    -- Alerts and flags
    has_alert BOOLEAN DEFAULT FALSE,
    alert_type VARCHAR(100),
    alert_message TEXT,
    
    -- Monitoring period
    monitoring_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(model_id, monitoring_date)
);

-- =====================================================
-- MODEL PREDICTIONS LOG (Optional - for inference tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS model_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    
    -- Prediction details
    input_data JSONB NOT NULL,
    prediction_result JSONB NOT NULL,
    prediction_confidence DECIMAL(5,4),
    
    -- Performance tracking
    prediction_time_ms DECIMAL(8,2),
    model_version VARCHAR(50),
    
    -- Request metadata
    request_id VARCHAR(255),
    user_id VARCHAR(255),
    client_ip INET,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AUDIT LOG TABLE - Track all changes
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- What changed
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    
    -- Change details
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Who and when
    user_id VARCHAR(255) NOT NULL,
    user_role VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Request context
    request_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Models table indexes
CREATE INDEX IF NOT EXISTS idx_models_status ON models(status);
CREATE INDEX IF NOT EXISTS idx_models_algorithm ON models(algorithm);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_risk_level ON models(risk_level);
CREATE INDEX IF NOT EXISTS idx_models_needs_recalibration ON models(needs_recalibration);
CREATE INDEX IF NOT EXISTS idx_models_function ON models(function);

-- Experiments table indexes
CREATE INDEX IF NOT EXISTS idx_experiments_model_id ON experiments(model_id);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);
CREATE INDEX IF NOT EXISTS idx_experiments_mlflow_run_id ON experiments(mlflow_run_id);
CREATE INDEX IF NOT EXISTS idx_experiments_created_at ON experiments(created_at DESC);

-- Monitoring table indexes
CREATE INDEX IF NOT EXISTS idx_monitoring_model_id ON model_monitoring(model_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_date ON model_monitoring(monitoring_date DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_has_alert ON model_monitoring(has_alert);

-- Predictions table indexes (if using prediction logging)
CREATE INDEX IF NOT EXISTS idx_predictions_model_id ON model_predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON model_predictions(created_at DESC);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_log(user_id);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update modified_at timestamp on models table
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_models_modified_at 
    BEFORE UPDATE ON models 
    FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active models with latest metrics
CREATE OR REPLACE VIEW active_models_view AS
SELECT 
    m.*,
    COALESCE(latest_monitoring.accuracy, m.accuracy) as current_accuracy,
    COALESCE(latest_monitoring.has_alert, FALSE) as has_monitoring_alert,
    latest_monitoring.monitoring_date as last_monitoring_date
FROM models m
LEFT JOIN LATERAL (
    SELECT * FROM model_monitoring mm 
    WHERE mm.model_id = m.id 
    ORDER BY monitoring_date DESC 
    LIMIT 1
) latest_monitoring ON TRUE
WHERE m.status IN ('production', 'testing');

-- Models needing attention (high risk or needs recalibration)
CREATE OR REPLACE VIEW models_needing_attention AS
SELECT 
    id,
    name,
    status,
    risk_level,
    needs_recalibration,
    last_backtest_date,
    next_review_date,
    accuracy,
    CASE 
        WHEN risk_level = 'high' THEN 'High Risk Model'
        WHEN needs_recalibration THEN 'Needs Recalibration'
        WHEN next_review_date < CURRENT_DATE THEN 'Review Overdue'
        ELSE 'Unknown'
    END as attention_reason
FROM models 
WHERE risk_level = 'high' 
   OR needs_recalibration = TRUE 
   OR next_review_date < CURRENT_DATE;

-- Model performance summary
CREATE OR REPLACE VIEW model_performance_summary AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_models,
    COUNT(CASE WHEN status = 'production' THEN 1 END) as production_models,
    COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_models,
    AVG(accuracy) as avg_accuracy,
    COUNT(CASE WHEN needs_recalibration THEN 1 END) as models_needing_recalibration
FROM models 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- =====================================================
-- INITIAL DATA (OPTIONAL)
-- =====================================================

-- Insert sample algorithm options (can be used for validation)
CREATE TABLE IF NOT EXISTS dropdown_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    UNIQUE(category, value)
);

-- Sample dropdown data
INSERT INTO dropdown_options (category, value, label, sort_order) VALUES
-- Algorithms
('algorithm', 'xgboost', 'XGBoost', 1),
('algorithm', 'random_forest', 'Random Forest', 2),
('algorithm', 'svm', 'Support Vector Machine', 3),
('algorithm', 'neural_network', 'Neural Network', 4),
('algorithm', 'linear_regression', 'Linear Regression', 5),
('algorithm', 'logistic_regression', 'Logistic Regression', 6),

-- Functions
('function', 'classification', 'Classification', 1),
('function', 'regression', 'Regression', 2),
('function', 'clustering', 'Clustering', 3),
('function', 'recommendation', 'Recommendation', 4),
('function', 'generation', 'Generation', 5),

-- Model Types
('model_type', 'python', 'Python', 1),
('model_type', 'r', 'R', 2),
('model_type', 'scala', 'Scala', 3),
('model_type', 'java', 'Java', 4),
('model_type', 'other', 'Other', 5)

ON CONFLICT (category, value) DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE models IS 'Core model registry containing all registered ML models and their metadata';
COMMENT ON TABLE model_versions IS 'Version history for models, allowing multiple versions per model';
COMMENT ON TABLE experiments IS 'MLflow experiment tracking integration';
COMMENT ON TABLE model_monitoring IS 'Time-series data for model performance monitoring';
COMMENT ON TABLE model_predictions IS 'Optional logging of model predictions for analysis';
COMMENT ON TABLE audit_log IS 'Complete audit trail of all system changes';

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO modelgov_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO modelgov_app;