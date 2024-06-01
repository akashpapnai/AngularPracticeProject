import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';
import { FormControl } from '@angular/forms';
import { ConstantsService } from '../constants.service';

@Injectable({
  providedIn: 'root'
})
export class OpdManagementService {
  
  constructor(private http:HttpClient, private lService: LoginService, private constants: ConstantsService) { }
  
  private apiUrl = this.lService.__apiURL__;

  public mClass = new managementClass();
  
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

      const data = this.http.get<opidResponse>(this.apiUrl + '/Common/getOpidStartsWith', {
        headers: token, params: {
          'startsWith': startWith
        }
      });

      data.subscribe({
        next: (response) => {
          resolve(response.opids);
        }
      })
    });

    return toSend;
  }

  public getCountries(): string[] {
    const countries: any[] = []
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allCountries = this.http.get(this.lService.__apiURL__ + "/Common/getAllCountries", { headers: token_header });

      allCountries.subscribe({
        next: (data) => {
          const objC: countryResponse = data as countryResponse;
          const obj: any[] = objC.allCountries;
          for (let country of obj) {
            countries.push({ key: country.iso2, value: country.name });
          }
        }
      });
    }
    return countries;
  }

  public setStates($event: string) {
    const stateList: any[] = [];
    if (typeof localStorage !== 'undefined') {
      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const statesList = this.http.get(this.lService.__apiURL__ + '/Common/GetStatesByCountry', {
        headers: token_header, params: {
          'country': $event
        }
      });

      statesList.subscribe({
        next: (data) => {
          const objS: statesResponse = data as statesResponse;
          const obj: any[] = objS.allStates;
          for (let state of obj) {
            stateList.push({ key: state.iso2, value: state.name });
          }
        }
      })
    }
    return stateList;
  }

  public setCities(state: string, country: string): any[] {
    const cities: any[] = [];
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const citiesList = this.http.get(this.lService.__apiURL__ + '/Common/GetCitiesByCountryAndState', {
        headers: token_header, params: {
          'country': country,
          'state': state
        }
      });

      citiesList.subscribe({
        next: (data) => {
          const objCT: citiesResponse = data as citiesResponse;
          const obj: any[] = objCT.allCities;
          for (let city of obj) {
            cities.push({ key: city.id, value: city.name });
          }
        }
      });
    }
    return cities;
  }

  public getAllUnits(): any[] {
    const units: any[] = [];
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const unitsList = this.http.get<unitsResponse>(this.lService.__apiURL__ + '/Common/GetAllUnits', {
        headers: token_header, params: {
          'department': this.mClass.department
        }
      });

      unitsList.subscribe({
        next: (data) => {
          const obj: any[] = data.allUnits;
          for (let unit of obj) {
            units.push({ key: unit.id, value: unit.name });
          }
        }
      });
    }
    return units;
  }
  public getCompanies(): any[] {
    const companies: any[] = []
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allCountries = this.http.get<companyResponse>(this.lService.__apiURL__ + "/Common/getAllCompanies", { headers: token_header });

      allCountries.subscribe({
        next: (data) => {
          const obj: any[] = data.allCompanies;
          for (let country of obj) {
            companies.push({ key: country.iso2, value: country.name });
          }
        }
      });
    }
    return companies;
  }
  public getMStatusList(): any[] {
    const list = this.constants.maritalStatusList;
    const retList: any[] = [];
    list.forEach(l => {
      retList.push({ key: l, value: l });
    });
    return retList;
  }
  public getdepartmentList(): any[] {
    const departments: any[] = []
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allDepartments = this.http.get<departmentResponse>(this.lService.__apiURL__ + "/Common/getAllDepartments", { headers: token_header });

      allDepartments.subscribe({
        next: (data) => {
          const obj: any[] = data.allDepartments;
          for (let country of obj) {
            departments.push({ key: country.iso2, value: country.name });
          }
        }
      });
    }
    return departments;
  }
  public getConsultationCharge(): string {
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const consultCharge = this.http.get<consultChargeResponse>(this.lService.__apiURL__ + '/Common/GetConsultationCharge', {
      headers: token_header, params: {
        'docId': this.mClass.doctor
      }
    });

    consultCharge.subscribe({
      next: (data) => {
        return String(data.consultationCharge);
      }
    });

    return String(0);
  }
  public getDoctors(): any[] {
    const allDoctors: any[] = [];
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const doctors = this.http.get<doctorResponse>(this.lService.__apiURL__ + '/Common/getAllDoctors', {
      headers: token_header, params: {
        'docId': this.mClass.department
      }
    });

    doctors.subscribe({
      next: (data) => {
        const obj: any[] = data.allDoctors;
        for (let doctor of obj) {
          allDoctors.push({ key: doctor.id, value: doctor.name });
        }
      }
    })
    return allDoctors;
  }
  public getReferredDoctors(): any[] {
    const allDoctors: any[] = [];
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const doctors = this.http.get<doctorResponse>(this.lService.__apiURL__ + '/Common/getAllRefDoctors', {
      headers: token_header
    });

    doctors.subscribe({
      next: (data) => {
        const obj: any[] = data.allDoctors;
        for (let doctor of obj) {
          allDoctors.push({ key: doctor.id, value: doctor.name });
        }
      }
    })
    return allDoctors;
  }
  public getDiscountApprovedByList(): any[] {
    const allDoctors: any[] = [];
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const doctors = this.http.get<disApprovedByResponse>(this.lService.__apiURL__ + '/Common/getAllAuthorizedDoctors', {
      headers: token_header
    });

    doctors.subscribe({
      next: (data) => {
        const obj: any[] = data.allAuthorizedDoctors;
        for (let doctor of obj) {
          allDoctors.push({ key: doctor.id, value: doctor.name });
        }
      }
    })
    return allDoctors;
  }
  public getAllChiefComplains(): any[] {
    const chiefComplains: any[] = [];
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const chiefComplainsResp = this.http.get<chiefComplainsResponse>(this.lService.__apiURL__ + '/Common/getAllChiefComplains', {
      headers: token_header
    });

    chiefComplainsResp.subscribe({
      next: (data) => {
        const obj: any[] = data.allComplains;
        for (let doctor of obj) {
          chiefComplains.push({ key: doctor.id, value: doctor.name });
        }
      }
    })
    return chiefComplains;
  }
  public getAllReligion(): any[] {
    const religions: any[] = this.constants.religionList;
    return religions;
  }
  public convertToInt(str: string): number {
    return parseFloat(str);
  }
}

