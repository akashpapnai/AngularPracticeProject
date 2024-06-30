import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    try {
      const checkingIsLoggedIn = this.authService.isLoggedIn();
      if (checkingIsLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
    catch(ex) {
      return false;
    }
  }
}
