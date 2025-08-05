import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private static currentToken: string = '';
  private static currentUser: any = null;

  constructor(private jwtService: JwtService) {}

  static setToken(token: string) {
    AuthService.currentToken = token;
  }

  static getToken(): string {
    return AuthService.currentToken;
  }

  static clearToken() {
    AuthService.currentToken = '';
    AuthService.currentUser = null;
  }

  static setCurrentUser(user: any) {
    AuthService.currentUser = user;
  }

  static getCurrentUser(): any {
    return AuthService.currentUser;
  }

  static isAuthenticated(): boolean {
    return !!AuthService.currentToken;
  }

  static getAuthHeaders(): { Authorization: string } {
    return {
      Authorization: `Bearer ${AuthService.currentToken}`
    };
  }

  // Verify token and decode user info
  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  // Auto-login with stored token
  async autoLogin(): Promise<boolean> {
    if (!AuthService.currentToken) {
      return false;
    }

    const decoded = this.verifyToken(AuthService.currentToken);
    if (decoded) {
      AuthService.setCurrentUser(decoded);
      return true;
    }

    // Token is invalid, clear it
    AuthService.clearToken();
    return false;
  }
} 