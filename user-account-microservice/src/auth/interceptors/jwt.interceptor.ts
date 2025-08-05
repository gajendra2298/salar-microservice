import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  private static token: string = '';

  static setToken(token: string) {
    JwtInterceptor.token = token;
  }

  static getToken(): string {
    return JwtInterceptor.token;
  }

  static clearToken() {
    JwtInterceptor.token = '';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Automatically add JWT token to headers if available
    if (JwtInterceptor.token && !request.headers.authorization) {
      request.headers.authorization = `Bearer ${JwtInterceptor.token}`;
    }

    return next.handle().pipe(
      tap((response) => {
        // If login response contains token, store it automatically
        if (response && response.data && response.data.token) {
          JwtInterceptor.setToken(response.data.token);
        }
      })
    );
  }
} 