import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../../login.service';
import { Observable, from, startWith, switchMap } from 'rxjs';
import { DateComponent } from '../../../../shared/inputs/date/date.component';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { AutoCompleteComponent } from '../../../../shared/inputs/auto-complete/auto-complete.component';
import { ConstantsService } from '../../../../constants.service';
import { DropDownComponent } from '../../../../shared/inputs/drop-down/drop-down.component';
import { Title } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

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
    AutoCompleteComponent,
    DropDownComponent,
    MatRadioModule,
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
  @ViewChild('uhid') uhid!: AutoCompleteComponent;

  public loading = {
    resetting: false,
    submitting: false
  }

  public managementClass: ManagementClass = {
    uhid: '',
    date: new FormControl({ value: '', disabled: true }),
    appointment: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mStatus: '',
    countryId: '',
    stateId: '',
    cityId: '',
    pinCode: '',
    address: '',
    mobile: '',
    secMobile: '',
    email: '',
    company: '',
    refLetterNo: '',
    idCardNo: '',
    department: '',
    unit: '',
    consultation: '',
    consultationCharge: '',
    doctor: '',
    refBy: '',
    discountAmt: '',
    disApprovedBy: '',
    chiefComplains: '',
    paidAmount: '',
    mlc: false,
    religion: '',
    paymentMode: 0
  };

  public age: string = '';
  private apiUrl = this.lService.__apiURL__;
  public mStatusList: any[] = this.getMStatusList();
  public countriesList: any[];
  public statesList: any[];
  public citiesList: any[];
  public companiesList: any[];
  public departmentList: any[];
  public unitList: any[];
  public consultationList: any[];
  public doctorList: any[];
  public refDocList: any[];
  public disApprovedByList: any[];
  public chiefComplainsList: any[];
  public religionList: any[];
  public paymentModes: any[];

  uhidControl = new FormControl('');
  opidControl = new FormControl('');
  uhidoptions: string[] = [];
  opidoptions: string[] = [];
  uhidfilteredOptions: Observable<string[]> = new Observable<string[]>;
  opidfilteredOptions: Observable<string[]> = new Observable<string[]>;

  constructor(private http: HttpClient, private lService: LoginService, private constants: ConstantsService, private titleS: Title) {
    this.countriesList = this.getCountries();
    this.statesList = [];
    this.citiesList = [];
    this.companiesList = this.getCompanies();
    this.departmentList = this.getdepartmentList();
    this.unitList = [];
    this.consultationList = this.constants.consultationList;
    this.doctorList = this.getDoctors();
    this.refDocList = this.getReferredDoctors();
    this.disApprovedByList = this.getDiscountApprovedByList();
    this.chiefComplainsList = this.getAllChiefComplains();
    this.religionList = this.getAllReligion();
    this.paymentModes = this.constants.paymentModes;
  }

  ngAfterViewInit() {
    this.uhid.focusInput();
  }

  async ngOnInit() {
    this.titleS.setTitle('OPD Management');

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
  public countryChanged($event: string) {
    this.statesList = [];
    this.citiesList = [];
    const stateList = this.setStates($event);
    this.statesList = stateList;
  }
  public stateChanged($event: string) {
    this.citiesList = [];
    const cityList = this.setCities($event, this.managementClass.countryId);
    this.citiesList = cityList;
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
  public departmentChanged($event: any) {
    const getUnits = this.getAllUnits();
    this.unitList = getUnits;
  }
  public getAllUnits(): any[] {
    const units: any[] = [];
    if (typeof localStorage !== 'undefined') {

      const token_header = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      });

      const unitsList = this.http.get<unitsResponse>(this.lService.__apiURL__ + '/Common/GetAllUnits', {
        headers: token_header, params: {
          'department': this.managementClass.department
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
  public getConsultationCharge(): string {
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const consultCharge = this.http.get<consultChargeResponse>(this.lService.__apiURL__ + '/Common/GetConsultationCharge', {
      headers: token_header, params: {
        'docId': this.managementClass.doctor
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
        'docId': this.managementClass.department
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
  public resetClick() {
    this.loading.resetting = true;
    setTimeout(() => {

      this.loading.resetting = false;
    }, 500);
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
interface uhidResponse {
  uhids: string[];
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
interface companyResponse {
  allCompanies: any[]
}
interface departmentResponse {
  allDepartments: any[]
}
interface unitsResponse {
  allUnits: any[];
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