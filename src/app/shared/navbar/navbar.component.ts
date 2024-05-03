import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  
  constructor(private router: Router, private aService: AuthService) {}
  
  LogOut() {
    const confirmation = confirm('Are you sure you want to Log Out?');
    if(confirmation) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    }
    else {
      
    }
  }
  isAuthenticated() {
    return this.aService.isLoggedIn();
  }
  OpenProfile() {
    this.router.navigate(['/profile'])
  }
  values = { menuHidden: true }
  
  public toggleMenu() {
    this.values.menuHidden = !this.values.menuHidden;
  }

  ContactClick() {
    throw new Error('Method not implemented.');
  }
  ServicesClick() {
    throw new Error('Method not implemented.');
  }
  AboutClick() {
    throw new Error('Method not implemented.');
  }
  HomeClick() {
    this.router.navigate(['/']);    
  }
}
