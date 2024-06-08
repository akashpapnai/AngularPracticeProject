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
import { CompanyMasterService } from '../../../../services/company-master.service';

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
    TextFieldComponent
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
  public displayedColumns: string[] = ['CompanyId', 'CompanyName', 'CreatedBy'];
  public companyName: string = '';

  constructor(private title: Title, private service: CompanyMasterService) { }
  ngOnInit(): void {
    this.title.setTitle('Company Master');
  }

  public addCompany(form: NgForm) {
    if(form.valid) {
      this.service.addCompany(form.value);
    }
    else {
      alert('Enter full details');
    }
  }

  public companiesList() {
    this.showCompanies = !this.showCompanies;
    this.addingCompany = false;
  }
  public formToAddNewCompany() {
    this.showCompanies = !this.showCompanies;
    this.addingCompany = true;
  }

}

export interface CompaniesData {
  CompanyId: number;
  CompanyName: number,
  isActive: string;
  CreatedBy: string;
}