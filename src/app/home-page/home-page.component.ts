import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { LoginService } from '../login.service';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CardComponent } from '../shared/card/card.component';
import {CommonModule} from '@angular/common'
import { Router } from '@angular/router';

@Component({ selector: 'app-home-page',
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss', 
    imports: [
      NavbarComponent, 
      CardComponent, 
      CommonModule
    ]})
export class HomePageComponent {

  constructor(
    private lService: LoginService,
    private http: HttpClient,
    private router: Router
  ) {}

  private apiURL = this.lService.__apiURL__;
  private token_header = new HttpHeaders();
  public cardData:any[] = [];
  
  
  async ngOnInit(): Promise<void> {

    if(typeof localStorage !== 'undefined') {
      this.token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })

      const nModules = await this.http.get(this.apiURL + `/User/GetAllModules?token=${localStorage.getItem('token')}`, {headers: this.token_header});

      nModules.subscribe(
        {
          next: data => {
            var obj = JSON.parse(JSON.stringify(data));
            const modules_list = obj['modulesList'];
            if(modules_list !== null) {
              for(let index in modules_list) {
                const module = modules_list[index];
                let push_data = {imageSource: 'assets/images/'+ module.toLowerCase().replaceAll(' ','') + '.png',altText: module+' Image', title: module, description: module+' Description', tags: [], clicked: ''};
                this.cardData.push(push_data);
              }
            }
          },
          error: (err) => {
            console.error(err);
          }
        }
      )
    }
  }

  async clicked_card(_t6: any) {
    const updatedCard = { ..._t6, clicked: _t6.title };
    const updatedCardData = this.cardData.map(card => card === _t6 ? updatedCard : card);
    this.cardData = updatedCardData;

    const checkUser = await this.http.get(this.apiURL+`/User/IsTokenValid?token=${localStorage.getItem('token')}`);
    checkUser.subscribe(
      {
        next: (response) => {
          this.router.navigate(['/'+_t6.title.toLowerCase().replaceAll(' ','')]);

          _t6.clicked = '';
        },
        error: () => {
          _t6.clicked = '';
        }
      }
    )
  }
}
