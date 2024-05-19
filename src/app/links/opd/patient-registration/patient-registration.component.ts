import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, MatFormFieldModule, MatInputModule,MatDatepickerModule],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss',
  providers: [
    provideNativeDateAdapter()
  ]
})
export class PatientRegistrationComponent {
public registerPatient() {

}


}
