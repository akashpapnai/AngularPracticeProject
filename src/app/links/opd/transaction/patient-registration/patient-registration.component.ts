import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoginService } from '../../../../login.service';
import { ConstantsService } from '../../../../constants.service';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  selector: 'app-patient-registration',
  standalone: true,
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss', imports: [CommonModule,
    NavbarComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule], providers: [
      provideNativeDateAdapter(),
      provideMomentDateAdapter(DATE_FORMATS)
    ]
})
export class PatientRegistrationComponent implements OnInit {

  constructor(
    private lService: LoginService,
    private constants: ConstantsService,
    private http: HttpClient
  ) { }

  public submitClass = new patientRegistration();
  public countries: any[] = [];
  public states: any[] = [];
  public cities: any[] = [];
  public formValues = {
    guardianList: this.constants.guardiansList,
    mStatusList: this.constants.maritalStatusList,
    bGroup: this.constants.bloodGroupList,
    religion: this.constants.religionList,
    documents: this.constants.documentsList,
    age: ''
  }

  public loading = {
    resetting: false,
    submitting: false
  }

  public maxDate: Date = new Date();
  public date = new FormControl(moment());

  async ngOnInit(): Promise<any> {
    const apiURL = this.lService.__apiURL__;
    this.getUhid();

    if (typeof localStorage !== 'undefined') {
      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allCountries = this.http.get(apiURL + "/Common/getAllCountries", { headers: token_header });

      allCountries.subscribe({
        next: (data) => {
          const objC: countryResponse = data as countryResponse;
          const obj: any[] = objC.allCountries;
          for (let country of obj) {
            this.countries.push({ id: country.iso2, name: country.name });
          }
        }
      })
    }
  }

  public async countrySelected() {
    this.submitClass.stateId = '';
    this.states = [];
    this.submitClass.cityId = '';
    this.cities = [];

    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const statesList = await this.http.get(this.lService.__apiURL__ + '/Common/GetStatesByCountry', {
        headers: token_header, params: {
          'country': this.submitClass.countryId
        }
      });

      statesList.subscribe({
        next: (data) => {
          const objS: statesResponse = data as statesResponse;
          const obj: any[] = objS.allStates;
          for (let state of obj) {
            this.states.push({ id: state.iso2, name: state.name });
          }
        }
      })
    }
  }

  public async stateSelected() {
    this.submitClass.cityId = '';
    this.cities = [];

    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const citiesList = await this.http.get(this.lService.__apiURL__ + '/Common/GetCitiesByCountryAndState', {
        headers: token_header, params: {
          'country': this.submitClass.countryId,
          'state': this.submitClass.stateId
        }
      });

      citiesList.subscribe({
        next: (data) => {
          const objCT: citiesResponse = data as citiesResponse;
          const obj: any[] = objCT.allCities;
          for (let city of obj) {
            this.cities.push({ id: city.id, name: city.name });
          }
        }
      })
    }
  }

  public calculateAge(dob: Moment) {
    this.formValues.age = this.constants.calculateAge(dob);
  }


  public async getUhid() {
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      const uhid = await this.http.get(this.lService.__apiURL__ + '/Common/GetLatestUHID', { headers: token_header });

      uhid.subscribe({
        next: (data) => {
          const obj = data as uhidResponse;
          this.submitClass.uhid = obj.uhid;
        },
        error: (err) => {
          this.submitClass.uhid = '';
        }
      })
    }
    this.submitClass.uhid = '';
  }

  public async registerPatient(form: NgForm) {
    if (form.valid && this.validate()) {
      this.loading.submitting = true;
      let register = form.value as patientRegistration;
      register = {
        ...register,
        uhid: this.submitClass.uhid,
        date: this.submitClass.date.value.format('DD-MMM-YYYY'),
        dOB: this.submitClass.dOB.value?.format('DD-MMM-YYYY')
      }

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      });
      const reg = await this.http.post(this.lService.__apiURL__ + '/Common/RegisterPatient', register, { headers: token_header });
      reg.subscribe({
        next: (data) => {
          const obj = JSON.parse(JSON.stringify(data));
          if (obj.status) {
            alert(obj.message);
            window.location.reload();
          }
          else {
            alert(obj.message);
          }
          this.loading.submitting = false;
        },
        error: () => {
          alert('Unable to Register Patient.');
          this.loading.submitting = false;
        }
      })

    }

  }

  public resetClick(form: NgForm) {
    this.loading.resetting = true;
    setTimeout(() => {

      this.submitClass = new patientRegistration();
      this.formValues.age = '';
      this.states = [];
      this.cities = [];
      this.getUhid();

      this.loading.resetting = false;
    }, 500);
  }

  public validate(): boolean {
    return true;
  }
}

interface countryResponse {
  allCountries: any[]
}

interface statesResponse {
  allStates: any[]
}

interface citiesResponse {
  allCities: any[]
}

interface uhidResponse {
  uhid: string
}

class patientRegistration {
  uhid: string = '';
  date: FormControl = new FormControl(moment());
  salutation: string = '';
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  dOB: FormControl = new FormControl();
  maritalStatus: string = '';
  guardian: string = '';
  guardianName: string = '';
  bloodGroup: string = '';
  occupation: string = '';
  religion: string = '';
  mobNumber: string = '';
  secMobNumber: string = '';
  localAddress: string = '';
  countryId: string = '';
  stateId: string = '';
  cityId: string = '';
  pinCode: string = '';
  email: string = '';
  documentType: string = '';
  documentNumber: string = '';
}