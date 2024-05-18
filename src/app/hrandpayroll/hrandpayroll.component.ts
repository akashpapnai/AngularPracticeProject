import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ConstantsService } from '../constants.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-hrandpayroll',
  standalone: true,
  imports: [NavbarComponent,CommonModule,CardComponent],
  templateUrl: './hrandpayroll.component.html',
  styleUrl: './hrandpayroll.component.scss'
})
export class HrandpayrollComponent {
  constructor(private constants:ConstantsService){}
  public cardData = this.constants.ModulesConstData;
}
