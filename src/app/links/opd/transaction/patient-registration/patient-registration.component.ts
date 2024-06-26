import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConstantsService } from '../../../../constants.service';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DropDownComponent } from '../../../../shared/inputs/drop-down/drop-down.component';
import { PatientRegistration, PatientRegistrationService, formValues } from './patient-registration.service';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { DateComponent } from '../../../../shared/inputs/date/date.component';
import { DialogBoxComponent } from '../../../../shared/dialog-box/dialog-box.component';

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
  styleUrl: './patient-registration.component.scss',
  imports: [
    CommonModule,
    NavbarComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    DropDownComponent,
    TextFieldComponent,
    DateComponent,
    DialogBoxComponent
  ], providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMATS)
  ]
})
export class PatientRegistrationComponent implements OnInit {

  public submitClass = new patientRegistration();
  public countries: any[] = [];
  public states: any[] = [];
  public cities: any[] = [];
  public religionList: any[] = this.constants.religionList;
  public formValues: formValues;
  public patientRegistered = false;

  constructor(
    private constants: ConstantsService,
    private service: PatientRegistrationService
  ) {
    this.countries = this.service.getAllCountries();
    this.formValues = this.service.formValues;
  }


  public loading = {
    resetting: false,
    submitting: false
  }

  public maxDate: Date = new Date();
  public date = new FormControl(moment());

  async ngOnInit(): Promise<any> {
    this.submitClass.uhid = await this.getUhid();
  }

  public async countrySelected() {
    this.cities = [];
    this.states = this.service.countrySelected(this.submitClass);
  }

  public async stateSelected() {
    this.submitClass.cityId = '';
    this.cities = this.service.stateSelected(this.submitClass.countryId, this.submitClass.stateId);

  }

  public calculateAge(dob: Moment) {
    this.formValues.age = this.constants.calculateAge(dob);
  }


  public getUhid(): Promise<string> {
    return new Promise<string>(async (resolve) => {
      resolve(await this.service.getUhid());
    })
  }

  public async registerPatient(form: NgForm) {
    if (form.valid && this.validate()) {
      // this.loading.submitting = true;
      // let register = form.value as patientRegistration;
      // register = {
      //   ...register,
      //   uhid: this.submitClass.uhid,
      //   date: this.submitClass.date.value.format('DD-MMM-YYYY'),
      //   dOB: this.submitClass.dOB.value?.format('DD-MMM-YYYY')
      // }
      // const response = await this.service.registerPatient(register);
      // if (response.status) {
      //   this.patientRegistered = true;
      // }
      // else {
      //   alert(response.message);
      // }

      // this.loading.submitting = false;

      this.loading.submitting = true;
      const pReg: PatientRegistration = {
        Id: null,
        CreatedBy: null,
        CreatedDate: null,
        ModifiedBy: null,
        ModifiedDate: null,
        isActive: true,
        Uhid: this.submitClass.uhid,
        Date: this.submitClass.date.value,
        Salutation: form.value.salutation,
        FirstName: form.value.firstName,
        middleName: form.value.middleName,
        lastName: form.value.lastName,
        DOB: form.value.dOB,
        MaritalStatus: form.value.maritalStatus,
        Guardian: form.value.guardian,
        GuardianName: form.value.guardianName,
        BloodGroup: form.value.bGroup,
        Occupation: form.value.occupation,
        Religion: form.value.religion,
        MobNumber: form.value.mobNumber,
        SecMobNumber: form.value.secMobNumber,
        LocalAddress: form.value.localAddress,
        CountryId: form.value.countryId,
        StateId: form.value.stateId,
        CityId: form.value.cityId,
        PinCode: form.value.pinCode,
        Email: form.value.email,
        DocumentType: form.value.documentType,
        DocumentNumber: form.value.documentNumber
      }
      const response = await this.service.registerPatient(pReg);
      if (response.status) {
        this.patientRegistered = true;
      }
      else {
        alert(response.message);
      }
    }
    else {
      alert('Please enter all required Information');
    }
    this.loading.submitting = false;
  }

  public async resetClick(form: NgForm) {
    this.loading.resetting = true;
    this.submitClass = new patientRegistration();
    this.formValues.age = '';
    this.states = [];
    this.cities = [];
    this.submitClass.uhid = await this.getUhid();

    this.loading.resetting = false;
  }

  public validate(): boolean {
    return true;
  }

  showDialog() {
    this.patientRegistered = true;
  }

  hideDialog() {
    this.patientRegistered = false;
  }
}

class patientRegistration {
  uhid: string = '';
  date: FormControl = new FormControl(moment());
  salutation: string = '';
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  dOB: FormControl = new FormControl('');
  maritalStatus: string = '0';
  guardian: string = '0';
  guardianName: string = '';
  bloodGroup: string = '0';
  occupation: string = '';
  religion: string = '0';
  mobNumber: string = '';
  secMobNumber: string = '';
  localAddress: string = '';
  countryId: string = '';
  stateId: string = '';
  cityId: string = '';
  pinCode: string = '';
  email: string = '';
  documentType: string = '0';
  documentNumber: string = '';
}