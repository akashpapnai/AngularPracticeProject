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
import { PatientRegistrationService } from '../../../../services/patient-registration.service';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { DateComponent } from '../../../../shared/inputs/date/date.component';

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
    DateComponent
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
  public formValues: any;

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
    this.getUhid();
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


  public async getUhid() {
    this.submitClass.uhid = await this.service.getUhid();
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
      debugger;
      await this.service.registerPatient(register);
      
      this.loading.submitting = false;
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