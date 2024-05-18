import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ConstantsService } from '../constants.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-ipd',
  standalone: true,
  imports: [NavbarComponent,CommonModule,CardComponent],
  templateUrl: './ipd.component.html',
  styleUrl: './ipd.component.scss'
})
export class IpdComponent {
  constructor(private constants: ConstantsService){}
  public cardData = this.constants.ModulesConstData;
}
