import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { LoginService } from '../login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  public marketingContent: boolean | null = null;

  cards = [
    { title: 'Hospital Outside View', content: 'This is the beautiful view of hospital from outside', img: 'https://imgs.search.brave.com/O452HkHjQkJEMo0bhJENw742C6f5Uw6IXvVCWsRZKo0/rs:fit:860:0:0/g:ce/aHR0cDovL2lnaW1z/Lm9yZy9EYXRhRmls/ZXMvQ29udGVudC82/NF8xLmpwZw' },
    { title: 'Hospital Bed', content: 'This is the proper bed of hospital for perticular patient', img: 'https://www.paho.org/sites/default/files/untitled_1500_540_px_1_0.jpg' },
    { title: 'OT Room', content: 'This is how our Operation Theater Room looks like', img: 'https://www.breachcandyhospital.org/sites/default/files/17-compressed.jpg' },
  ];
  currentIndex = 0;
  translateX = '0%';

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.cards.length - 1;
    }
    this.updateTranslateX();
  }

  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateTranslateX();
  }

  updateTranslateX() {
    this.translateX = `-${this.currentIndex * 100}%`;
  }
  
  
  async ngOnInit(): Promise<void> {

    if(typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if(token !== null) {
        this.token_header = new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
  
        const nModules = await this.http.get(this.apiURL + `/User/GetAllModules?token=${localStorage.getItem('token')}`, {headers: this.token_header});
  
        nModules.subscribe(
          {
            next: data => {
              var obj = JSON.parse(JSON.stringify(data));
              const modules_list = obj['modulesList'];
              let allModules: string[] = [];

              if(modules_list !== null) {
                for(let index in modules_list) {
                  const module = modules_list[index];
                  allModules.push(module);
                  let push_data = {imageSource: 'assets/images/'+ module.toLowerCase().replaceAll(' ','') + '.png',altText: module+' Image', title: module, description: module+' Description', tags: [], clicked: ''};
                  this.cardData.push(push_data);
                }
                localStorage.setItem('modulesList',modules_list);              
                this.marketingContent = false;
              }
            },
            error: (err) => {
              this.marketingContent = true;
              console.error(err);
            }
          }
        )
      }
      else {
        this.marketingContent = true;
      }
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
