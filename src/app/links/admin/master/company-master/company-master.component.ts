import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { Title } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from '../../../../shared/snackbar/snackbar.component';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { CompanyMasterService, AddCompanyModel, CompaniesData } from '../../../../services/company-master.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

@Component({
  selector: 'app-company-master',
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
    SnackbarComponent,
    FormsModule,
    TextFieldComponent,
    MatProgressSpinnerModule,
    DialogBoxComponent
  ],
  templateUrl: './company-master.component.html',
  styleUrl: './company-master.component.scss'
})
export class CompanyMasterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public ELEMENT_DATA: CompaniesData[] = [];
  public dataSource = new MatTableDataSource<CompaniesData>(this.ELEMENT_DATA);
  public snackBar = {
    message: '',
    show: false
  }
  public showCompanies: boolean = true;
  public addingCompany: boolean = false;
  public displayedColumns: string[] = ['row', 'companyName', 'createdBy', 'actions'];
  public companyName: string = '';
  public loading = {
    resetting: false,
    submitting: false
  }
  public openDialog:boolean = false;
  public action:string = '';
  public changeCompanyId:number = 0;

  constructor(private title: Title, private service: CompanyMasterService) { }
  async ngOnInit(): Promise<void> {
    this.title.setTitle('Company Master');

    const tableData = await this.service.getAllCompanies();
    let rn = 1;
    tableData.forEach(x => {
      this.ELEMENT_DATA.push({ ...x, row: rn });
      rn++;
    });
    this.dataSource = new MatTableDataSource<CompaniesData>(this.ELEMENT_DATA);
  }

  public async addCompany(form: NgForm) {
    this.loading.submitting = true;
    if (form.valid) {
      const data: AddCompanyModel = {
        Token: localStorage.getItem('token'),
        CompanyName: form.value.CompanyName
      }
      const status = await this.service.addCompany(data);
      alert(status.message);
      if (status.status === 1) {
        window.location.reload();
      }
    }
    else {
      alert('Enter full details');
    }
    this.loading.submitting = false;
  }

  public companyDelete(companyId: number) {
    this.changeCompanyId = companyId;
    this.action = 'Delete'
    this.openDialog = true;
  }
  public companyEdit(companyId: number) {
    this.changeCompanyId = companyId;
    this.action = 'Edit'
    this.openDialog = true;
  }

  public companiesList() {
    this.showCompanies = !this.showCompanies;
    this.addingCompany = false;
  }
  public formToAddNewCompany() {
    this.showCompanies = !this.showCompanies;
    this.addingCompany = true;
  }
  public hideDialog() {
    this.openDialog = false;
    this.changeCompanyId = 0;
  }

}