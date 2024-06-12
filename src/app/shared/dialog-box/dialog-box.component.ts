import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogBoxService } from './dialog-box.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-box',
  standalone: true,
  imports: [],
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.scss'
})
export class DialogBoxComponent {
  @Output() close = new EventEmitter<void>();
  @Input() Id: any = 0;
  @Input() Action: string = '';
  @Input() Page: string = '';

  constructor(private service: DialogBoxService, private router: Router) { }

  public async editDepartment() {
    const alertResponse = await this.service.DepartmentEdit(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Department Edit Successful') {
      this.closeDialog();
    }
  }

  public async deleteDepartment() {
    const alertResponse = await this.service.DepartmentDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Department Delete Successful') {
      this.closeDialog();
    }
  }

  public async editBank() {
    const alertResponse = await this.service.BankEdit(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Bank Edit Successful') {
      this.closeDialog();
    }
  }

  public async deleteBank() {
    const alertResponse = await this.service.BankDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Bank Delete Successful') {
      this.closeDialog();
    }
  }

  public async editCompany() {
    const alertResponse = await this.service.CompanyEdit(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Company Edit Successful') {
      this.closeDialog();
    }
  }

  public async deleteCompany() {
    const alertResponse = await this.service.CompanyDelete(this.Id);
    alert(alertResponse);
    if (typeof alertResponse !== 'undefined' && alertResponse === 'Company Delete Successful') {
      this.closeDialog();
    }
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

  public sendToOPD() {
    this.router.navigate(['opd/opdmanagement',this.Id]);
  }
  public sendToIPD() {
    
  }


  public closeDialog() {
    this.close.emit();
  }
}