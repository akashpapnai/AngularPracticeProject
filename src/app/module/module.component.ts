import { Component } from '@angular/core';
import { ConstantsService } from '../constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginService } from '../login.service';
import { CardComponent } from '../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({ selector: 'app-module',
    standalone: true,
    templateUrl: './module.component.html',
    styleUrl: './module.component.scss', imports: [CardComponent,
        CommonModule,
        NavbarComponent] })
export class ModuleComponent {
  constructor(
    private constants: ConstantsService,
    private router: Router,
    private http:HttpClient,
    private lService: LoginService,
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    this.route.url.subscribe(urlSegments => {
      const url = this.router.url;
      this.current_module = url.substring(url.lastIndexOf('/') + 1);
    });
  }

  public current_module: string | null = '';
  public cardData: any[] = this.constants.ModulesConstData;
  public cardDataForOperation: any[] = [];
  async clicked_card(_t5: any) {

    this.cardUpdate(_t5,_t5.title);

    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const moduleName = this.router.url.split('/')[1];
    const pagesList = await this.http.get(this.lService.__apiURL__ + `/User/GetPages`, {headers:token_header,params: {
      'module': moduleName,
      'refer': _t5.title
    }});
    
    pagesList.subscribe({
      next: (data) => {
        const obj = JSON.parse(JSON.stringify(data));
        if(obj['pages'].length === 0) {
          this.cardDataForOperation = [];
          alert('No Pages Found');
        }
        else {
          const pagesList = obj['pages'] as [];
          this.cardDataForOperation = [];
          pagesList.forEach(page => {
            
            let filePath =  (page as string).toLowerCase().replaceAll(' ','')
            
            this.cardDataForOperation.push({imageSource:this.lService.__apiURL__+`/User/GetImage?filePath=${filePath}.png`,altText:page+'',title:page, description: page + ' Description', tags: []});
          });
        }
        
        this.resetAllCards();
      },
      error: () => {
        this.resetAllCards();
      }
    })
  }
  public operationListShow() {
    this.cardDataForOperation = [];
    
    this.resetAllCards();
  }
  public linkClick(_t20: any) {
    const moduleName = this.router.url.split('/')[1];
    const link = _t20.title.toLowerCase().replaceAll(' ','');
    this.router.navigate([moduleName+'/'+link]);
  }
  public cardUpdate(_t5:any, clicked: string) {
    const updatedCard = { ..._t5, clicked: clicked };
    const updatedCardData = this.cardData.map(card => card === _t5 ? updatedCard : card);
    this.cardData = updatedCardData;
  }
  public resetAllCards() {
    this.cardData.forEach(card => {
      card.clicked = '';
    });
  }
}
