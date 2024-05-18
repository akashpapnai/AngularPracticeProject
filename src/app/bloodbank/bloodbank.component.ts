import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ConstantsService } from '../constants.service';
import { CardComponent } from '../shared/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bloodbank',
  standalone: true,
  imports: [NavbarComponent,CardComponent,CommonModule],
  templateUrl: './bloodbank.component.html',
  styleUrl: './bloodbank.component.scss'
})
export class BloodbankComponent {
  constructor(private constants: ConstantsService){}
  public cardData = this.constants.ModulesConstData;
}
