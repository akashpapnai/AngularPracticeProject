import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CardComponent } from '../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-opd',
  standalone: true,
  imports: [NavbarComponent,CardComponent,CommonModule],
  templateUrl: './opd.component.html',
  styleUrl: './opd.component.scss'
})
export class OpdComponent {
  constructor(private constants: ConstantsService){}
  public cardData: any[] = this.constants.ModulesConstData;
  clicked_card(_t5: any) {

  }
}
