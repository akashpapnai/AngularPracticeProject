import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, from, startWith, switchMap } from 'rxjs';
import { DateComponent } from '../../../../shared/inputs/date/date.component';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { AutoCompleteComponent } from '../../../../shared/inputs/auto-complete/auto-complete.component';
import { ConstantsService } from '../../../../constants.service';
import { DropDownComponent } from '../../../../shared/inputs/drop-down/drop-down.component';
import { Title } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { OpdManagementService } from '../../../../services/opd-management.service';
import { ActivatedRoute } from '@angular/router';
import { UserData } from './interfaces';

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



  public age: string = '';
  public mStatusList: any[] = this.service.getMStatusList();
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
  public managementClass = this.service.mClass;
  public idFromUrl: string = '';

  uhidControl = new FormControl('');
  opidControl = new FormControl('');
  uhidoptions: string[] = [];
  opidoptions: string[] = [];
  uhidfilteredOptions: Observable<string[]> = new Observable<string[]>;
  opidfilteredOptions: Observable<string[]> = new Observable<string[]>;

  constructor(private constants: ConstantsService, private titleS: Title, private service: OpdManagementService, private router: ActivatedRoute) {
    this.countriesList = this.service.getCountries();
    this.statesList = [];
    this.citiesList = [];
    this.companiesList = this.service.getCompanies();
    this.departmentList = this.service.getdepartmentList();
    this.unitList = [];
    this.consultationList = this.constants.consultationList;
    this.doctorList = this.service.getDoctors();
    this.refDocList = this.service.getReferredDoctors();
    this.disApprovedByList = this.service.getDiscountApprovedByList();
    this.chiefComplainsList = this.service.getAllChiefComplains();
    this.religionList = this.service.getAllReligion();
    this.paymentModes = this.constants.paymentModes;
  }

  ngAfterViewInit() {
    this.uhid.focusInput();
  }

  async ngOnInit() {
    this.titleS.setTitle('OPD Management');

    this.router.paramMap.subscribe(async params => {
      if (params.get('id') !== '') {
        this.uhidControl = new FormControl(params.get('id'));
      }
      this.uhidoptions = await this.service.getUhids(this.uhidControl.value ?? '');

      this.uhidfilteredOptions = this.uhidControl.valueChanges.pipe(
        startWith(this.uhidControl.value),
        switchMap(value => from(this._uhidfilter(value || ''))),
      );

      this.opidoptions = await this.service.getOpids('o');
      this.opidfilteredOptions = this.opidControl.valueChanges.pipe(
        startWith('o'),
        switchMap(value => from(this._opidfilter(value || ''))),
      );
    });
  }

  public async onUhidChange(event: any) {
    const selectedUhid: string = event;
    const data = await this.service.getRegisteredPatientData(selectedUhid);
    const user = data as UserData;
    const outReachData = this.service.fillData(user, this.managementClass);
    this.age = outReachData.age;
    await this.countryChanged(this.managementClass.countryId);

    this.managementClass.stateId = user.StateId;

    await this.stateChanged(this.managementClass.stateId);
    this.managementClass.cityId = user.CityId;

    console.log(this.managementClass);
  }

  public getConsultationCharge(): string {
    return this.service.getConsultationCharge();
  }

  public convertToInt(str: string): number {
    return this.service.convertToInt(str);
  }

  private async _uhidfilter(value: string): Promise<string[]> {

    this.uhidoptions = await this.service.getUhids(value);

    const filterValue = value.toLowerCase();

    return this.uhidoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private async _opidfilter(value: string): Promise<string[]> {

    this.opidoptions = await this.service.getOpids(value);

    const filterValue = value.toLowerCase();

    return this.opidoptions.filter(option => option.toLowerCase().includes(filterValue));
  }


  public async countryChanged($event: string): Promise<void> {
    this.citiesList = [];
    this.statesList = await this.service.setStates($event);
  }

  public async stateChanged($event: string): Promise<void> {   
      this.citiesList = [];
      this.citiesList = await this.service.setCities($event, this.managementClass.countryId);
  }
  public departmentChanged($event: any) {
    const getUnits = this.service.getAllUnits();
    this.unitList = getUnits;
  }

  public resetClick() {
    this.loading.resetting = true;
    setTimeout(() => {
      this.loading.resetting = false;
    }, 500);
  }
}