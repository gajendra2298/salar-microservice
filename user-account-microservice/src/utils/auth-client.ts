import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthService } from '../auth/services/auth.service';

export class AuthClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });

    // Add request interceptor to automatically add JWT token
    this.client.interceptors.request.use((config) => {
      if (AuthService.isAuthenticated()) {
        config.headers.Authorization = AuthService.getAuthHeaders().Authorization;
      }
      return config;
    });

    // Add response interceptor to handle token storage
    this.client.interceptors.response.use((response) => {
      // If login response contains token, store it automatically
      if (response.data && response.data.data && response.data.data.token) {
        AuthService.setToken(response.data.data.token);
        AuthService.setCurrentUser(response.data.data.user);
      }
      return response;
    });
  }

  // Login and automatically store token
  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/user/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create user
  async createUser(userData: any) {
    try {
      const response = await this.client.post('/user/create', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get profile (automatically uses stored token)
  async getProfile() {
    try {
      const response = await this.client.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData: any) {
    try {
      const response = await this.client.post('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout (clear stored token)
  logout() {
    AuthService.clearToken();
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return AuthService.isAuthenticated();
  }

  // Get current user
  getCurrentUser(): any {
    return AuthService.getCurrentUser();
  }

  // Get stored token
  getToken(): string {
    return AuthService.getToken();
  }

  // Make custom request with automatic auth
  async request(config: AxiosRequestConfig) {
    try {
      const response = await this.client.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
} 