import { AfterViewInit,ViewChild,Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HttpClient, HttpClientModule,HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients-registered-report',
  standalone: true,
  imports: [
    NavbarComponent, 
    MatTableModule, 
    MatPaginatorModule, 
    HttpClientModule
  ],
  templateUrl: './patients-registered-report.component.html',
  styleUrl: './patients-registered-report.component.scss'
})
export class PatientsRegisteredReportComponent implements AfterViewInit,OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public ELEMENT_DATA: PatientsData[] = [];
  public dataSource = new MatTableDataSource<PatientsData>(this.ELEMENT_DATA);

  displayedColumns: string[] = ['date', 'name', 'dOB', 'age','address'];

  constructor(
    private lService: LoginService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token_header = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    const data = this.http.get(this.lService.__apiURL__ + '/Common/getAllRegisteredPatients',{headers:token_header});

    data.subscribe({
      next: (response) => {
        const obj = response as ResponseData;
        obj.table.forEach(x => {
          let eachData = x as PatientsData;
          this.ELEMENT_DATA.push(eachData);
          this.dataSource = new MatTableDataSource<PatientsData>(this.ELEMENT_DATA);
        });
      },
      error: () => {
        alert('Could not load Data');
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}

export interface ResponseData {
  table:object[];
}

export interface PatientsData {
  id: number;
  date: string;
  name: string;
  dOB: string;
  age: string;
  address: string;
}