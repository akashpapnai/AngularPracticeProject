import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent,HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  constructor(
    private http: HttpClient, 
    private lService: LoginService, 
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    debugger;
    if(localStorage.getItem('token')) {
      const token = localStorage.getItem('token')

      const checkToken = await this.http.get(this.lService.__apiURL__ + `/User/IsTokenValid?token=${token}`);

      checkToken.subscribe(
        {
          next: () => {
          },
          error: ()=> {
            alert('Error Response from Server');
            localStorage.removeItem('token');
            this.router.navigate(['/']);
          }
        }
      )
    }    
  }
    
}
