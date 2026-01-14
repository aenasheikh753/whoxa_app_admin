import { API_CONFIG } from '@/config/api';
import { BaseApiService } from '@/services/api/baseApi';
import type { AdminLogin, LoginCredentials, RegisterData, TokenPair } from '@/types/auth';

export class AuthService extends BaseApiService {
  constructor() {
    super('admin');
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AdminLogin> {
    try {
      const fullUrl = `${API_CONFIG.BASE_URL}/admin${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`;
      console.log('Login request:', {
        endpoint: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        baseUrl: this.baseUrl,
        apiBaseUrl: API_CONFIG.BASE_URL,
        fullUrl: fullUrl,
        credentials: { email: credentials.email, password: '***' }
      });

      const response = await this.post<any>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log('Login response received:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'response is null/undefined');
      console.log('Full response:', JSON.stringify(response, null, 2));

      // Backend returns: { status: true, data: { token, ... }, message: "...", toast: true }
      // BaseApiService.post() returns response.data from axios, so response is already the backend's response object
      if (!response) {
        console.error('Response is null or undefined');
        throw new Error('No response received from server');
      }

      // Check if response already has the backend structure { status, data, message, toast }
      if (response.status !== undefined && response.data !== undefined) {
        // Response is already in the correct format: { status, data, message, toast }
        if (!response.data.token) {
          console.error('Token not found in response.data. Response.data:', response.data);
          throw new Error('Invalid response structure: token not found');
        }
        
        // Store tokens
        this.setAuthTokens(response.data.token);
        
        return response as AdminLogin;
      }

      // Fallback: if response structure is different
      console.error('Unexpected response structure. Full response:', JSON.stringify(response, null, 2));
      throw new Error('Invalid response structure: expected { status, data, message, toast }');
    } catch (error: any) {
      console.error('Login error details:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error message:', error?.message);
      this.clearAuthTokens();
      
      // Provide more helpful error messages
      if (error?.response) {
        const errorMessage = error.response.data?.message || error.message || 'Login failed';
        throw new Error(errorMessage);
      } else if (error?.request) {
        throw new Error('Network error: Could not reach the server. Please check if the backend is running.');
      } else {
        throw this.transformError(error);
      }
    }
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<{ user: UserProfile; tokens: TokenPair }> {
    try {
      const response = await this.post<{ user: UserProfile; tokens: TokenPair }>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );

      // Store tokens
      this.setAuthTokens(response.tokens);

      return response;
    } catch (error) {
      this.clearAuthTokens();
      throw this.transformError(error);
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token exists
      const refreshToken = localStorage.getItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthTokens();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<TokenPair> {
    const refreshToken = localStorage.getItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const tokens = await this.post<TokenPair>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      this.setAuthTokens(tokens);
      return tokens;
    } catch (error) {
      this.clearAuthTokens();
      throw this.transformError(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<AdminLogin> {
    return this.put<AdminLogin>(API_CONFIG.ENDPOINTS.ADMIN.PROFILE);
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  /**
   * Store authentication tokens
   */
  private setAuthTokens(tokens: string): void {
    localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, tokens);

  }

  /**
   * Clear authentication tokens
   */
  private clearAuthTokens(): void {
    localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
  }
}

// Export a singleton instance
export const authService = new AuthService();
