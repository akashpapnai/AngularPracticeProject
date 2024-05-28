import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../../login.service';
const moment = _rollupMoment || _moment;
export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-opdmanagement',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMATS)
  ],
  templateUrl: './opdmanagement.component.html',
  styleUrl: './opdmanagement.component.scss'
})
export class OpdmanagementComponent {
  public managementClass:ManagementClass = {
    uhid: '',
    date: new FormControl(),
    appointment: ''
  };
  
  private apiUrl = this.lService.__apiURL__;
  
  constructor(private http:HttpClient, private lService: LoginService) {}

  async ngOnInit() {
  }

  public getSuggestions(query: string): Observable<string[]> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') });

    const data = this.http.get<uhidResponse>(`${this.lService.__apiURL__}/Common/getUhidStartsWith`, { headers, params: {
      'startWith': this.managementClass.uhid
    } });

    data.subscribe({
      next: (response) => {
        console.log(response.uhids);
        return response.uhids;
      }
    })

    return new Observable<string[]>;
  }

}

interface ManagementClass {
appointment: any;
  uhid: string;
  date: FormControl;
}

interface uhidResponse {
  uhids: string[];
}