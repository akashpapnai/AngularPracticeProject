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
import { ChargeSection, OpdServiceService, PackageSection, PatientDetails, chargeSummaryResponse, opdObjectResponse, opdServiceData, packageSummaryResponse } from './opd-service.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import moment from 'moment';
import { AutoCompleteComponent } from '../../../../shared/inputs/auto-complete/auto-complete.component';
import { Observable, from, startWith, switchMap } from 'rxjs';
import { OpdManagementService } from '../opdmanagement/opd-management.service';
import { ConstantsService } from '../../../../constants.service';
import { MatRadioModule } from '@angular/material/radio';
import { BankMasterService } from '../../../admin/master/bank-master/bank-master.service';

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
    MatFormFieldModule,
    MatRadioModule
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

  constructor(private title: Title,
    private service: OpdServiceService,
    private compServ: CompanyMasterService,
    private deptServ: DepartmentMasterService,
    private docServ: DoctorMasterService,
    private opdServ: OpdManagementService,
    private constants: ConstantsService,
    private bnkSrvc: BankMasterService
  ) {
    this.paymentModes = this.constants.paymentModes;
  }

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
    this.dataSource = new MatTableDataSource(allPatients);
    this.dataLoaded = true;

    this.procedureOptions = await this.service.getProcedures((this.procedureControl.value ?? "a"));

    this.procedureControlOptions = this.procedureControl.valueChanges.pipe(
      startWith(this.procedureControl.value),
      switchMap(value => from(this._procedurefilter(value || 'a'))),
    );
  }

  public matTabGroupSelectedIndex: number = 2;
  public companiesList: any[] = [];
  public departmentsList: any[] = [];
  public doctorsList: any[] = [];
  public servicesList: any[] = [];
  public subServicesList: any[] = [];
  public referredByList: any[] = [];
  public paymentModes: any[] = [];
  public bankNamesList: any[] = [];
  public paymentTypeList: any[] = [];
  public packagesList: any[] = [];
  public displayedColumns: string[] = ['opid', 'uhid', 'patientsName', 'companyName', 'admissionDate'];
  public chargeSummaryColumns: string[] = ['row', 'serviceName', 'subServiceName', 'procedureName', 'doctorName', 'quantity', 'charge', 'discountRs', 'netCharge'];
  public packageSummaryColumns: string[] = ['row', 'packageName', 'charge', 'discountRs', 'netCharge']
  public dataSource: MatTableDataSource<opdObjectResponse> = new MatTableDataSource();
  public packageSummaryTable = new MatTableDataSource<packageSummaryResponse>([]);
  public chargeSummaryTable: MatTableDataSource<chargeSummaryResponse> = new MatTableDataSource();
  public procedureControlOptions: Observable<string[]> = new Observable<string[]>;
  public procedureOptions: string[] = [];
  public dataLoaded: boolean = false;
  public procedureControl = new FormControl('');
  public patientDetailsLoaded = false;
  public loading: any = {
    adding: false,
    resetting: false,
    submitting: false,
    addingPackage: false,
    packageResetting: false,
    packageSubmitting: false
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

  public package: PackageSection = {
    package: 0,
    charge: 0,
    discountPer: 0,
    discountRs: 0,
    netCharge: 0,
    totalAmount: 0,
    discountAmount: 0,
    balanceAmount: 0,
    remarks: ''
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
    remarks: '',

    paymentMode: 0,
    bankName: 0,
    chequeDate: new FormControl(''),
    chequeNo: '',
    chequeAmount: 0,
    paymentType: '',
    referenceNo: '',
    cardNo: '',
    UPIID: '',
  }

  public paymentTypeChanged() {
    this.charge.cardNo = '';
    this.charge.UPIID = '';
    this.charge.bankName = 0;
  }

  public async packageChanged() {
    this.package.charge = await this.service.getPackageCharge(this.package.package);
    this.package.netCharge = this.package.charge - this.package.discountRs;
  }

  public paymentModeChanged() {
    this.charge.bankName = 0;
    this.charge.chequeDate = new FormControl('');
    this.charge.chequeNo = '';
    this.charge.chequeAmount = 0;
    this.charge.paymentType = '';
    this.charge.cardNo = '';
    this.charge.UPIID = '';
    this.charge.referenceNo = '';
  }

  public async tabChanged(event: MatTabChangeEvent) {
    if (event.tab.textLabel === 'Charge') {
      const [allService, referringDoctors, allBanks] = await Promise.all([
        this.service.getAllServices(),
        this.opdServ.getReferredDoctors(),
        this.bnkSrvc.getAllBanks()
      ]);

      this.servicesList = allService;
      this.referredByList = referringDoctors;

      const list = this.constants.paymentTypeList;
      list.forEach(l => {
        this.paymentTypeList.push(l);
      });

      allBanks.forEach(x => {
        this.bankNamesList.push({ key: x.bankId, value: x.bankName });
      })
    }
    else if (event.tab.textLabel === 'Package') {
      const [allPackages] = await Promise.all([
        this.service.getAllPackages(),
      ]);

      this.packagesList = allPackages;
    }
  }

  public async getSubService() {
    this.subServicesList = await this.service.getAllSubServices(this.charge.service, null);
  }

  public amountChanged() {
    this.charge.discountPercent = 0;
    this.charge.discountRs = 0;

    this.charge.netCharge = (this.charge.charge * this.charge.quantity) - this.charge.discountRs;
  }

  public paidAmountChanged() {
    this.charge.paidAmount = parseFloat(this.charge.paidAmount.toString());
    if (isNaN(this.charge.paidAmount)) {
      this.charge.paidAmount = 0;
    }

    // if (this.charge.paidAmount < 0 || this.charge.paidAmount > this.charge.totalCharge) {
    //   this.charge.paidAmount = 0;
    // }

    this.charge.balanceAmount = this.charge.totalCharge - this.charge.paidAmount;

    this.charge.paymentMode = 0;
    this.charge.bankName = 0;
    this.charge.chequeDate = new FormControl('');
    this.charge.chequeNo = '';
    this.charge.chequeAmount = 0;
    this.charge.paymentType = '';
    this.charge.referenceNo = '';
    this.charge.cardNo = '';
    this.charge.UPIID = '';
  }

  public quantityChanged() {
    this.discountPercentChanged();
  }

  public packageDiscountPerChanged() {
    [this.package.discountRs, this.package.netCharge] = this.service.PerChanged(this.package.discountRs, this.package.discountPer, this.package.charge, 1, this.package.netCharge)
  }

  public discountPercentChanged() {
    [this.charge.discountRs, this.charge.netCharge] = this.service.PerChanged(this.charge.discountRs, this.charge.discountPercent, this.charge.charge, this.charge.quantity, this.charge.netCharge);
  }

  public discountRsChanged() {
    [this.charge.discountPercent, this.charge.netCharge] = this.service.RsChanged(this.charge.discountRs, this.charge.discountPercent, this.charge.charge, this.charge.quantity, this.charge.netCharge);
  }

  public packageDiscountRsChanged() {
    [this.package.discountPer, this.package.netCharge] = this.service.RsChanged(this.package.discountRs, this.package.discountPer, this.package.charge, 1, this.package.netCharge);
  }

  public async loadPatientsDetails(opid: string) {
    this.chargeResetClick();
    this.chargeSummaryTable = new MatTableDataSource();
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
          this.subServicesList = await this.service.getAllSubServices(this.charge.service, this.procedureControl.value);
          if (this.subServicesList.length > 0) {
            this.charge.subService = this.subServicesList[0].key;
          }
          else {
            this.charge.subService = 0;
          }
        }
        else {
          this.charge.service = 0;
        }
      }
    }, 500);
  }

  public async addPackageClick() {
    this.loading.addingPackage = true;
    this.packageSummaryTable = new MatTableDataSource(await this.service.addPackage(this.package, this.packageSummaryTable, this.packagesList));
    this.loading.addingPackage = false;
  }

  public async addChargeClick() {
    if (this.service.validateAdd(this.charge, this.procedureControl.value, this.chargeSummaryTable.data)) {
      this.loading.adding = true;
      const addData: chargeSummaryResponse = {
        row: this.chargeSummaryTable.data.length + 1,
        serviceId: this.charge.service,
        serviceName: this.servicesList.find(service => service.key === this.charge.service).value,
        subServiceId: this.charge.subService,
        subServiceName: this.subServicesList.find(subService => subService.key === this.charge.subService).value,
        doctorId: this.charge.doctor,
        doctorName: this.doctorsList.find(doctor => doctor.key === this.charge.doctor).value,
        charge: this.charge.charge,
        quantity: this.charge.quantity,
        discountRs: this.charge.discountRs,
        netCharge: this.charge.netCharge,
        procedureName: this.procedureControl.value ?? ''
      }

      let addDataList: chargeSummaryResponse[] = this.chargeSummaryTable.data;
      addDataList.push(addData);
      const pushData = new MatTableDataSource(addDataList);

      this.chargeSummaryTable = pushData;

      let [totalAmount, totalDiscount, totalCharge, totalNetCharge] = [0, 0, 0, 0];
      addDataList.forEach(x => {
        totalAmount += x.charge * x.quantity;
        totalDiscount += x.discountRs;
        totalCharge += x.netCharge;
      });

      totalNetCharge = totalAmount - totalDiscount;
      [this.charge.totalAmount, this.charge.totalDiscount, this.charge.totalCharge, this.charge.balanceAmount] = [totalAmount, totalDiscount, totalNetCharge, totalNetCharge];

      [this.charge.service, this.charge.subService, this.procedureControl, this.charge.charge, this.charge.quantity, this.charge.discountPercent, this.charge.discountRs, this.charge.netCharge, this.charge.doctor] =
        [0, 0, new FormControl(''), 0, 1, 0, 0, 0, 0];


      this.procedureOptions = await this.service.getProcedures((this.procedureControl.value ?? "a"));

      this.procedureControlOptions = this.procedureControl.valueChanges.pipe(
        startWith(this.procedureControl.value),
        switchMap(value => from(this._procedurefilter(value || 'a'))),
      );

      const [allService, referringDoctors] = await Promise.all([
        this.service.getAllServices(),
        this.opdServ.getReferredDoctors()
      ]);

      this.servicesList = allService;
      this.subServicesList = [];
      this.referredByList = referringDoctors;
      this.charge.doctor = 0;

      this.loading.adding = false;
    }
  }

  public getChargeFooterTotal(): number[] {
    const totalQty = this.chargeSummaryTable.data.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
    const totalChrg = this.chargeSummaryTable.data.map(t => Number(t.charge)).reduce((acc, value) => acc + value, 0);
    const totalDiscountRs = this.chargeSummaryTable.data.map(t => t.discountRs).reduce((acc, value) => acc + value, 0);
    const totalNetCharge = this.chargeSummaryTable.data.map(t => t.netCharge).reduce((acc, value) => acc + value, 0);
    return [totalQty, totalChrg, totalDiscountRs, totalNetCharge];
  }

  public getPackageFooterTotal(): number[] {
    const totalCharge = this.packageSummaryTable.data.map(t => t.charge).reduce((acc, value) => acc + value, 0);
    const totalDiscountRs = this.packageSummaryTable.data.map(t => t.discountRs).reduce((acc, value) => acc + value, 0);
    const totalNetCharge = this.packageSummaryTable.data.map(t => t.netCharge).reduce((acc, value) => acc + value, 0);
    return [totalCharge, totalDiscountRs, totalNetCharge];
  }

  public async chargeResetClick() {
    this.loading.resetting = true;
    this.charge = {
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
      remarks: '',

      paymentMode: 0,
      bankName: 0,
      chequeDate: new FormControl(''),
      chequeNo: '',
      chequeAmount: 0,
      paymentType: '',
      referenceNo: '',
      cardNo: '',
      UPIID: '',
    }
    this.loading.resetting = false;
    this.chargeSummaryTable = new MatTableDataSource();
  }

  public async packageResetClick() {
    //TODO: Package Resetting Click
    this.loading.packageResetting = true;
    this.package = {
      package: 0,
      charge: 0,
      discountRs: 0,
      discountPer: 0,
      discountAmount: 0,
      netCharge: 0,

      totalAmount: 0,
      balanceAmount: 0,

      remarks: '',
    }

    this.packageSummaryTable = new MatTableDataSource();
    this.loading.packageResetting = false;
  }

  public async packageSubmitClick() {
    //TODO: Package Submit Click
  }

  public async chargeSubmitClick() {
    this.loading.submitting = true;
    await this.service.submitOpdService(this.opdService, this.charge, this.chargeSummaryTable);
    this.loading.submitting = false;
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
