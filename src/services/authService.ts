import { apiClient } from './api';
import { User, LoginResponse, RefreshTokenResponse } from '@/types/model';
import { config } from '@/config/environment';

// Authentication service - Ready for AWS Cognito integration
export class AuthService {
  private readonly endpoint = '/auth';

  // Login with email/password (AWS Cognito)
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${this.endpoint}/login`, {
      email,
      password,
    });

    // Store tokens in localStorage (or consider httpOnly cookies for production)
    if (response.accessToken) {
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }

    return response;
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'editor' | 'viewer';
  }): Promise<User> {
    return apiClient.post<User>(`${this.endpoint}/register`, userData);
  }

  // Refresh access token
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<RefreshTokenResponse>(`${this.endpoint}/refresh`, {
      refreshToken,
    });

    localStorage.setItem('authToken', response.accessToken);
    return response;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(`${this.endpoint}/logout`);
    } finally {
      // Clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.endpoint}/profile`);
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`${this.endpoint}/profile`, userData);
    localStorage.setItem('currentUser', JSON.stringify(response));
    return response;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.put<void>(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/forgot-password`, { email });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/reset-password`, {
      token,
      newPassword,
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // AWS Cognito specific methods
  async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/confirm-signup`, {
      email,
      confirmationCode,
    });
  }

  async resendConfirmationCode(email: string): Promise<void> {
    return apiClient.post<void>(`${this.endpoint}/resend-confirmation`, { email });
  }
}

export const authService = new AuthService();