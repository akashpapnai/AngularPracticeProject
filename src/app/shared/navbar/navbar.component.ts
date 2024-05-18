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

  public url:string = getURL(this.router.url);
  
  constructor(private router: Router, private aService: AuthService) {}
  
  LogOut() {
    const confirmation = confirm('Are you sure you want to Log Out?');
    if(confirmation) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
      window.location.reload();
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
function getURL(url:string): string {
  const curr_url = url.split('/')[1];
  switch(curr_url) {
    case 'opd':
      return 'OPD';
    case 'ipd':
      return 'IPD';
    case 'hrandpayroll':
      return 'HR And Payroll';
    case 'bloodbank':
      return 'Blood Bank';
    default:
      return ''; 
  }
}

