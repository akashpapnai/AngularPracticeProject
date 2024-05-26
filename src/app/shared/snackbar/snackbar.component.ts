import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConstantsService } from '../../constants.service';

export const slideUpDownAnimation = trigger('slideUpDownAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('1000ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('1000ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
  ])
]);

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})

export class SnackbarComponent implements OnChanges, OnInit {
  @Input() show: boolean = false;
  @Input() message: string = '';

  constructor(private constants: ConstantsService) { }
  public dockColor: string = this.constants.dockColor

  ngOnInit(): void {
    if(this.message.length > 0) {
      this.showSnackbar(this.message);
    }
  }

  ngOnChanges() {
    debugger;
    if(this.message.length > 0) {
      this.showSnackbar(this.message);
    }
  }

  showSnackbar(message: string) {
    this.message = message;
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
}
