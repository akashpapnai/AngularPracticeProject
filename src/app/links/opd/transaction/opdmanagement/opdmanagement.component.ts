import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../../login.service';
import { Observable, from, map, startWith, switchMap } from 'rxjs';
import { DateComponent } from '../../../../shared/inputs/date/date.component';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { AutoCompleteComponent } from '../../../../shared/inputs/auto-complete/auto-complete.component';

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
    ReactiveFormsModule,
    DateComponent,
    TextFieldComponent,
    AutoCompleteComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMATS)
  ],
  templateUrl: './opdmanagement.component.html',
  styleUrl: './opdmanagement.component.scss'
})
export class OpdmanagementComponent {
  public managementClass: ManagementClass = {
    uhid: '',
    date: new FormControl({ value: '', disabled: true }),
    appointment: '',
    firstName: '',
    middleName: '',
    lastName: ''
  };

  public age: string = '';
  private apiUrl = this.lService.__apiURL__;

  uhidControl = new FormControl('');
  opidControl = new FormControl('');
  uhidoptions: string[] = [];
  opidoptions: string[] = [];
  uhidfilteredOptions: Observable<string[]> = new Observable<string[]>;
  opidfilteredOptions: Observable<string[]> = new Observable<string[]>;

  constructor(private http: HttpClient, private lService: LoginService) { }

  async ngOnInit() {
    this.uhidoptions = await this.getUhids('u');

    this.uhidfilteredOptions = this.uhidControl.valueChanges.pipe(
      startWith('u'),
      switchMap(value => from(this._uhidfilter(value || ''))),
    );

    this.opidoptions = await this.getOpids('o');
    this.opidfilteredOptions = this.opidControl.valueChanges.pipe(
      startWith('u'),
      switchMap(value => from(this._opidfilter(value || ''))),
    );
  }

  public getUhids(startWith: string): Promise<string[]> {
    const toSend = new Promise<string[]>(resolve => {

      if (startWith === '') {
        resolve([]);
      }

      const token = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const data = this.http.get<uhidResponse>(this.apiUrl + '/Common/getUhidStartsWith', {
        headers: token, params: {
          'startsWith': startWith
        }
      });

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

      if (startWith === '') {
        resolve([]);
      }

      const token = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const data = this.http.get<uhidResponse>(this.apiUrl + '/Common/getOpidStartsWith', {
        headers: token, params: {
          'startsWith': startWith
        }
      });

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
  firstName: string;
  middleName: string;
  lastName: string;
}

interface uhidResponse {
  uhids: string[];
}