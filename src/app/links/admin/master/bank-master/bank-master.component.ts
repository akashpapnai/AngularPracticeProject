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
import { BankMasterService, Bank, AddBankModel } from '../../../../services/bank-master.service';
import { Title } from '@angular/platform-browser';
import { DialogBoxComponent } from '../../../../shared/dialog-box/dialog-box.component';

@Component({
  selector: 'app-bank-master',
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
  templateUrl: './bank-master.component.html',
  styleUrl: './bank-master.component.scss'
})
export class BankMasterComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: BankMasterService,private title: Title) {}

  public ELEMENT_DATA: Bank[] = [];
  public dataSource = new MatTableDataSource<Bank>(this.ELEMENT_DATA);
  public snackBar = {
    message: '',
    show: false
  }
  public showBanks: boolean = true;
  public addingBank: boolean = false;
  public displayedColumns: string[] = ['row', 'bankName', 'createdBy', 'actions'];
  public bankName: string = '';
  public loading = {
    resetting: false,
    submitting: false
  }
  public openDialog: boolean = false;
  public action: string = '';
  public changeBankId: number = 0;

  async ngOnInit(): Promise<void> {
    this.title.setTitle('Bank Master');

    const tableData = await this.service.getAllBanks();
    let rn = 1;
    tableData.forEach(x => {
      this.ELEMENT_DATA.push({ ...x, row: rn });
      rn++;
    });
    this.dataSource = new MatTableDataSource<Bank>(this.ELEMENT_DATA);
  }

  public async addBank(form: NgForm) {
    this.loading.submitting = true;
    if (form.valid) {
      const data: AddBankModel = {
        Token: localStorage.getItem('token'),
        BankName: form.value.BankName
      }
      const status = await this.service.addBank(data);
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

  public bankDelete(bankId: number) {
    this.changeBankId = bankId;
    this.action = 'Delete'
    this.openDialog = true;
  }
  public bankEdit(bankId: number) {
    this.changeBankId = bankId;
    this.action = 'Edit'
    this.openDialog = true;
  }

  public banksList() {
    this.showBanks = !this.showBanks;
    this.addingBank = false;
  }
  public formToAddNewBank() {
    this.showBanks = !this.showBanks;
    this.addingBank = true;
  }
  public hideDialog() {
    this.openDialog = false;
    this.changeBankId = 0;
  }
}
