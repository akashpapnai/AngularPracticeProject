import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoginService } from '../../../../login.service';
import { Observable, from, map, startWith, switchMap } from 'rxjs';

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
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    AsyncPipe
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

  uhidControl = new FormControl('');
  opidControl = new FormControl('');
  uhidoptions: string[] = [];
  opidoptions: string[] = [];
  uhidfilteredOptions: Observable<string[]> = new Observable<string[]>;
  opidfilteredOptions: Observable<string[]> = new Observable<string[]>;
  
  constructor(private http:HttpClient, private lService: LoginService) {}

  async ngOnInit() {
    this.uhidoptions = await this.getUhids('u');

    this.uhidfilteredOptions = this.uhidControl.valueChanges.pipe(
      startWith('u'),
      switchMap(value   => from(this._uhidfilter(value || ''))),
    );

    this.opidoptions = await this.getOpids('o');
    this.opidfilteredOptions = this.opidControl.valueChanges.pipe(
      startWith('u'),
      switchMap(value   => from(this._opidfilter(value || ''))),
    );
  }

  public getUhids(startWith: string): Promise<string[]> {
    const toSend = new Promise<string[]>(resolve => {

      if(startWith === '') {
        resolve([]);
      }

      const token = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
  
      const data = this.http.get<uhidResponse>(this.apiUrl + '/Common/getUhidStartsWith', {headers: token,params: {
        'startsWith': startWith
      }});
  
      data.subscribe({
        next: (response) => {
          resolve(response.uhids);
        }
      })
    });

    return toSend;
  }

  public getOpids(startWith: string): Promise<string[]> {
    const toSend = new Promise<string[]>(resolve => {

      if(startWith === '') {
        resolve([]);
      }

      const token = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
  
      const data = this.http.get<uhidResponse>(this.apiUrl + '/Common/getOpidStartsWith', {headers: token,params: {
        'startsWith': startWith
      }});
  
      data.subscribe({
        next: (response) => {
          resolve(response.uhids);
        }
      })
    });

    return toSend;
  }

  private async _uhidfilter(value: string): Promise<string[]> {

    this.uhidoptions = await this.getUhids(value);

    const filterValue = value.toLowerCase();

    return this.uhidoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private async _opidfilter(value: string): Promise<string[]> {

    this.opidoptions = await this.getOpids(value);

    const filterValue = value.toLowerCase();

    return this.opidoptions.filter(option => option.toLowerCase().includes(filterValue));
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