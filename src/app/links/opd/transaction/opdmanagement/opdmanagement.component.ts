import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, from, startWith, switchMap, timeout } from 'rxjs';
import { DateComponent } from '../../../../shared/inputs/date/date.component';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { AutoCompleteComponent } from '../../../../shared/inputs/auto-complete/auto-complete.component';
import { ConstantsService } from '../../../../constants.service';
import { DropDownComponent } from '../../../../shared/inputs/drop-down/drop-down.component';
import { Title } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { OpdManagementService, managementClass } from '../../../../services/opd-management.service';
import { ActivatedRoute } from '@angular/router';
import { UserData } from './interfaces';
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
    MatProgressSpinnerModule,
    DialogBoxComponent
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
  public paymentTypeList: any[] = this.service.paymentTypeList();
  public countriesList: any[];
  public statesList: any[];
  public citiesList: any[];
  public bankNamesList: any[];
  public companiesList: any[];
  public departmentList: any[];
  public unitList: any[];
  public consultationList: any[];
  public doctorList: any[];
  public refDocList: any[];
  public disApprovedByList: any[];
  public chiefComplainsList: any[] = [];
  public religionList: any[];
  public paymentModes: any[];
  public managementClass = this.service.mClass;
  public idFromUrl: string = '';
  public openDialog: boolean = false;

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
    this.bankNamesList = this.service.getBanks();
    this.departmentList = this.service.getdepartmentList();
    this.unitList = [];
    this.consultationList = this.constants.consultationList;
    this.doctorList = this.service.getDoctors();
    this.refDocList = this.service.getReferredDoctors();
    this.disApprovedByList = this.service.getDiscountApprovedByList();
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
      this.uhidoptions = await this.service.getUhids(this.uhidControl.value ?? 'u');

      this.uhidfilteredOptions = this.uhidControl.valueChanges.pipe(
        startWith(this.uhidControl.value),
        switchMap(value => from(this._uhidfilter(value || 'u'))),
      );

      const opd = await this.service.getOpid();
      this.opidControl = new FormControl(opd);

      this.opidoptions = await this.service.getOpids('o');
      this.opidfilteredOptions = this.opidControl.valueChanges.pipe(
        startWith('o'),
        switchMap(value => from(this._opidfilter(value || ''))),
      );
    });

    this.chiefComplainsList = await this.service.getAllChiefComplains();
  }

  public checkUhid(): void {
    setTimeout(async () => {
      if (this.uhidControl.value !== null) {
        const status = await this.service.checkIfUhidExists(this.uhidControl.value);
        if (!status) {
          const opidValue = this.opidControl.value;
          await this.resetClick(); 
          this.age = '';
          alert('UHID did not exists');
          this.opidControl = new FormControl(opidValue);

        }
      }
    }, 1);
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

    const whichConsultation:string = await this.service.consultationSelect(this.opidControl.value ?? '');
    this.managementClass.consultation = whichConsultation;
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
  public paidAmountChanged() {
    this.managementClass.paymentMode = 0;
    this.paymentValuesReset();
  }

  public paymentModeChanged() {
    this.paymentValuesReset();
  }
  public paymentTypeChanged() {
    this.managementClass.cardNo = '';
    this.managementClass.UPIID = '';
    this.managementClass.bankName = '';
  }

  public doctorChanged() {
    setTimeout(async () => {
      const deptId = await this.service.getDepartmentOfDoctor(parseInt(this.managementClass.doctor));
      this.managementClass.department = (deptId === 0 ? '' : deptId).toString();
    }, 1);
  }

  private paymentValuesReset() {
    this.managementClass.bankName = '';
    this.managementClass.chequeDate = new FormControl('');
    this.managementClass.chequeNo = '';
    this.managementClass.chequeAmount = '0';
    this.managementClass.paymentType = '';
    this.managementClass.cardNo = '';
    this.managementClass.UPIID = '';
    this.managementClass.referenceNo = '';
  }

  public async resetClick(): Promise<void> {
    return new Promise<void>(async (resolve) => {this.loading.resetting = true;
    
      this.managementClass = new managementClass();
      this.managementClass.uhid = '';
      this.uhidControl = new FormControl('');

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
      this.opidControl = new FormControl('');
      this.opidfilteredOptions = new Observable<[]>;

      this.loading.resetting = false;
      resolve();
  });
  }

  public openDialogBox() {
    this.openDialog = true;
  }
  public async hideDialogBox() {
    this.openDialog = false;
    this.chiefComplainsList = await this.service.getAllChiefComplains();
  }
}