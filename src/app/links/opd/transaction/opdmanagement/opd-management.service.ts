import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../../../../login.service';
import { FormControl } from '@angular/forms';
import { ConstantsService } from '../../../../constants.service';
import { UserData, citiesResponse, companyResponse, departmentResponse, statesResponse, unitsResponse, bankResponse, latestOpidResponse, GotDepartment, consultationTypeResponse, FinalData, submitResponse } from '../../../../links/opd/transaction/opdmanagement/interfaces';
import {
  chiefComplainsResponse, disApprovedByResponse, doctorResponse, consultChargeResponse, patientDataResponse, uhidResponse,
  opidResponse, countryResponse
} from '../../../../links/opd/transaction/opdmanagement/interfaces';

import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { DoctorMasterService } from '../../../admin/master/doctor-master/doctor-master.service';
import { Department } from '../../../admin/master/department-master/department-master.service';
const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root'
})
export class OpdManagementService {
  constructor(private http: HttpClient, private lService: LoginService, private constants: ConstantsService, private docService: DoctorMasterService) { }

  private apiUrl = this.lService.__apiURL__;

  public mClass = new managementClass();

  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  public fillData(user: UserData, managementClass: managementClass): any {
    managementClass.date = new FormControl({ value: user.Date, disabled: true });
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

    return { 'age': this.constants.calculateAge(moment(user.DOB)) }
  }

