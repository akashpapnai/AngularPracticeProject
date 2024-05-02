import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor() {}

  items = [{src:"https://imgs.search.brave.com/fqTbQXrCdaCuYsdZGKwt8dMW5Vso_m2j671rQ-yMx8s/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9waWNz/dW0ucGhvdG9zLzY0/MC80ODAvP2ltYWdl/PTM1Mw", alt: 'Image 1'},
           {src:"https://imgs.search.brave.com/8EA6pnJcoQZoL-dyQtFMpmgZ-2B8nrntMEPZ88A72WM/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzL2Y0OC9yYW5k/b20tcGljcy0xLTEz/MjQyODcuanBnP2Zt/dA", alt: 'Image 2'},
           {src:"https://imgs.search.brave.com/fqTbQXrCdaCuYsdZGKwt8dMW5Vso_m2j671rQ-yMx8s/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9waWNz/dW0ucGhvdG9zLzY0/MC80ODAvP2ltYWdl/PTM1Mw", alt: 'Image 3'},
  ]
}
