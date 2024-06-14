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
import { AddDoctorModel, Doctor, DoctorMasterService, UpdateDoctorModel } from '../../../../services/doctor-master.service';
import { Title } from '@angular/platform-browser';
import { DropDownComponent } from '../../../../shared/inputs/drop-down/drop-down.component';
import { DepartmentMasterService } from '../../../../services/department-master.service';
import { DialogBoxComponent } from '../../../../shared/dialog-box/dialog-box.component';

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
    DropDownComponent,
    DialogBoxComponent
  ],
  templateUrl: './doctor-master.component.html',
  styleUrl: './doctor-master.component.scss'
})
export class DoctorMasterComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: DoctorMasterService, private deptService: DepartmentMasterService, private title: Title) {
  }

  public ELEMENT_DATA: Doctor[] = [];
  public dataSource = new MatTableDataSource<Doctor>(this.ELEMENT_DATA);
  public snackBar = {
    message: '',
    show: false
  }
  public showDoctors: boolean = true;
  public addingDoctor: boolean = false;
  public displayedColumns: string[] = ['row', 'doctorName', 'createdBy','referringDoctor','firstTimeConsultationCharge','followUpConsultationCharge', 'actions'];
  public doctorName: string = '';
  public departmentId: number = 0;
  public departmentsList: any[] = [];
  public loading = {
    resetting: false,
    submitting: false
  }
  public openDialog: boolean = false;
  public action: string = '';
  public changeDoctorId: number = 0;
  public referringDoc: boolean = false;

  async ngOnInit(): Promise<void> {
    this.title.setTitle('Doctor Master');

    const allDepts = await this.deptService.getAllDepartments();
    allDepts.forEach(x => {
      this.departmentsList.push({ key: x.departmentId, value: x.departmentName });
    });

    const tableData = await this.service.getAllDoctors();
    let rn = 1;
    tableData.forEach(x => {
      this.ELEMENT_DATA.push({ ...x, row: rn });
      rn++;
    });
    this.dataSource = new MatTableDataSource<Doctor>(this.ELEMENT_DATA);
  }

  public async saveClick() {
    if(this.validateTable()) {
      this.loading.submitting = true;
      const tableData = this.ELEMENT_DATA;
      const dataToUpdate: UpdateDoctorModel[] = [];
      tableData.forEach(x=> {
        let pushData:UpdateDoctorModel = {
          doctorId: x.doctorId,
          firstTimeConsultationCharge: x.firstTimeConsultationCharge,
          followUpConsultationCharge: x.followUpConsultationCharge
        }
        dataToUpdate.push(pushData);
      });
      const status = await this.service.updateDoctors(dataToUpdate);
      alert(status.message);
      this.loading.submitting = false;
    }
    else {
      alert('Please Enter valid Data');
    }
  }

  public async addDoctor(form: NgForm) {
    this.loading.submitting = true;
    if (form.valid) {
      const data: AddDoctorModel = {
        Token: localStorage.getItem('token'),
        DoctorName: form.value.DoctorName,
        DepartmentId: this.departmentId,
        isReferring: this.referringDoc,
        firstTimeConsultationCharge: 0,
        followUpConsultationCharge: 0
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

  private validateTable(): boolean {
    const tableData:Doctor[] = this.ELEMENT_DATA;
    let isValid:boolean = true;

    tableData.forEach(x => {
      if(x.firstTimeConsultationCharge === null || x.followUpConsultationCharge === null) {
        isValid = false;
      }
    })

    return isValid;
  }
}
