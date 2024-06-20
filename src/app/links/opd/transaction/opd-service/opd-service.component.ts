import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { Title } from '@angular/platform-browser';
import { FormControl, FormsModule } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { OpdServiceService, opdObjectResponse } from './opd-service.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';

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

const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-opd-service',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    DateComponent,
    TextFieldComponent,
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

  constructor(private title: Title, private service: OpdServiceService, private compServ: CompanyMasterService, private deptServ: DepartmentMasterService, private docServ: DoctorMasterService) {

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
    const patients = allPatients;
    this.dataSource = new MatTableDataSource(patients);
    this.dataLoaded = true;
  }

  public companiesList: any[] = [];
  public departmentsList: any[] = [];
  public doctorsList: any[] = [];
  public displayedColumns: string[] = ['opid', 'uhid', 'patientsName', 'companyName', 'admissionDate'];
  public dataSource: MatTableDataSource<opdObjectResponse> = new MatTableDataSource();
  public dataLoaded: boolean = false;

  public loading: any = {
    resetting: false,
    submitting: false,
  }
  public opdService: any = {
    'date': new FormControl({ value: '', disabled: true })
  }

  public loadPatientsDetails(opid: string) {

  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