interface ManagementClass {
  appointment: any;
  uhid: string;
  date: FormControl;
  firstName: string;
  middleName: string;
  lastName: string;
  mStatus: string;
  address: string;
  countryId: string;
  stateId: string;
  cityId: string;
  pinCode: string;
  mobile: string;
  secMobile: string;
  email: string;
  company: string;
  refLetterNo: string;
  idCardNo: string;
  department: string;
  unit: string;
  doctor: string;
  consultation: string;
  consultationCharge: string;
  refBy: string;
  discountAmt: string;
  disApprovedBy: string;
  chiefComplains: string;
  paidAmount: string;
  mlc: boolean;
  religion: string;
  paymentMode: number;
}

class managementClass {
  uhid = '';
  date = new FormControl({ value: '', disabled: true });
  appointment= '';
  firstName= '';
  middleName= '';
  lastName= '';
  mStatus= '';
  countryId= '';
  stateId= '';
  cityId= '';
  pinCode= '';
  address= '';
  mobile= '';
  secMobile= '';
  email= '';
  company= '';
  refLetterNo= '';
  idCardNo= '';
  department= '';
  unit= '';
  consultation= '';
  consultationCharge= '';
  doctor= '';
  refBy= '';
  discountAmt= '';
  disApprovedBy= '';
  chiefComplains= '';
  paidAmount= '';
  mlc= false;
  religion= '';
  paymentMode= 0
};

interface uhidResponse {
  uhids: string[];
}

interface opidResponse {
  opids: string[];
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

interface unitsResponse {
  allUnits: any[];
}

interface companyResponse {
  allCompanies: any[]
}
interface departmentResponse {
  allDepartments: any[]
}

interface doctorResponse {
  allDoctors: any[];
}
interface consultChargeResponse {
  consultationCharge: number;
}
interface disApprovedByResponse {
  allAuthorizedDoctors: any[];
}
interface chiefComplainsResponse {
  allComplains: any[];
}