import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Automatically add JWT token to headers if available and not already present
    if (AuthService.isAuthenticated() && !req.headers.authorization) {
      req.headers.authorization = AuthService.getAuthHeaders().Authorization;
    }
    
    next();
  }
} 