import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginService } from '../../../../../login.service';

@Component({
  selector: 'app-dialog-box',
  standalone: true,
  imports: [],
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.scss'
})
export class DialogBoxComponent {
  @Output() close = new EventEmitter<void>();
  @Input() CompanyId: number = 0;
  @Input() Action: string = '';

  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient, private lService: LoginService) { }

  public async editCompany() {
    const compData: editInput = { CompanyId: this.CompanyId };
    const resp = await this.http.put<responseStatus>(this.apiUrl + "/Company/EditCompany", JSON.stringify(compData));
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Company Edit Successful');
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
  public async deleteCompany() {
    const resp = await this.http.delete<responseStatus>(this.apiUrl + "/Company/EditCompany", {headers: this.token, params: {
      'CompanyId': this.CompanyId
    }});
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Company Delete Successful');
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
  CompanyId: number
}
