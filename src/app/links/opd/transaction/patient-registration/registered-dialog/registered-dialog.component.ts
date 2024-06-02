import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registered-dialog',
  standalone: true,
  imports: [],
  templateUrl: './registered-dialog.component.html',
  styleUrl: './registered-dialog.component.scss'
})
export class RegisteredDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Input() ID: string = '';
  
  constructor(private router: Router) {}

  public sendToOPD() {
    this.router.navigate(['opd/opdmanagement',this.ID]);
  }
  public sendToIPD() {
    
  }
  public closeDialog() {
    this.close.emit();
  }
}
