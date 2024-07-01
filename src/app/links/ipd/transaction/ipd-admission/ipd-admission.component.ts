import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { DateComponent } from '../../../../shared/inputs/date/date.component';
import { DropDownComponent } from '../../../../shared/inputs/drop-down/drop-down.component';
import { Title } from '@angular/platform-browser';
import { IpdAdmission, IpdAdmissionService, admissionData } from './ipd-admission.service';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { AutoCompleteComponent } from '../../../../shared/inputs/auto-complete/auto-complete.component';
import { Observable, from, startWith, switchMap } from 'rxjs';
import { UserData } from '../../../opd/transaction/opdmanagement/interfaces';
import { OpdManagementService } from '../../../opd/transaction/opdmanagement/opd-management.service';

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
  selector: 'app-ipd-admission',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    TextFieldComponent,
    DateComponent,
    DropDownComponent,
    AutoCompleteComponent,
    ReactiveFormsModule
  ],
  templateUrl: './ipd-admission.component.html',
  styleUrl: './ipd-admission.component.scss',
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMATS)
  ],
})
export class IpdAdmissionComponent {
  @ViewChild('uhid') uhid!: AutoCompleteComponent;

  public countriesList: any[] = [];
  public statesList: any[] = [];
  public citiesList: any[] = [];
  public userTypeList: any[] = [];
  public maritalStatusList: any[] = [];
  public religionList: any[] = [];
  public admittingDocList: any[] = [];
  public departmentList: any[] = [];
  public wardList: any[] = [];
  public bedList: any[] = [];

  public admissionData: IpdAdmission;
  public uhidControl: FormControl = new FormControl('');
  public uhidControlOptions: Observable<string[]> = new Observable<string[]>;
  public uhidOptions: string[] = [];
  public uhidfilteredOptions: Observable<string[]> = new Observable<string[]>;
  public ipidControl: FormControl = new FormControl('');
  public ipidControlOptions: Observable<string[]> = new Observable<string[]>;
  public ipidOptions: string[] = [];
  public ipidfilteredOptions: Observable<string[]> = new Observable<string[]>;

  constructor(private title: Title, private service: IpdAdmissionService, private mngmtSrvc: OpdManagementService) {
    this.admissionData = admissionData;
  }
  async ngOnInit() {
    this.title.setTitle('IPD Admission');
    this.userTypeList = this.service.getUserType();
    this.maritalStatusList = this.service.getMaritalStatus();
    this.religionList = this.service.getReligion();

    const [uhidList, ipidList, allCountries, allDoctors, allDepartments, allWard] = await Promise.all([
      this.mngmtSrvc.getUhids(this.uhidControl.value),
      this.service.getIpids(this.uhidControl.value),
      this.service.getAllCountries(),
      this.mngmtSrvc.getDoctors(),
      this.mngmtSrvc.getdepartmentList(),
      this.service.getWards(null)
    ]);

    this.uhidOptions = uhidList;
    this.ipidOptions = ipidList;
    this.admittingDocList = allDoctors;
    this.departmentList = allDepartments;
    this.wardList = allWard;
    allCountries.forEach(x => { this.countriesList.push({ key: x.iso2, value: x.name }) });

    this.uhidfilteredOptions = this.uhidControl.valueChanges.pipe(
      startWith(this.uhidControl.value),
      switchMap(value => from(this._uhidfilter(this.uhidControl.value))),
    );

    this.ipidfilteredOptions = this.ipidControl.valueChanges.pipe(
      startWith(this.ipidControl.value),
      switchMap(value => from(this._ipidfilter(this.ipidControl.value))),
    );

  }

  ngAfterViewInit() {
    debugger;
    this.uhid.focusInput();
  }

  private async _uhidfilter(value: string): Promise<string[]> {
    this.uhidOptions = await this.mngmtSrvc.getUhids(value);
    const filterValue = value.toLowerCase();
    return this.uhidOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private async _ipidfilter(value: string): Promise<string[]> {
    this.ipidOptions = await this.service.getIpids(value);
    const filterValue = value.toLowerCase();
    return this.ipidOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  public async onUhidChange(event: string) {
    const selectedUhid: string = event;
    const data: UserData = await this.mngmtSrvc.getRegisteredPatientData(selectedUhid);
    this.service.fillData(data, this.admissionData);
    await this.countryChanged(this.admissionData.CountryId);

    this.admissionData.StateId = data.StateId;

    await this.stateChanged(this.admissionData.StateId);
    this.admissionData.CityId = data.CityId;
  }

  public async stateChanged($event: string): Promise<void> {
    this.citiesList = [];
    this.citiesList = await this.mngmtSrvc.setCities($event, this.admissionData.CountryId);
  }

  public async wardChanged(wardId: number) {
    const allBeds = this.service.getBeds(wardId, null);
  }

  public async onIpidChange(event: string) {
    const selectedUhid: string = event;
    const data: UserData = await this.mngmtSrvc.getRegisteredPatientData(selectedUhid);
    this.service.fillData(data, this.admissionData);
    await this.countryChanged(this.admissionData.CountryId);
  }

  public async countryChanged($event: string): Promise<void> {
    debugger;
    this.citiesList = [];
    this.statesList = await this.mngmtSrvc.setStates($event.toString());
  }

  public async admittingDocChanged(docId: number) {
    const [department, _] = await this.mngmtSrvc.getDepartmentAndChargeOfDoctor(docId,"1");
    this.admissionData.department = department;
  }

  public checkUhid(): void {
    setTimeout(async () => {
      if (this.uhidControl.value !== null && this.uhidControl.value.length > 0) {
        const status = await this.mngmtSrvc.checkIfUhidExists(this.uhidControl.value);
        if (!status) {
          // await this.resetClick();
          this.admissionData.Age = '';
          alert('UHID did not exists');
        }
      }
    }, 500);
  }

  public checkIpid(): void {
    setTimeout(async () => {
      if (this.uhidControl.value !== null && this.uhidControl.value.length > 0) {
        const status = await this.mngmtSrvc.checkIfUhidExists(this.uhidControl.value);
        if (!status) {
          // await this.resetClick();
          this.admissionData.Age = '';
          alert('UHID did not exists');
        }
      }
    }, 500);
  }

}
