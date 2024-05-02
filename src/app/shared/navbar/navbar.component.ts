import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  values = { menuHidden: true }
  
  public toggleMenu() {
    this.values.menuHidden = !this.values.menuHidden;
  }
}
