import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../../../../login.service';
import { ConstantsService } from '../../../../constants.service';

@Injectable({
  providedIn: 'root'
})
export class PatientRegistrationService {

  constructor(private http: HttpClient, private lService: LoginService, private constants: ConstantsService) { }

  private apiURL = this.lService.__apiURL__;
  private token_header = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  public formValues: formValues = {
    guardianList: this.constants.guardiansList,
    mStatusList: this.constants.maritalStatusList,
    bGroup: this.constants.bloodGroupList,
    religion: this.constants.religionList,
    documents: this.constants.documentsList,
    age: ''
  }

  public getAllCountries(): any[] {
    const countries: any[] = [];

    if (typeof localStorage !== 'undefined') {

      const allCountries = this.http.get<countryResponse>(this.apiURL + "/Common/getAllCountries", { headers: this.token_header });

      allCountries.subscribe({
        next: (data) => {
          const obj: any[] = data.allCountries;
          for (let country of obj) {
            countries.push({ id: country.iso2, name: country.name });
          }
        }
      })
    }
    return countries;
  }
  public countrySelected(submitClass: any) {
    submitClass.stateId = '';
    submitClass.cityId = '';
    const states: any[] = [];

    if (typeof localStorage !== 'undefined') {
      const statesList = this.http.get<statesResponse>(this.apiURL + '/Common/GetStatesByCountry', {
        headers: this.token_header, params: {
          'country': submitClass.countryId
        }
      });

      statesList.subscribe({
        next: (data) => {
          const obj: any[] = data.allStates;
          for (let state of obj) {
            states.push({ id: state.iso2, name: state.name });
          }
        }
      });
    }
    return states;
  }
  public getUhid(): Promise<string> {
    const toSend = new Promise<string>(resolve => {
      if (typeof localStorage !== 'undefined') {
        const uhid = this.http.get<uhidResponse>(this.apiURL + '/Common/GetLatestUHID', { headers: this.token_header });

        uhid.subscribe({
          next: (data) => {
            resolve(data.uhid);
          },
          error: (err) => {
            return resolve('');
          }
        });
      }
    })
    return toSend;
  }

  public stateSelected(countryId: string, stateId: string): any[] {
    const cities: any[] = []
    if (typeof localStorage !== 'undefined') {

      const citiesList = this.http.get<citiesResponse>(this.lService.__apiURL__ + '/Common/GetCitiesByCountryAndState', {
        headers: this.token_header, params: {
          'country': countryId,
          'state': stateId
        }
      });

      citiesList.subscribe({
        next: (data) => {
          const obj: any[] = data.allCities;
          for (let city of obj) {
            cities.push({ id: city.id, name: city.name });
          }
        }
      })
    }
    return cities;
  }
  public registerPatient(register: PatientRegistration): Promise<any> {
    return new Promise<any>(resolve => {
      const reg = this.http.post(this.apiURL + '/Common/RegisterPatient', register, { headers: this.token_header });
      reg.subscribe({
        next: (data) => {
          const obj = JSON.parse(JSON.stringify(data));
          if (obj.status) {
            resolve({ 'status': true, 'message': obj.message });
          }
          else {
            resolve({ 'status': false, 'message': obj.message });
          }
        },
        error: () => {
          resolve({ 'status': false, 'message': 'Unable to Register Patient.' });
        }
      });
    });
  }
}

interface countryResponse {
  allCountries: any[]
}

interface statesResponse {
  allStates: any[]
}

interface uhidResponse {
  uhid: string
}

interface citiesResponse {
  allCities: any[]
}

export interface formValues {
  age: string,
  mStatusList: any[],
  guardianList: any[],
  bGroup: any[],
  documents: any[],
  religion: any[]
}

export interface PatientRegistration {
  Id: number | null,
  CreatedBy: number | null,
  CreatedDate: Date | null,
  ModifiedBy: number | null,
  ModifiedDate: Date | null,
  isActive: boolean,
  Uhid: string,
  Date: Date,
  Salutation: string,
  FirstName: string,
  middleName: string,
  lastName: string,
  DOB: Date,
  MaritalStatus: string,
  Guardian: string,
  GuardianName: string,
  BloodGroup: string,
  Occupation: string,
  Religion: string,
  MobNumber: string,
  SecMobNumber: string,
  LocalAddress: string,
  CountryId: string,
  StateId: string,
  CityId: string,
  PinCode: string,
  Email: string,
  DocumentType: string,
  DocumentNumber: string
}