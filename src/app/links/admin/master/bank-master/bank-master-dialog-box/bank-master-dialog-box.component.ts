import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginService } from '../../../../../login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-bank-master-dialog-box',
  standalone: true,
  imports: [],
  templateUrl: './bank-master-dialog-box.component.html',
  styleUrl: './bank-master-dialog-box.component.scss'
})
export class BankMasterDialogBoxComponent {
  @Output() close = new EventEmitter<void>();
  @Input() BankId: number = 0;
  @Input() Action: string = '';

  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  constructor(private lService: LoginService, private http: HttpClient) {}
  
  public async editBank() {
    const bankData: editInput = { BankId: this.BankId };
    const resp = await this.http.put<responseStatus>(this.apiUrl + "/Bank/EditBank", JSON.stringify(bankData));
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Bank Edit Successful');
          this.closeDialog();
        }
        else {
          alert('Something went wrong while Editing');
        }
      },
      error: () => {
        alert('Error Response from Server. Unable to Edit');
      }
    })
  }
  public async deleteBank() {
    const resp = await this.http.delete<responseStatus>(this.apiUrl + "/Bank/EditBank", {headers: this.token, params: {
      'BankId': this.BankId
    }});
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Bank Delete Successful');
          this.closeDialog();
        }
        else {
          alert('Something went wrong while Deleting');
        }
      },
      error: () => {
        alert('Error Response from Server. Unable to Edit');
      }
    })
  }
  public closeDialog() {
    this.close.emit();
  }
}

interface responseStatus {
  status: number
}

interface editInput {
  BankId: number
}
