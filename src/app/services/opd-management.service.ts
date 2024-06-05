import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';
import { FormControl } from '@angular/forms';
import { ConstantsService } from '../constants.service';
import { UserData, citiesResponse, companyResponse, departmentResponse, statesResponse, unitsResponse } from '../links/opd/transaction/opdmanagement/interfaces';
import { chiefComplainsResponse, disApprovedByResponse, doctorResponse, consultChargeResponse, patientDataResponse, uhidResponse,
  opidResponse, countryResponse
 } from '../links/opd/transaction/opdmanagement/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OpdManagementService {
  constructor(private http: HttpClient, private lService: LoginService, private constants: ConstantsService) { }

  private apiUrl = this.lService.__apiURL__;

  public mClass = new managementClass();

  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  public fillData(user: UserData, managementClass: managementClass):any {
    managementClass.firstName = user.FirstName;
    managementClass.middleName = user.MiddleName;
    managementClass.lastName = user.LastName;
    managementClass.countryId = user.CountryId;
    managementClass.mStatus = user.MaritalStatus;
    managementClass.address = user.LocalAddress;
    managementClass.pinCode = user.PinCode;
    managementClass.mobile = user.MobNumber;
    managementClass.secMobile = user.SecMobNumber;
    managementClass.email = user.Email;
    managementClass.religion = user.Religion;

    return {'stateId': user.StateId, 'cityId': user.CityId}
  }

  public async getRegisteredPatientData(selectedUhid: string): Promise<UserData> {
    const data = await new Promise<any>((resolve,reject) => {
      let record = this.http.get<patientDataResponse>(this.apiUrl + '/Common/getPatientDataByUhid', {
        headers: this.token, params: {
          'uhid': selectedUhid
        }
      });

      record.subscribe({
        next: (response) => {
          resolve(response.patientData);
        },
        error: () => {
          reject('Failed to get data');
        }
      })
    });
    return data;
  }

  public getUhids(startWith: string): Promise<string[]> {
    const toSend = new Promise<string[]>(resolve => {

      if (startWith === '') {
        resolve([]);
      }

      const data = this.http.get<uhidResponse>(this.apiUrl + '/Common/getUhidStartsWith', {
        headers: this.token, params: {
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

      const allCountries = this.http.get<countryResponse>(this.lService.__apiURL__ + "/Common/getAllCountries", { headers: token_header });

      allCountries.subscribe({
        next: (data) => {
          const obj: any[] = data.allCountries;
          for (let country of obj) {
            countries.push({ key: country.iso2, value: country.name });
          }
        }
      });
    }
    return countries;
  }

  public async setStates($event: string) {
    const stateData = new Promise<any[]>(resolve => {
      const stateList: any[] = [];
      if (typeof localStorage !== 'undefined') {
  
        const statesList = this.http.get<statesResponse>(this.lService.__apiURL__ + '/Common/GetStatesByCountry', {
          headers: this.token, params: {
            'country': $event
          }
        });
  
        statesList.subscribe({
          next: (data) => {
            const obj: any[] = data.allStates;
            for (let state of obj) {
              stateList.push({ key: state.iso2, value: state.name });
            }
            resolve(stateList);
          }
        })
      }
    });
    return stateData;
  }

  public setCities(state: string, country: string): any[] {
    const cities: any[] = [];
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const citiesList = this.http.get<citiesResponse>(this.lService.__apiURL__ + '/Common/GetCitiesByCountryAndState', {
        headers: token_header, params: {
          'country': country,
          'state': state
        }
      });

      citiesList.subscribe({
        next: (data) => {
          const obj: any[] = data.allCities;
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
      retList.push(l);
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

class managementClass {
  uhid = '';
  date = new FormControl({ value: '', disabled: true });
  appointment = '';
  firstName = '';
  middleName = '';
  lastName = '';
  mStatus = '';
  countryId = '';
  stateId = '';
  cityId = '';
  pinCode = '';
  address = '';
  mobile = '';
  secMobile = '';
  email = '';
  company = '';
  refLetterNo = '';
  idCardNo = '';
  department = '';
  unit = '';
  consultation = '';
  consultationCharge = '';
  doctor = '';
  refBy = '';
  discountAmt = '';
  disApprovedBy = '';
  chiefComplains = '';
  paidAmount = '';
  mlc = false;
  religion = '';
  paymentMode = 0
};