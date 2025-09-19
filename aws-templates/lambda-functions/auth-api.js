// AWS Lambda function template for Authentication API
// This function handles user authentication with AWS Cognito

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const cognito = new AWS.CognitoIdentityServiceProvider();

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
    const { httpMethod, path, body } = event;
    const requestBody = body ? JSON.parse(body) : null;
    
    // Route requests based on HTTP method and path
    switch (true) {
      case path.includes('/login') && httpMethod === 'POST':
        return await login(requestBody);
      
      case path.includes('/register') && httpMethod === 'POST':
        return await register(requestBody);
      
      case path.includes('/refresh') && httpMethod === 'POST':
        return await refreshToken(requestBody);
      
      case path.includes('/logout') && httpMethod === 'POST':
        return await logout(event.headers.Authorization);
      
      case path.includes('/profile') && httpMethod === 'GET':
        return await getProfile(event.headers.Authorization);
      
      case path.includes('/profile') && httpMethod === 'PUT':
        return await updateProfile(event.headers.Authorization, requestBody);
      
      case path.includes('/change-password') && httpMethod === 'PUT':
        return await changePassword(event.headers.Authorization, requestBody);
      
      case path.includes('/forgot-password') && httpMethod === 'POST':
        return await forgotPassword(requestBody);
      
      case path.includes('/reset-password') && httpMethod === 'POST':
        return await resetPassword(requestBody);
      
      case path.includes('/confirm-signup') && httpMethod === 'POST':
        return await confirmSignUp(requestBody);
      
      case path.includes('/resend-confirmation') && httpMethod === 'POST':
        return await resendConfirmationCode(requestBody);
      
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Endpoint not found' })
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

// User login
const login = async (credentials) => {
  const { email, password } = credentials;
  
  try {
    const authParams = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };
    
    const authResult = await cognito.initiateAuth(authParams).promise();
    
    if (authResult.ChallengeName) {
      // Handle MFA or other challenges
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          challenge: authResult.ChallengeName,
          session: authResult.Session,
          challengeParameters: authResult.ChallengeParameters
        })
      };
    }
    
    const { AccessToken, RefreshToken, IdToken } = authResult.AuthenticationResult;
    
    // Get user attributes
    const userParams = {
      AccessToken: AccessToken
    };
    
    const userResult = await cognito.getUser(userParams).promise();
    const userAttributes = {};
    
    userResult.UserAttributes.forEach(attr => {
      userAttributes[attr.Name] = attr.Value;
    });
    
    const user = {
      id: userResult.Username,
      username: userResult.Username,
      email: userAttributes.email,
      fullName: userAttributes.name || userAttributes.email,
      role: userAttributes['custom:role'] || 'viewer',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        user,
        accessToken: AccessToken,
        refreshToken: RefreshToken,
        idToken: IdToken
      })
    };
    
  } catch (error) {
    console.error('Login error:', error);
    
    let statusCode = 400;
    let errorMessage = 'Invalid credentials';
    
    if (error.code === 'NotAuthorizedException') {
      errorMessage = 'Invalid email or password';
    } else if (error.code === 'UserNotConfirmedException') {
      statusCode = 403;
      errorMessage = 'User account not confirmed. Please check your email for confirmation instructions.';
    } else if (error.code === 'TooManyRequestsException') {
      statusCode = 429;
      errorMessage = 'Too many login attempts. Please try again later.';
    }
    
    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};

// User registration
const register = async (userData) => {
  const { email, password, fullName, role } = userData;
  
  try {
    const signUpParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: fullName },
        { Name: 'custom:role', Value: role || 'viewer' }
      ]
    };
    
    const signUpResult = await cognito.signUp(signUpParams).promise();
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'User registered successfully. Please check your email for confirmation instructions.',
        userId: signUpResult.UserSub,
        confirmationRequired: !signUpResult.UserConfirmed
      })
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed';
    
    if (error.code === 'UsernameExistsException') {
      errorMessage = 'User with this email already exists';
    } else if (error.code === 'InvalidPasswordException') {
      errorMessage = 'Password does not meet requirements';
    } else if (error.code === 'InvalidParameterException') {
      errorMessage = 'Invalid user data provided';
    }
    
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};

// Refresh access token
const refreshToken = async (tokenData) => {
  const { refreshToken } = tokenData;
  
  try {
    const refreshParams = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    };
    
    const authResult = await cognito.initiateAuth(refreshParams).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        accessToken: authResult.AuthenticationResult.AccessToken,
        idToken: authResult.AuthenticationResult.IdToken
      })
    };
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid or expired refresh token' })
    };
  }
};

// User logout (invalidate tokens)
const logout = async (authHeader) => {
  try {
    const accessToken = extractTokenFromHeader(authHeader);
    
    if (!accessToken) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No access token provided' })
      };
    }
    
    const logoutParams = {
      AccessToken: accessToken
    };
    
    await cognito.globalSignOut(logoutParams).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Logged out successfully' })
    };
    
  } catch (error) {
    console.error('Logout error:', error);
    return {
      statusCode: 200, // Return success even if token is invalid
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Logged out' })
    };
  }
};

