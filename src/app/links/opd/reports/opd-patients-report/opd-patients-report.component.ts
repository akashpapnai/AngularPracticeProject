import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarComponent } from '../../../../shared/snackbar/snackbar.component';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../../login.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../../constants.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
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
  selector: 'app-opd-patients-report',
  standalone: true,
  imports: [
    NavbarComponent,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    CommonModule,
    SnackbarComponent
  ],
  templateUrl: './opd-patients-report.component.html',
  styleUrl: './opd-patients-report.component.scss',
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMATS),

  ]
})
export class OpdPatientsReportComponent {

  constructor(private lService: LoginService,
    private http: HttpClient,
    private router: Router,
    private constants: ConstantsService) {}

  async ngOnInit(): Promise<void> {

    const data = await this.http.get(this.lService.__apiURL__ + '/OPD/getAllOPDPatients', { headers: this.token_header });
    data.subscribe({
      next: (response) => {
        const obj = response as ResponseData;
        let row = 1;
        obj.table.forEach(x => {
          let eachData = x as PatientsData;
          eachData = { ...eachData, row: row };
          this.ELEMENT_DATA.push(eachData);
          row++;
        });
        this.dataSource = new MatTableDataSource<PatientsData>(this.ELEMENT_DATA);
      },
      error: () => {
        alert('Could not load Data');
      }
    })
  } 

  public ELEMENT_DATA: PatientsData[] = [];
  public dataSource = new MatTableDataSource<PatientsData>(this.ELEMENT_DATA);
  public filter = new filter();
  public displayedColumns: string[] = ['row', 'uhid', 'opid', 'date', 'name', 'dOB', 'age', 'address'];
  public snackBar = {
    message: '',
    show: false
  }
  private token_header = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  public async getExcel() {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    const data = this.ELEMENT_DATA;

    const modifiedData = this.transformedData(data);

    const opdData = await this.http.post<any>(this.lService.__apiURL__ + "/Common/getExcel", modifiedData, { headers, responseType: 'blob' as 'json' }).toPromise();
    const url = window.URL.createObjectURL(opdData);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Download.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

  }
  public async printTable() {
    const data = this.transformedData(this.ELEMENT_DATA);
    const encodedData = encodeURIComponent(JSON.stringify(data));
    localStorage.setItem('tableData', encodedData);
    // window.open('/print','_blank');

    window.open(this.lService.baseUrlForPrint + '/print', '_blank');
  }

  public async filterTable(): Promise<void | undefined> {
    this.snackBar.message = '';
    this.snackBar.show = false;

    // Validate
    if (this.filter.fromDate.value === null || this.filter.toDate.value === null) {
      alert('Please fill From and To Date');
      return;
    }


    const data = await this.http.get(this.lService.__apiURL__ + '/OPD/getAllOPDPatients', {
      headers: this.token_header, params: {
        'fromDate': this.filter.fromDate.value?.format('DD-MMM-YYYY'),
        'toDate': this.filter.toDate.value?.format('DD-MMM-YYYY')
      }
    });

    data.subscribe({
      next: (response) => {
        this.ELEMENT_DATA = [];
        const obj = response as ResponseData;
        let row = 1;
        obj.table.forEach(x => {
          let eachData = x as PatientsData;
          eachData = { ...eachData, row: row };
          this.ELEMENT_DATA.push(eachData);
          row++;
        });

        if (this.ELEMENT_DATA.length === 0) {
          this.snackBar.message = 'No Record Found';
          this.snackBar.show = true;
        }

        this.dataSource = new MatTableDataSource<PatientsData>(this.ELEMENT_DATA);
      },
      error: () => {
        alert('Could not load Data');
      }
    })
  }

  private transformedData(data: PatientsData[]) {
    const modifiedData: any = [];
    const keysToDelete = ['id']

    data.forEach(row => {
      const tempData: { [key: string]: any } = {};
      const genericObj = JSON.parse(JSON.stringify(row));

      for (let key in row) {
        if (keysToDelete.includes(key)) {
          continue;
        }
        tempData[keyMappings[key]] = genericObj[key];
      }

      let orderedKeys = ['S.R. No', 'UHID', 'OPID', 'Name', 'Date', 'Date Of Birth', 'Age', 'Address'];

      let orderedObject: any = {};

      orderedKeys.forEach(key => {
        if (tempData.hasOwnProperty(key)) {
          orderedObject[key] = tempData[key];
        }
      });

      modifiedData.push(orderedObject);
    });

    return modifiedData;
  }

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event: Event) {
    // Clear the localStorage item when the tab is closed
    localStorage.removeItem('tableData');
  }
}

export interface ResponseData {
  table: object[];
}

const keyMappings: { [key: string]: string } = {
  row: 'S.R. No',
  date: 'Date',
  name: 'Name',
  dOB: 'Date Of Birth',
  age: 'Age',
  address: 'Address',
  uhid: 'UHID',
  opid: 'OPID'
};

export interface PatientsData {
  id: number;
  row: number,
  date: string;
  name: string;
  dOB: string;
  age: string;
  address: string;
}

class filter {
  fromDate: FormControl = new FormControl(moment());
  toDate: FormControl = new FormControl(moment());
}