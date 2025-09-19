// AWS Lambda function template for Models API
// This function handles CRUD operations for models

const { Client } = require('pg');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const secretsManager = new AWS.SecretsManager();

// Database connection configuration
let dbConfig = null;

const getDbConfig = async () => {
  if (dbConfig) return dbConfig;
  
  try {
    const secret = await secretsManager.getSecretValue({
      SecretId: process.env.DB_SECRET_ARN
    }).promise();
    
    const dbCredentials = JSON.parse(secret.SecretString);
    
    dbConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: dbCredentials.username,
      password: dbCredentials.password,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
    
    return dbConfig;
  } catch (error) {
    console.error('Error getting database configuration:', error);
    throw error;
  }
};

// Helper function to execute database queries
const executeQuery = async (query, params = []) => {
  const config = await getDbConfig();
  const client = new Client(config);
  
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await client.end();
  }
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Main Lambda handler
exports.handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  try {
    const { httpMethod, path, pathParameters, body } = event;
    const requestBody = body ? JSON.parse(body) : null;
    
    // Route requests based on HTTP method and path
    switch (httpMethod) {
      case 'GET':
        if (pathParameters?.id) {
          return await getModel(pathParameters.id);
        } else {
          return await getModels(event.queryStringParameters || {});
        }
      
      case 'POST':
        if (path.includes('/artifacts/')) {
          return await uploadArtifact(pathParameters.id, requestBody);
        } else if (path.includes('/predict')) {
          return await predictModel(pathParameters.id, requestBody);
        } else if (path.includes('/retrain')) {
          return await retrainModel(pathParameters.id);
        } else {
          return await createModel(requestBody);
        }
      
      case 'PUT':
        return await updateModel(pathParameters.id, requestBody);
      
      case 'DELETE':
        return await deleteModel(pathParameters.id);
      
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Lambda execution error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

// Get all models with pagination and filtering
const getModels = async (queryParams) => {
  const { page = 1, limit = 20, search, algorithm, status } = queryParams;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let whereClause = 'WHERE 1=1';
  const params = [];
  let paramIndex = 1;
  
  if (search) {
    whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }
  
  if (algorithm) {
    whereClause += ` AND algorithm = $${paramIndex}`;
    params.push(algorithm);
    paramIndex++;
  }
  
  if (status) {
    whereClause += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }
  
  const query = `
    SELECT *, COUNT(*) OVER() as total_count 
    FROM models 
    ${whereClause} 
    ORDER BY created_at DESC 
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  
  params.push(parseInt(limit), offset);
  
  const models = await executeQuery(query, params);
  const total = models.length > 0 ? parseInt(models[0].total_count) : 0;
  const totalPages = Math.ceil(total / parseInt(limit));
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      models: models.map(model => {
        const { total_count, ...modelData } = model;
        return modelData;
      }),
      total,
      page: parseInt(page),
      totalPages
    })
  };
};

// Get single model by ID
const getModel = async (id) => {
  const query = 'SELECT * FROM models WHERE id = $1';
  const models = await executeQuery(query, [id]);
  
  if (models.length === 0) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Model not found' })
    };
  }
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(models[0])
  };
};

// Create new model
const createModel = async (modelData) => {
  const {
    name, description, algorithm, function: modelFunction, modelType,
    scoreCodeType, modeler, trainCodeType, targetLevel, tool, toolVersion,
    externalUrl, modelVersionName, ADL_ACRE, ADL_ARES, ADL_ARUS, DS_CAMD, DS_PRMD
  } = modelData;
  
  const id = require('crypto').randomUUID();
  const now = new Date().toISOString();
  
  const query = `
    INSERT INTO models (
      id, name, description, algorithm, function, model_type, score_code_type,
      modeler, train_code_type, target_level, tool, tool_version, external_url,
      model_version_name, adl_acre, adl_ares, adl_arus, ds_camd, ds_prmd,
      status, created_at, modified_at, created_by, modified_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    RETURNING *
  `;
  
  const params = [
    id, name, description, algorithm, modelFunction, modelType, scoreCodeType,
    modeler, trainCodeType, targetLevel, tool, toolVersion, externalUrl,
    modelVersionName, ADL_ACRE, ADL_ARES, ADL_ARUS, DS_CAMD, DS_PRMD,
    'development', now, now, 'system', 'system' // TODO: Get from JWT token
  ];
  
  const result = await executeQuery(query, params);
  
  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify(result[0])
  };
};

// Update existing model
const updateModel = async (id, modelData) => {
  const updateFields = [];
  const params = [];
  let paramIndex = 1;
  
  for (const [key, value] of Object.entries(modelData)) {
    if (value !== undefined && value !== null) {
      updateFields.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
  }
  
  if (updateFields.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'No fields to update' })
    };
  }
  
  updateFields.push(`modified_at = $${paramIndex}`);
  params.push(new Date().toISOString());
  paramIndex++;
  
  params.push(id);
  
  const query = `
    UPDATE models 
    SET ${updateFields.join(', ')} 
    WHERE id = $${paramIndex} 
    RETURNING *
  `;
  
  const result = await executeQuery(query, params);
  
  if (result.length === 0) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Model not found' })
    };
  }
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result[0])
  };
};

// Delete model
const deleteModel = async (id) => {
  const query = 'DELETE FROM models WHERE id = $1 RETURNING *';
  const result = await executeQuery(query, [id]);
  
  if (result.length === 0) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Model not found' })
    };
  }
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'Model deleted successfully' })
  };
};

// Upload artifact to S3
const uploadArtifact = async (modelId, artifactData) => {
  const { fileName, fileType, content, artifactType } = artifactData;
  
  const bucketName = process.env.ARTIFACTS_BUCKET;
  const key = `models/${modelId}/artifacts/${artifactType}/${fileName}`;
  
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(content, 'base64'),
      ContentType: fileType,
      Metadata: {
        modelId,
        artifactType,
        uploadedAt: new Date().toISOString()
      }
    };
    
    const result = await s3.upload(uploadParams).promise();
    
    // Update model with artifact path
    const updateQuery = `
      UPDATE models 
      SET ${artifactType}_path = $1, modified_at = $2 
      WHERE id = $3
    `;
    
    await executeQuery(updateQuery, [result.Location, new Date().toISOString(), modelId]);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: result.Location })
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to upload artifact' })
    };
  }
};

// Model prediction endpoint (integrate with SageMaker)
const predictModel = async (modelId, inputData) => {
  // TODO: Integrate with AWS SageMaker for real-time inference
  // For now, return mock prediction
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      modelId,
      prediction: 0.85,
      confidence: 0.92,
      timestamp: new Date().toISOString()
    })
  };
};

// Model retraining endpoint (integrate with SageMaker Training Jobs)
const retrainModel = async (modelId) => {
  // TODO: Trigger SageMaker training job
  // For now, return mock job ID
  
  const jobId = require('crypto').randomUUID();
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      jobId,
      status: 'started',
      message: 'Model retraining job started'
    })
  };
};