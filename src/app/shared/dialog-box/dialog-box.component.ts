import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChiefComplaintData, ChiefComplaintInterface, DialogBoxService } from './dialog-box.service';
import { Router } from '@angular/router';
import { TextFieldComponent } from '../inputs/text-field/text-field.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dialog-box',
  standalone: true,
  imports: [
    TextFieldComponent,
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.scss'
})
export class DialogBoxComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() Id: any = 0;
  @Input() Action: string = '';
  @Input() Page: string = '';

  public chiefComplaints: string = '';
  public companyName: string = '';
  public bankName: string = '';
  public departmentName: string = '';
  public loading = {
    resetting: false,
    submitting: false
  }

  public displayedColumns: string[] = ['row', 'chiefComplaintName'];
  public ELEMENT_DATA: ChiefComplaintData[] = [];
  public dataSource: any;

  async ngOnInit() {
    if(this.Page === 'opdManagement') {
      this.ELEMENT_DATA = [];
      const tableData = await this.service.getAllChiefComplaints();
      let rn = 1;
      tableData.forEach(x => {
        this.ELEMENT_DATA.push({ value: x.value ,row: rn });
        rn++;
      });
      this.dataSource = new MatTableDataSource<ChiefComplaintData>(this.ELEMENT_DATA);
    }
    else if(this.Page === 'Company') {
      this.companyName = await this.service.getCompanyNameById(this.Id);
    }
    else if(this.Page === 'Bank') {
      this.bankName = await this.service.getBankNameById(this.Id);
    }
    else if(this.Page === 'Department') {
      this.departmentName = await this.service.getDepartmentNameById(this.Id);
    }
  }

  constructor(private service: DialogBoxService, private router: Router) { }

  public async editDepartment() {
    this.loading.submitting = true;
    const alertResponse = await this.service.DepartmentEdit(this.Id, this.departmentName);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Department Edit Successful') {
      this.closeDialog();
      window.location.reload();
    }
    this.loading.submitting = false;
  }

  public async deleteDepartment() {
    this.loading.submitting = true;
    const alertResponse = await this.service.DepartmentDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Department Delete Successful') {
      this.closeDialog();
      window.location.reload();
    }
    this.loading.submitting = false;
  }

  public async editBank() {
    this.loading.submitting = true;
    const alertResponse = await this.service.BankEdit(this.Id, this.bankName);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Bank Edit Successful') {
      this.closeDialog();
      window.location.reload();
    }
    this.loading.submitting = false;
  }

  public async deleteBank() {
    this.loading.submitting = true;
    const alertResponse = await this.service.BankDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Bank Delete Successful') {
      this.closeDialog();
      window.location.reload();
    }
    this.loading.submitting = false;
  }

  public async editCompany() {
    this.loading.submitting = true;
    const alertResponse = await this.service.CompanyEdit(this.Id, this.companyName);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Company Edit Successful') {
      this.closeDialog();
      window.location.reload();
    }
    this.loading.submitting = false;
  }

  public async deleteCompany() {
    this.loading.submitting = true;
    const alertResponse = await this.service.CompanyDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Company Delete Successful') {
      this.closeDialog();
      window.location.reload();
    }
    this.loading.submitting = false;
  }

  public async editDoctor() {
    const alertResponse = await this.service.DoctorEdit(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Doctor Edit Successful') {
      this.closeDialog();
    }
  }

  public async deleteDoctor() {
    const alertResponse = await this.service.DoctorDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Doctor Delete Successful') {
      this.closeDialog();
    }
  }

  public async editEmployee() {
    const alertResponse = await this.service.EmployeeEdit(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Employee Edit Successful') {
      this.closeDialog();
    }
  }

  public async deleteEmployee() {
    const alertResponse = await this.service.EmployeeDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Employee Delete Successful') {
      this.closeDialog();
    }
  }

  public sendToOPD() {
    this.router.navigate(['opd/opdmanagement', this.Id]);
  }
  public sendToIPD() {
  }

  public closeDialog() {
    this.close.emit();
  }

  public async saveChiefComplaints() {
    this.loading.submitting = true;
    if (this.chiefComplaints.trim() !== '') {
      const alertResponse = await this.service.saveChiefComplaint(this.chiefComplaints);
      alert(alertResponse);
      this.chiefComplaints = '';

      const tableData = await this.service.getAllChiefComplaints();
      let rn = 1;

      this.ELEMENT_DATA = [];
      tableData.forEach(x => {
        this.ELEMENT_DATA.push({ value: x.value ,row: rn });
        rn++;
      });
      this.dataSource = new MatTableDataSource<ChiefComplaintData>(this.ELEMENT_DATA);
    }
    else {
      alert('Please Enter Chief Complaint');
    }
    this.loading.submitting = false;
  }
}