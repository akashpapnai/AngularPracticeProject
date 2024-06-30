import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { LoginService } from '../../../../login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../../constants.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-collection-report',
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
    CurrencyPipe
  ],
  templateUrl: './collection-report.component.html',
  styleUrl: './collection-report.component.scss',
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMATS),

  ]
})
export class CollectionReportComponent {

  constructor(
    private lService: LoginService,
    private http: HttpClient,
    private router: Router,
    private constants: ConstantsService
  ) { }

  private token_header = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  public displayedColumns: string[] = ['row', 'uhid', 'id', 'patientName', 'doctorName', 'departmentName', 'receiptNo', 'receiptDate', 'paymentMode', 'onlineMode', 'remarks', 'receivedAmount'];
  public filter = new filter();
  public ELEMENT_DATA: CollectionData[] = [];
  public dataSource = new MatTableDataSource<CollectionData>(this.ELEMENT_DATA);

  async ngOnInit(): Promise<void> {
    const data = this.http.get(this.lService.__apiURL__ + '/Common/CollectionReport', { headers: this.token_header });
    data.subscribe({
      next: (response) => {
        const obj = response as ResponseData;
        let row = 1;
        obj.table.forEach(x => {
          let eachData = x as CollectionData;
          eachData = { ...eachData, row: row };
          this.ELEMENT_DATA.push(eachData);
          row++;
        });
        this.dataSource = new MatTableDataSource<CollectionData>(this.ELEMENT_DATA);
      },
      error: () => {
        alert('Could not load Data');
      }
    })
  }

  public getTotalReceivedAmount() {
    const total = this.ELEMENT_DATA.map(t => t.receivedAmount).reduce((acc, value) => acc + value, 0);
    return total;
  }

  public getTotalPaymentMode() {
    const cashTotal = this.ELEMENT_DATA.map(t => t.paymentMode === 'Cash').reduce((acc, value) => acc + (value === true ? 1 : 0), 0);
    const chequeTotal = this.ELEMENT_DATA.map(t => t.paymentMode === 'Cheque').reduce((acc, value) => acc + (value === true ? 1 : 0), 0);
    const onlineTotal = this.ELEMENT_DATA.map(t => t.paymentMode === 'Online').reduce((acc, value) => acc + (value === true ? 1 : 0), 0);

    return "<span class='text-nowrap text-xs'>Cash: " + cashTotal.toString() + "</span><br/><span class='text-nowrap text-xs'>Cheque: " + chequeTotal.toString() + "</span><br/><span class='text-nowrap text-xs'>Online: " + onlineTotal.toString() + "</span>";
  }

  public async getExcel() {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    const data = this.ELEMENT_DATA;

    const modifiedData = this.transformedData(data);

    const tableData = await this.http.post<any>(this.lService.__apiURL__ + "/Common/getExcel", modifiedData, { headers, responseType: 'blob' as 'json' }).toPromise();
    const url = window.URL.createObjectURL(tableData);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Collection Report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

  }

  public async printTable() {
    const data = this.transformedData(this.ELEMENT_DATA);
    const encodedData = encodeURIComponent(JSON.stringify(data));
    localStorage.setItem('reportName', 'Collection Report');
    localStorage.setItem('tableData', encodedData);
    // window.open('/print','_blank');

    window.open(this.lService.baseUrlForPrint + '/print', '_blank');
  }

  public async filterTable(): Promise<void | undefined> {
    // Validate
    if (this.filter.fromDate.value === null || this.filter.toDate.value === null) {
      alert('Please fill From and To Date');
      return;
    }


    const data = this.http.get(this.lService.__apiURL__ + '/Common/CollectionReport', {
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
          let eachData = x as CollectionData;
          eachData = { ...eachData, row: row };
          this.ELEMENT_DATA.push(eachData);
          row++;
        });

        this.dataSource = new MatTableDataSource<CollectionData>(this.ELEMENT_DATA);
      },
      error: () => {
        alert('Could not load Data');
      }
    })
  }

  private transformedData(data: CollectionData[]) {
    const modifiedData: any = [];

    data.forEach(row => {
      const tempData: { [key: string]: any } = {};
      const genericObj = JSON.parse(JSON.stringify(row));

      for (let key in row) {
        tempData[keyMappings[key]] = genericObj[key];
      }

      let orderedKeys = ['S.R. No', 'UHID', 'ID', 'Patient Name', 'Doctor Name', 'Department Name', 'Receipt No.', 'Receipt Date', 'Payment Mode', 'Online Mode', 'Remarks', 'Received Amount'];

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
    localStorage.removeItem('reportName');
  }
}

export interface CollectionData {
  row: number,
  uhid: string;
  id: string;
  patientName: string;
  doctorName: string;
  departmentName: string;
  receiptNo: string;
  receiptDate: string;
  paymentMode: string;
  remarks: string;
  receivedAmount: number;
  onlineMode: string;
}

export interface ResponseData {
  table: object[];
}

const keyMappings: { [key: string]: string } = {
  row: 'S.R. No',
  receiptDate: 'Receipt Date',
  patientName: 'Patient Name',
  doctorName: 'Doctor Name',
  departmentName: 'Department Name',
  receiptNo: 'Receipt No.',
  uhid: 'UHID',
  paymentMode: 'Payment Mode',
  remarks: 'Remarks',
  receivedAmount: 'Received Amount',
  onlineMode: 'Online Mode',
  id: 'ID',
};

class filter {
  fromDate: FormControl = new FormControl(moment());
  toDate: FormControl = new FormControl(moment());
}