  public async getRegisteredPatientData(selectedUhid: string): Promise<UserData> {
    const data = await new Promise<any>((resolve, reject) => {
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

  public getOpid(): Promise<string> {
    const toSend = new Promise<string>(resolve => {
      if (typeof localStorage !== 'undefined') {
        const uhid = this.http.get<latestOpidResponse>(this.apiUrl + '/Common/GetLatestOPID', { headers: this.token });

        uhid.subscribe({
          next: (data) => {
            resolve(data.opid);
          },
          error: (err) => {
            return resolve('');
          }
        });
      }
    })
    return toSend;
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

  public async checkIfUhidExists(value: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const data = this.http.get<uhidResponse>(this.apiUrl + '/Common/getUhidStartsWith', {
        headers: this.token, params: {
          'startsWith': value,
          'exact': true
        }
      });

      data.subscribe({
        next: (response) => {
          resolve(response.uhids.length > 0);
        },
        error: () => {
          resolve(false);
        }
      });
    })
  }

  public getOpids(startWith: string): Promise<string[]> {
    const toSend = new Promise<string[]>(resolve => {

      if (startWith === '') {
        resolve([]);
      }

      const token = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const data = this.http.get<opidResponse>(this.apiUrl + '/OPD/GetOpidStartsWith', {
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

  public getCompanies(): any[] {
    const companies: any[] = []
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allCompanies = this.http.get<companyResponse>(this.lService.__apiURL__ + "/Common/getAllCompanies", { headers: token_header });

      allCompanies.subscribe({
        next: (data) => {
          const companiesData: any[] = data.allCompanies;
          companiesData.forEach(company => {
            companies.push({ key: company.key, value: company.value });
          })
        }
      });
    }
    return companies;
  }

  public getBanks(): string[] {
    const banks: any[] = []
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      });

      const allBanks = this.http.get<bankResponse>(this.lService.__apiURL__ + "/Bank/getAllBanks", { headers: token_header });

      allBanks.subscribe({
        next: (data) => {
          const banksData: any[] = data.allBanks;
          banksData.forEach(bank => {
            banks.push({ key: bank.bankId, value: bank.bankName });
          })
        }
      });
    }
    return banks;
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

  public setCities(state: string, country: string): Promise<any[]> {
    const cityData = new Promise<any[]>(resolve => {
      const cityList: any[] = [];
      if (typeof localStorage !== 'undefined') {

        const citiesList = this.http.get<citiesResponse>(this.lService.__apiURL__ + '/Common/GetCitiesByCountryAndState', {
          headers: this.token, params: {
            'country': country,
            'state': state
          }
        });

        citiesList.subscribe({
          next: (data) => {
            const obj: any[] = data.allCities;
            for (let city of obj) {
              cityList.push({ key: city.id, value: city.name });
            }
            resolve(cityList);
          }
        });
      }
    });
    return cityData;
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
  public getMStatusList(): any[] {
    const list = this.constants.maritalStatusList;
    const retList: any[] = [];
    list.forEach(l => {
      retList.push(l);
    });
    return retList;
  }
  public paymentTypeList(): any[] {
    const list = this.constants.paymentTypeList;
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

      const allDepartments = this.http.get<departmentResponse>(this.lService.__apiURL__ + "/Department/GetAllDepartments", { headers: token_header });

      allDepartments.subscribe({
        next: (data) => {
          const obj: Department[] = data.allDepartments;
          obj.forEach(x=> {
            departments.push({key:x.departmentId,value:x.departmentName})
          });
        }
      });
    }
    return departments;
  }
  public consultationSelect(uhid: string): Promise<string> {
    return new Promise<string>((resolve) => {
      debugger;
      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
  
      const consultCharge = this.http.get<consultationTypeResponse>(this.lService.__apiURL__ + '/OPD/GetConsultationType', {
        headers: token_header, params: {
          'uhid': uhid,
          'before': this.constants.nDaysForNewConsultation
        }
      });

      consultCharge.subscribe({
        next: (data) => {
          resolve(data.whichConsultation);
        }
      });
    });
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
    const doctors: any[] = []
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allDoctors = this.http.get<doctorResponse>(this.lService.__apiURL__ + "/Doctor/GetAllDoctors", { headers: token_header });

      allDoctors.subscribe({
        next: (data) => {
          const doctorsData: any[] = data.allDoctors;
          doctorsData.forEach(doctor => {
            doctors.push({ key: doctor.doctorId, value: doctor.doctorName });
          })
        }
      });
    }
    return doctors;
  }
  public getDepartmentAndChargeOfDoctor(doctorId: number, whichConsultation: string): Promise<number[]> {
    return new Promise<number[]>(async (resolve) => {
      if(whichConsultation.trim() === '') {
        resolve([0,-1]);
      }
      if (typeof localStorage !== 'undefined') {
        const token_header = new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
  
        const departments = this.http.get<GotDepartment>(this.lService.__apiURL__ + "/Department/GetDepartmentOfDoctor", { headers: token_header, params: {
          'docId':doctorId,
          'whichConsultation': parseInt(whichConsultation)
        }});
  
        departments.subscribe({
          next: (data) => {
            resolve([data.department, data.consultationCharge]);
          },
          error: () => {
            resolve([0,0]);
          }
        });
      }
    });
  }
  public getReferredDoctors(): any[] {
    const doctors: any[] = []
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const allDoctors = this.http.get<doctorResponse>(this.lService.__apiURL__ + "/Doctor/GetAllDoctors", { headers: token_header, params: {
        'referringDoctors': true
      }});

      allDoctors.subscribe({
        next: (data) => {
          const doctorsData: any[] = data.allDoctors;
          doctorsData.forEach(doctor => {
            doctors.push({ key: doctor.doctorId, value: doctor.doctorName });
          })
        }
      });
    }
    return doctors;
  }
  public getDiscountApprovedByList(): any[] {
    const allEmployees: any[] = [];
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const employees = this.http.get<disApprovedByResponse>(this.lService.__apiURL__ + '/Employee/getAllAuthorizedEmployees', {
      headers: token_header
    });

    employees.subscribe({
      next: (data) => {
        const empData: any[] = data.allAuthorizedEmployees;
        empData.forEach(x => {
          allEmployees.push(x);
        });
      }
    })
    return allEmployees;
  }
  public async getAllChiefComplains(): Promise<any[]> {
    return new Promise<any[]>(async (resolve) => {
      const newComp = this.http.get<any[]>(this.apiUrl + '/Common/getAllChiefComplaints', { headers: this.token });
      newComp.subscribe({
       next: (data) => {
        resolve(data);
       },
       error: (error) => {
        resolve([]);
       }
      });
     });
  }

  public submit(data: FinalData, token: string | null):Promise<number> {
    return new Promise<number>(async (resolve) => {
      const request = this.http.post<submitResponse>(this.apiUrl + '/OPD/submitOpdData', { prn: data, token: token }, { headers: this.token });
      request.subscribe({
        next: (response) => {
          if(response.status > 0) {
            resolve(1);
          }
        },
        error: (error) => {
          resolve(0);
        }
      })
    });
  }

  public getAllReligion(): any[] {
    const religions: any[] = this.constants.religionList;
    return religions;
  }
  public convertToInt(str: string): number {
    return parseFloat(str);
  }

  public validate(x: FinalData):boolean {
    if(x.Date === null || x.Uhid === '' || x.Opid === '' || x.Company === 0 || x.Doctor === 0 || x.Department === 0 || x.ReferredBy === 0 || x.ChiefComplaints === 0)  {
      alert('Please enter all necessary details');
      return false;
    }
    if(x.DiscountAmount > 0) {
      if(x.DiscountApprovedBy === 0) {
        alert('Please enter Discount Approved By');
        return false;
      }
    }
    if(x.PaidAmount > 0) {
      if(x.PaymentMode == 0) {
        alert('Enter Payment Mode');
        return false;
      }
      else if(x.PaymentMode == 2) {
        if(x.BankName === 0) {
          alert('Please enter bank name');
          return false;
        }
        if(x.ChequeDate === null) {
          alert('Please enter Cheque Date');
          return false;
        }
        if(x.ChequeNo === '') {
          alert('Please enter Cheque Number');
          return false;
        }
        if(x.ChequeAmount === null) {
          alert('Please enter Cheque Amount');
          return false;
        }
      }
      else if(x.PaymentMode == 3) {
        if(x.PaymentType !== 'UPI') {
          if(x.CardNo === '') {
            alert('Please enter card No.');
            return false;
          }
          if(x.BankName === 0) {
            alert('Please enter bank name');
            return false;
          }
          if(x.ReferenceNo === '') {
            alert('Please enter Reference Number');
            return false;
          }
        }
        else {
          if(x.UPIID === '') {
            alert('Please enter UPI ID');
            return false;
          }
          if(x.ReferenceNo === '') {
            alert('Please enter Reference Number');
            return false;
          }
        }
      }
    }
    return true;
  }
}

export class managementClass {
  uhid: string;
  date: FormControl;
  appointment: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mStatus: string;
  countryId: string;
  stateId: string;
  cityId: string;
  pinCode: string;
  address: string;
  mobile: string;
  secMobile: string;
  email: string;
  company: string;
  refLetterNo: string;
  idCardNo: string;
  department: string;
  unit: string;
  consultation: string;
  consultationCharge: string;
  doctor: string;
  refBy: string;
  discountAmt: string;
  disApprovedBy: string;
  chiefComplains: string;
  paidAmount: string;
  mlc: boolean;
  religion: string;
  paymentMode: number;
  bankName: string;
  chequeDate: FormControl;
  chequeNo: string;
  chequeAmount: string;
  paymentType: string;
  referenceNo: string;
  cardNo: string;
  UPIID: string;

  constructor() {
    this.uhid = '';
    this.date = new FormControl({ value: '', disabled: true });
    this.appointment = '';
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.mStatus = '';
    this.countryId = '';
    this.stateId = '';
    this.cityId = '';
    this.pinCode = '';
    this.address = '';
    this.mobile = '';
    this.secMobile = '';
    this.email = '';
    this.company = '';
    this.refLetterNo = '';
    this.idCardNo = '';
    this.department = '';
    this.unit = '';
    this.consultation = '';
    this.consultationCharge = '';
    this.doctor = '';
    this.refBy = '';
    this.discountAmt = '';
    this.disApprovedBy = '';
    this.chiefComplains = '';
    this.paidAmount = '0';
    this.mlc = false;
    this.religion = '';
    this.paymentMode = 0;
    this.bankName = '';
    this.chequeDate = new FormControl('');
    this.chequeNo = '';
    this.chequeAmount = '0';
    this.paymentType = '';
    this.referenceNo = '';
    this.cardNo = '';
    this.UPIID = '';
  }
}