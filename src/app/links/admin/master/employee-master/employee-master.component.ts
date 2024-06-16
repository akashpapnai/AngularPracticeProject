import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogBoxComponent } from '../../../../shared/dialog-box/dialog-box.component';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { SnackbarComponent } from '../../../../shared/snackbar/snackbar.component';
import { AddEmployeeModel, Employee, EmployeeMasterService } from './employee-master.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-master',
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
  templateUrl: './employee-master.component.html',
  styleUrl: './employee-master.component.scss'
})
export class EmployeeMasterComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: EmployeeMasterService,private title: Title) {}

  public ELEMENT_DATA: Employee[] = [];
  public dataSource = new MatTableDataSource<Employee>(this.ELEMENT_DATA);
  public snackBar = {
    message: '',
    show: false
  }
  public showEmployees: boolean = true;
  public addingEmployee: boolean = false;
  public displayedColumns: string[] = ['row', 'employeeName', 'createdBy','canAuthorizePatient', 'actions'];
  public employeeName: string = '';
  public loading = {
    resetting: false,
    submitting: false
  }
  public openDialog: boolean = false;
  public action: string = '';
  public changeEmployeeId: number = 0;
  public canAuthorizePatient: boolean = false;

  async ngOnInit(): Promise<void> {
    this.title.setTitle('Employee Master');

    const tableData = await this.service.getAllEmployees();
    let rn = 1;
    tableData.forEach(x => {
      this.ELEMENT_DATA.push({ ...x, row: rn });
      rn++;
    });
    debugger;
    this.dataSource = new MatTableDataSource<Employee>(this.ELEMENT_DATA);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public async addEmployee(form: NgForm) {
    this.loading.submitting = true;
    if (form.valid) {
      const data: AddEmployeeModel = {
        Token: localStorage.getItem('token'),
        EmployeeName: form.value.EmployeeName,
        CanAuthorizePatients: this.canAuthorizePatient
      }
      const status = await this.service.addEmployee(data);
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

  public employeeDelete(employeeId: number) {
    this.changeEmployeeId = employeeId;
    this.action = 'Delete'
    this.openDialog = true;
  }
  public employeeEdit(employeeId: number) {
    this.changeEmployeeId = employeeId;
    this.action = 'Edit'
    this.openDialog = true;
  }

  public employeesList() {
    this.showEmployees = !this.showEmployees;
    this.addingEmployee = false;
  }
  public formToAddNewEmployee() {
    this.showEmployees = !this.showEmployees;
    this.addingEmployee = true;
  }
  public hideDialog() {
    this.openDialog = false;
    this.changeEmployeeId = 0;
  }
}
