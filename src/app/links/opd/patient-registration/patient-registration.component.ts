import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FormsModule, NgForm } from '@angular/forms';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { LoginService } from '../../../login.service';
import { ConstantsService } from '../../../constants.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

interface countryResponse {
  allCountries: any[]
}

interface statesResponse {
  allStates: any[]
}

interface citiesResponse {
  allCities: any[]
}

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatDatepickerModule,
    HttpClientModule
  ],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss',
  providers: [
    provideNativeDateAdapter()
  ]
})
export class PatientRegistrationComponent implements OnInit {

  constructor(
    private lService: LoginService, 
    private constants: ConstantsService,
    private http: HttpClient
  ) {}

  public countries: any[] = [];
  public states: any[] = [];
  public cities: any[] = [];
  public dropDownValues = { currCountry: '', currState: '', currCity: '', guardian:'',dSelect: '' };
  public formValues = { 
    age:'', 
    guardianList: this.constants.guardiansList,
    mStatusList: this.constants.maritalStatusList,
    bGroup: this.constants.bloodGroupList,
    religion: this.constants.religionList,
    documents: this.constants.documentsList
  }
  maxDate: Date = new Date();

  ngOnInit(): void {
    const apiURL = this.lService.__apiURL__;
    
    if(typeof localStorage !== 'undefined') {
      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allCountries = this.http.get(apiURL+"/Common/getAllCountries",{headers:token_header});

      allCountries.subscribe({
        next: (data) => {
          const objC:countryResponse = data as countryResponse;
          const obj: any[] = objC.allCountries;
          for (let country of obj) {
            this.countries.push({ id: country.iso2, name: country.name });
          }
        }
      })
    }
  }

  public async countrySelected() {
    this.dropDownValues.currState = '';
    this.states = [];
    this.dropDownValues.currCity = '';
    this.cities = [];

    if(typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const statesList = await this.http.get(this.lService.__apiURL__ + '/Common/GetStatesByCountry', {headers:token_header,params: {
        'country': this.dropDownValues.currCountry
      }});

      statesList.subscribe({
        next: (data) => {
          const objS:statesResponse = data as statesResponse;
          const obj: any[] = objS.allStates;
          for (let state of obj) {
            this.states.push({ id: state.iso2, name: state.name });
          }
        }
      })
    }
  }

  public async stateSelected() {
    this.dropDownValues.currCity = '';
    this.cities = [];

    if(typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const citiesList = await this.http.get(this.lService.__apiURL__ + '/Common/GetCitiesByCountryAndState', {headers:token_header,params: {
        'country': this.dropDownValues.currCountry,
        'state': this.dropDownValues.currState
      }});

      citiesList.subscribe({
        next: (data) => {
          const objCT:citiesResponse = data as citiesResponse;
          const obj: any[] = objCT.allCities;
          for (let city of obj) {
            this.cities.push({ id: city.iso2, name: city.name });
          }
        }
      })
    }
  }

  public calculateAge(dob: Date) {
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    this.formValues.age = age.toString() + ' years';
  }

  registerPatient(form: NgForm) {
    if(form.valid) {
      console.log('Submit');
      console.log(form);
    }
  }

  public resetClick(form: NgForm) {
    if(form.valid) {
      console.log('Reset');
      console.log(form);
    }
  }
}
