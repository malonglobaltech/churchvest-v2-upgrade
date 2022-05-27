import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(): boolean {
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['/portal/activity']);
      return false;
    } else {
      return true;
    }
  }
}
