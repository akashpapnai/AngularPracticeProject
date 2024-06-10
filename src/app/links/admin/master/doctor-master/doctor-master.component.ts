import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from '../../../../shared/snackbar/snackbar.component';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddDoctorModel, Doctor, DoctorMasterService } from '../../../../services/doctor-master.service';
import { Title } from '@angular/platform-browser';
import { DoctorMasterDialogBoxComponent } from './doctor-master-dialog-box/doctor-master-dialog-box.component';

@Component({
  selector: 'app-doctor-master',
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
    DoctorMasterDialogBoxComponent
  ],
  templateUrl: './doctor-master.component.html',
  styleUrl: './doctor-master.component.scss'
})
export class DoctorMasterComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: DoctorMasterService,private title: Title) {}

  public ELEMENT_DATA: Doctor[] = [];
  public dataSource = new MatTableDataSource<Doctor>(this.ELEMENT_DATA);
  public snackBar = {
    message: '',
    show: false
  }
  public showDoctors: boolean = true;
  public addingDoctor: boolean = false;
  public displayedColumns: string[] = ['row', 'doctorName', 'createdBy', 'actions'];
  public doctorName: string = '';
  public loading = {
    resetting: false,
    submitting: false
  }
  public openDialog: boolean = false;
  public action: string = '';
  public changeDoctorId: number = 0;

  async ngOnInit(): Promise<void> {
    this.title.setTitle('Doctor Master');

    const tableData = await this.service.getAllDoctors();
    debugger;
    let rn = 1;
    tableData.forEach(x => {
      this.ELEMENT_DATA.push({ ...x, row: rn });
      rn++;
    });
    this.dataSource = new MatTableDataSource<Doctor>(this.ELEMENT_DATA);
  }

  public async addDoctor(form: NgForm) {
    this.loading.submitting = true;
    if (form.valid) {
      const data: AddDoctorModel = {
        Token: localStorage.getItem('token'),
        DoctorName: form.value.DoctorName
      }
      const status = await this.service.addDoctor(data);
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

  public doctorDelete(doctorId: number) {
    this.changeDoctorId = doctorId;
    this.action = 'Delete'
    this.openDialog = true;
  }
  public doctorEdit(doctorId: number) {
    this.changeDoctorId = doctorId;
    this.action = 'Edit'
    this.openDialog = true;
  }

  public doctorsList() {
    this.showDoctors = !this.showDoctors;
    this.addingDoctor = false;
  }
  public formToAddNewDoctor() {
    this.showDoctors = !this.showDoctors;
    this.addingDoctor = true;
  }
  public hideDialog() {
    this.openDialog = false;
    this.changeDoctorId = 0;
  }
}
