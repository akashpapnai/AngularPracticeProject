import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConstantsService } from '../../constants.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../login.service';
import { NavbarService, pages } from './navbar.service';

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

  public url: string = getURL(this.router.url);
  public openSideNav: boolean = false;
  public dockColor: string = this.constants.dockColor;
  public authenticationChecker: boolean | null = null;
  public sidenavOpen: boolean = false;
  public subModuleNameClicked: string = '';
  public sidenavModules: string[] = [];
  public sidenavSubModules: string[] = [];
  public sideNavPages: string[] = [];
  public pages: pages[] = [];
  public moduleClick: modulesBoolean[] = [];
  public subModuleClick: modulesBoolean[] = [];

  constructor(
    private router: Router,
    private constants: ConstantsService,
    private http: HttpClient,
    private lService: LoginService,
    private service: NavbarService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.renderer.listen('document', 'click', (event: Event) => {
      this.handleClickOutside(event);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const screenWidth = window.innerWidth;
    const sidenav = this.el.nativeElement.querySelector('#sidenav');
    if (screenWidth <= 768) {
      this.sidenavOpen = false;
      sidenav.classList.remove('open');
      sidenav.classList.add('closed');
    }
  }

  handleClickOutside(event: Event) {
    const sidenav = this.el.nativeElement.querySelector('#sidenav');
    const toggleButton = this.el.nativeElement.querySelector('#toggleButton');
    if (this.sidenavOpen && !sidenav.contains(event.target) && !toggleButton.contains(event.target)) {
      this.sidenavOpen = false;
      sidenav.classList.remove('open');
      sidenav.classList.add('closed');
    }
  }

  public trackByModuleIndex(index: number, item: any) {
    return index;
  }

  public trackBySubModuleIndex(index: number, item: any) {
    return index;
  }

  public toggleSidenav() {
    const modules_list = localStorage.getItem('modulesList') ?? "";
    let sideNav: string[] = [];
    if (modules_list !== null) {
      const splitted: string[] = modules_list.split(',');
      splitted.forEach(x => {
        sideNav.push(x);
      });
    }
    this.sidenavModules = sideNav;
    this.sidenavModules.forEach(x => {
      this.moduleClick.push({ title: x, clicked: false });
    });

    this.subModuleClick = [ { title: 'Master', clicked: false }, 
                            { title: 'Transaction', clicked: false }, 
                            { title: 'Report', clicked: false }
                          ]

    this.sidenavOpen = !this.sidenavOpen;
    const sidenav = document.getElementById('sidenav');
    if (this.sidenavOpen) {
      sidenav!.classList.remove('closed');
      sidenav!.classList.add('open');
    } else {
      sidenav!.classList.remove('open');
      sidenav!.classList.add('closed');
    }
  }

  ngOnInit() {
    if (typeof localStorage != 'undefined') {
      const token = localStorage.getItem('token');
      if (token !== null) {
        const data = this.http.get(this.lService.__apiURL__ + '/User/IsTokenValid', {
          params: {
            token: String(token)
          }
        });
        data.subscribe({
          next: () => {
            this.authenticationChecker = true;
          },
          error: () => {
            this.authenticationChecker = false;
            alert('You are not Authorized.');
            window.localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        })
      }
      else {
        this.authenticationChecker = false;
        alert('You are not Authorized.');
        window.localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    }
  }

  public LoginClick() {
    this.router.navigate(['/login']);
  }

  public moduleClicked(module: string) {

    this.pages = [];
    this.sideNavPages = [];
    this.moduleClick.forEach(x => {
      if (x.title !== module) {
        x.clicked = false;
      }
      else {
        x.clicked = !x.clicked;
      }
    });

    this.sidenavSubModules = ['Master','Transaction','Report']
  }

  public async subModuleClicked(module: string, subModule: string) {
    this.subModuleClick.forEach(x => {
      if(x.title !== subModule) {
        x.clicked = false;
      }
      else {
        x.clicked = !x.clicked;
      }
    });
    this.sideNavPages = [];
    this.pages = await this.service.getAllPages(module, subModule);
    this.pages.forEach(x => {
      this.sideNavPages.push(x.title);
    });
  }

  public LogOut() {
    const confirmation = confirm('Are you sure you want to Log Out?');
    if (confirmation) {
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
    // this.openSideNav = !this.openSideNav;
  }
}
function getURL(url: string): string {
  const curr_url = url.split('/')[1];
  switch (curr_url) {
    case 'opd':
      return 'OPD';
    case 'ipd':
      return 'IPD';
    case 'hrandpayroll':
      return 'HR And Payroll';
    case 'bloodbank':
      return 'Blood Bank';
    default:
      const splitted = curr_url.split(' ');
      if (splitted.length == 1) {
        return splitted[0].charAt(0).toUpperCase() + splitted[0].slice(1);
      }
      return '';
  }
}

interface modulesBoolean {
  title: string;
  clicked: boolean;
}
