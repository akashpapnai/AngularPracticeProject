import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() data: any;
  @Input() clicked: any;
}
