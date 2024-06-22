import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { Title } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateComponent } from '../../../../shared/inputs/date/date.component';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { DropDownComponent } from '../../../../shared/inputs/drop-down/drop-down.component';
import { CompanyMasterService } from '../../../admin/master/company-master/company-master.service';
import { DepartmentMasterService } from '../../../admin/master/department-master/department-master.service';
import { DoctorMasterService } from '../../../admin/master/doctor-master/doctor-master.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { OpdServiceService, PatientDetails, opdObjectResponse } from './opd-service.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import moment from 'moment';
import { AutoCompleteComponent } from '../../../../shared/inputs/auto-complete/auto-complete.component';
import { Observable, from, startWith, switchMap } from 'rxjs';
import { OpdManagementService } from '../opdmanagement/opd-management.service';

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
  selector: 'app-opd-service',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    DateComponent,
    TextFieldComponent,
    AutoCompleteComponent,
    ReactiveFormsModule,
    DropDownComponent,
    CommonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule
  ],
  templateUrl: './opd-service.component.html',
  styleUrl: './opd-service.component.scss',
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMATS)
  ],
})
export class OpdServiceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('procedure') uhid!: AutoCompleteComponent;

  constructor(private title: Title, private service: OpdServiceService, private compServ: CompanyMasterService, private deptServ: DepartmentMasterService, private docServ: DoctorMasterService, private opdServ: OpdManagementService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    this.title.setTitle('OPD Service');
    const [allComp, allDepts, allDocts, allPatients] = await Promise.all([
      this.compServ.getAllCompanies(),
      this.deptServ.getAllDepartments(),
      this.docServ.getAllDoctors(),
      this.service.getnDaysPatients(1)
    ]);

    allComp.forEach(x => {
      this.companiesList.push({ key: x.companyId, value: x.companyName });
    });

    allDepts.forEach(x => {
      this.departmentsList.push({ key: x.departmentId, value: x.departmentName });
    });

    allDocts.forEach(x => {
      this.doctorsList.push({ key: x.doctorId, value: x.doctorName });
    });
    const patients = allPatients;
    this.dataSource = new MatTableDataSource(patients);
    this.dataLoaded = true;

    this.procedureOptions = await this.service.getProcedures((this.procedureControl.value ?? "a"));

    this.procedureControlOptions = this.procedureControl.valueChanges.pipe(
      startWith(this.procedureControl.value),
      switchMap(value => from(this._procedurefilter(value || 'a'))),
    );
  }

  public companiesList: any[] = [];
  public departmentsList: any[] = [];
  public doctorsList: any[] = [];
  public servicesList: any[] = [];
  public subServicesList: any[] = [];
  public referredByList: any[] = [];
  public displayedColumns: string[] = ['opid', 'uhid', 'patientsName', 'companyName', 'admissionDate'];
  public dataSource: MatTableDataSource<opdObjectResponse> = new MatTableDataSource();
  public procedureControlOptions: Observable<string[]> = new Observable<string[]>;
  public procedureOptions: string[] = [];
  public dataLoaded: boolean = false;
  public procedureControl = new FormControl('');
  public patientDetailsLoaded = false;
  public loading: any = {
    resetting: false,
    submitting: false,
  }
  public opdService: opdServiceData = {
    'date': new FormControl({ value: '', disabled: true }),
    'uhid': '',
    'opid': '',
    'receiptNo': '',
    'patientName': '',
    'age': '',
    'departmentId': 0,
    'companyId': 0,
    'type': '',
    'doctorId': 0
  }

  public charge: ChargeSection = {
    service: 0,
    subService: 0,
    doctor: 0,
    quantity: 1,
    charge: 0,
    discountPercent: 0,
    discountRs: 0,
    netCharge: 0,
    
    totalAmount: 0,
    totalDiscount: 0,
    totalCharge: 0,
    paidAmount: 0,
    balanceAmount: 0,
    
    referredBy: 0,
    remarks: ''
  }

  public async tabChanged(event: MatTabChangeEvent) {
    if (event.tab.textLabel === 'Charge') {
      const [allService, referringDoctors] = await Promise.all([
        this.service.getAllServices(),
        this.opdServ.getReferredDoctors()
      ]);

      this.servicesList = allService;
      this.referredByList = referringDoctors;
    }
  }

  public async getSubService() {
    this.subServicesList = await this.service.getAllSubServices(this.charge.service);
  }

  public amountChanged() {
    this.charge.discountPercent = 0;
    this.charge.discountRs = 0;

    this.charge.netCharge = this.charge.charge - this.charge.discountRs;
  }

  public discountPercentChanged() {
    this.charge.discountPercent = parseFloat(this.charge.discountPercent.toString());
    if (isNaN(this.charge.discountPercent)) {
      this.charge.discountPercent = 0;
    }

    this.charge.discountRs = parseFloat(((this.charge.discountPercent / 100) * this.charge.charge).toFixed(2));

    if (this.charge.discountPercent < 0 || this.charge.discountPercent > 100) {
      this.charge.discountPercent = 0;
      this.charge.discountRs = 0;
    }

    this.charge.netCharge = this.charge.charge - this.charge.discountRs;
  }

  public discountRsChanged() {
    this.charge.discountRs = parseFloat(this.charge.discountRs.toString());
    if (isNaN(this.charge.discountRs)) {
      this.charge.discountRs = 0;
    }

    this.charge.discountPercent = (this.charge.charge > 0 ? parseFloat(((this.charge.discountRs / this.charge.charge) * 100).toFixed(2)) : 0);
    if (this.charge.discountRs > this.charge.charge) {
      this.charge.discountPercent = 0;
      this.charge.discountRs = 0;
    }

    this.charge.netCharge = this.charge.charge - this.charge.discountRs;
  }

  public async loadPatientsDetails(opid: string) {
    const data: PatientDetails = await this.service.loadPatientsDetails(opid);
    this.opdService = {
      date: new FormControl({ value: moment(data.date), disabled: true }),
      uhid: data.uhid,
      opid: data.opid,
      receiptNo: data.receiptNo,
      patientName: data.patientsName,
      age: data.age,
      departmentId: data.departmentId,
      companyId: data.companyId,
      type: data.type,
      doctorId: data.doctorId
    }
    this.patientDetailsLoaded = true;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private async _procedurefilter(value: string): Promise<string[]> {
    this.procedureOptions = await this.service.getProcedures(value);

    const filterValue = value.toLowerCase();

    return this.procedureOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  public changeService() {
    setTimeout(async () => {
      if (this.procedureControl.value !== null) {
        this.servicesList = await this.service.getAllServices(this.procedureControl.value);
        if (this.servicesList.length > 0) {
          this.charge.service = this.servicesList[0].key;
          this.subServicesList = await this.service.getAllSubServices(this.charge.service);
          debugger;
          if (this.subServicesList.length > 0) {
            this.charge.subService = this.subServicesList[0].key;
          }
        }
      }
    }, 500);
  }

  public async addClick() {
    this.loading.submitting = true;
  }

  public async resetClick() {

  }

  public async submitClick() {

  }

  public async onProcedureChange(proc: string) {
    if (proc !== '') {
      this.procedureOptions = await this.service.getProcedures(this.procedureControl.value ?? '');

      this.procedureControlOptions = this.procedureControl.valueChanges.pipe(
        startWith(this.procedureControl.value),
        switchMap(value => from(this._procedurefilter(value || ''))),
      );
    }
  }
}

interface opdServiceData {
  date: FormControl,
  uhid: string,
  opid: string,
  receiptNo: string,
  patientName: string
  age: string,
  departmentId: number,
  companyId: number,
  type: string,
  doctorId: number
}

interface ChargeSection {
  service: number;
  subService: number;
  doctor: number;
  quantity: number;
  charge: number;
  discountPercent: number;
  discountRs: number;
  netCharge: number;
  
  totalAmount: number;
  totalDiscount: number;
  totalCharge: number;
  paidAmount: number;
  balanceAmount: number;

  referredBy: number;
  remarks: string;
}