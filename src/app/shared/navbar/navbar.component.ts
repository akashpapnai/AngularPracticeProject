import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { ConstantsService } from '../../constants.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public url:string = getURL(this.router.url);
  public dockColor: string = this.constants.dockColor;
  public authenticationChecker: boolean | null = null;
  
  constructor(
    private router: Router, 
    private aService: AuthService, 
    private constants: ConstantsService, 
    private http: HttpClient,
    private lService: LoginService
  ) {}

  ngOnInit() {
    if(typeof localStorage != 'undefined') {
      const token = localStorage.getItem('token');
      if(token !== null) {
        const data =  this.http.get(this.lService.__apiURL__ + '/User/IsTokenValid',{params: {
          token: String(token)
        }});
        data.subscribe({
          next: () => {
            this.authenticationChecker = true;
          },
          error: () => {
            this.authenticationChecker = false;
          }
        })
      }
      else {
        this.authenticationChecker = false;
      }
    }
  }

  public LoginClick() {
    this.router.navigate(['/login']);
  }
  
  public LogOut() {
    const confirmation = confirm('Are you sure you want to Log Out?');
    if(confirmation) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
      window.location.reload();
    }
    else {
      
    }
  }
  
  public OpenProfile() {
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

