import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { SnackbarComponent } from '../../../../shared/snackbar/snackbar.component';
import { Title } from '@angular/platform-browser';
import { AddDepartmentModel, Department, DepartmentMasterService } from './department-master.service';
import { DialogBoxComponent } from '../../../../shared/dialog-box/dialog-box.component';

/**
 * @title Table
 */
@Component({
  selector: 'app-department-master',
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
  templateUrl: './department-master.component.html',
  styleUrl: './department-master.component.scss'
})
export class DepartmentMasterComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: DepartmentMasterService,private title: Title) {}

  public ELEMENT_DATA: Department[] = [];
  public dataSource = new MatTableDataSource<Department>(this.ELEMENT_DATA);
  public snackBar = {
    message: '',
    show: false
  }
  public showDepartments: boolean = true;
  public addingDepartment: boolean = false;
  public displayedColumns: string[] = ['row', 'departmentName', 'createdBy', 'actions'];
  public departmentName: string = '';
  public loading = {
    resetting: false,
    submitting: false
  }
  public openDialog: boolean = false;
  public action: string = '';
  public changeDepartmentId: number = 0;

  async ngOnInit(): Promise<void> {
    this.title.setTitle('Department Master');

    const tableData = await this.service.getAllDepartments();
    let rn = 1;
    tableData.forEach(x => {
      this.ELEMENT_DATA.push({ ...x, row: rn });
      rn++;
    });
    this.dataSource = new MatTableDataSource<Department>(this.ELEMENT_DATA);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public async addDepartment(form: NgForm) {
    this.loading.submitting = true;
    if (form.valid) {
      const data: AddDepartmentModel = {
        Token: localStorage.getItem('token'),
        DepartmentName: form.value.DepartmentName
      }
      const status = await this.service.addDepartment(data);
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

  public departmentDelete(departmentId: number) {
    this.changeDepartmentId = departmentId;
    this.action = 'Delete'
    this.openDialog = true;
  }
  public departmentEdit(departmentId: number) {
    this.changeDepartmentId = departmentId;
    this.action = 'Edit'
    this.openDialog = true;
  }

  public departmentsList() {
    this.showDepartments = !this.showDepartments;
    this.addingDepartment = false;
  }
  public formToAddNewDepartment() {
    this.showDepartments = !this.showDepartments;
    this.addingDepartment = true;
  }
  public hideDialog() {
    this.openDialog = false;
    this.changeDepartmentId = 0;
  }
}