// Get user profile
const getProfile = async (authHeader) => {
  try {
    const accessToken = extractTokenFromHeader(authHeader);
    
    if (!accessToken) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No access token provided' })
      };
    }
    
    const userParams = {
      AccessToken: accessToken
    };
    
    const userResult = await cognito.getUser(userParams).promise();
    const userAttributes = {};
    
    userResult.UserAttributes.forEach(attr => {
      userAttributes[attr.Name] = attr.Value;
    });
    
    const user = {
      id: userResult.Username,
      username: userResult.Username,
      email: userAttributes.email,
      fullName: userAttributes.name || userAttributes.email,
      role: userAttributes['custom:role'] || 'viewer',
      createdAt: userAttributes.created_at || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(user)
    };
    
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid or expired access token' })
    };
  }
};

// Update user profile
const updateProfile = async (authHeader, updateData) => {
  try {
    const accessToken = extractTokenFromHeader(authHeader);
    
    if (!accessToken) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No access token provided' })
      };
    }
    
    const userAttributes = [];
    
    if (updateData.fullName) {
      userAttributes.push({ Name: 'name', Value: updateData.fullName });
    }
    
    if (updateData.role) {
      userAttributes.push({ Name: 'custom:role', Value: updateData.role });
    }
    
    if (userAttributes.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No valid attributes to update' })
      };
    }
    
    const updateParams = {
      AccessToken: accessToken,
      UserAttributes: userAttributes
    };
    
    await cognito.updateUserAttributes(updateParams).promise();
    
    // Return updated profile
    return await getProfile(authHeader);
    
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to update profile' })
    };
  }
};

// Change password
const changePassword = async (authHeader, passwordData) => {
  try {
    const accessToken = extractTokenFromHeader(authHeader);
    const { currentPassword, newPassword } = passwordData;
    
    if (!accessToken) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No access token provided' })
      };
    }
    
    const changeParams = {
      AccessToken: accessToken,
      PreviousPassword: currentPassword,
      ProposedPassword: newPassword
    };
    
    await cognito.changePassword(changeParams).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Password changed successfully' })
    };
    
  } catch (error) {
    console.error('Change password error:', error);
    
    let errorMessage = 'Failed to change password';
    
    if (error.code === 'NotAuthorizedException') {
      errorMessage = 'Current password is incorrect';
    } else if (error.code === 'InvalidPasswordException') {
      errorMessage = 'New password does not meet requirements';
    }
    
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};

// Forgot password
const forgotPassword = async (requestData) => {
  try {
    const { email } = requestData;
    
    const forgotParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email
    };
    
    await cognito.forgotPassword(forgotParams).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Password reset instructions sent to your email'
      })
    };
    
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Always return success to prevent email enumeration
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'If the email exists, password reset instructions will be sent'
      })
    };
  }
};

// Reset password with confirmation code
const resetPassword = async (resetData) => {
  try {
    const { email, confirmationCode, newPassword } = resetData;
    
    const confirmParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword
    };
    
    await cognito.confirmForgotPassword(confirmParams).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Password reset successfully'
      })
    };
    
  } catch (error) {
    console.error('Reset password error:', error);
    
    let errorMessage = 'Failed to reset password';
    
    if (error.code === 'CodeMismatchException') {
      errorMessage = 'Invalid confirmation code';
    } else if (error.code === 'ExpiredCodeException') {
      errorMessage = 'Confirmation code has expired';
    } else if (error.code === 'InvalidPasswordException') {
      errorMessage = 'Password does not meet requirements';
    }
    
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};

// Confirm user signup
const confirmSignUp = async (confirmData) => {
  try {
    const { email, confirmationCode } = confirmData;
    
    const confirmParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode
    };
    
    await cognito.confirmSignUp(confirmParams).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Account confirmed successfully. You can now log in.'
      })
    };
    
  } catch (error) {
    console.error('Confirm signup error:', error);
    
    let errorMessage = 'Failed to confirm account';
    
    if (error.code === 'CodeMismatchException') {
      errorMessage = 'Invalid confirmation code';
    } else if (error.code === 'ExpiredCodeException') {
      errorMessage = 'Confirmation code has expired';
    }
    
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};

// Resend confirmation code
const resendConfirmationCode = async (requestData) => {
  try {
    const { email } = requestData;
    
    const resendParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email
    };
    
    await cognito.resendConfirmationCode(resendParams).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Confirmation code sent to your email'
      })
    };
    
  } catch (error) {
    console.error('Resend confirmation error:', error);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to resend confirmation code' })
    };
  }
};

// Helper function to extract token from Authorization header
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};