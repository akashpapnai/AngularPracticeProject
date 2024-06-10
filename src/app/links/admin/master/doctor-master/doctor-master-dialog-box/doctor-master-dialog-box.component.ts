import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginService } from '../../../../../login.service';

@Component({
  selector: 'app-doctor-master-dialog-box',
  standalone: true,
  imports: [],
  templateUrl: './doctor-master-dialog-box.component.html',
  styleUrl: './doctor-master-dialog-box.component.scss'
})
export class DoctorMasterDialogBoxComponent {
  @Output() close = new EventEmitter<void>();
  @Input() DoctorId: number = 0;
  @Input() Action: string = '';

  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  constructor(private lService: LoginService, private http: HttpClient) {}
  
  public async editDoctor() {
    const doctorData: editInput = { DoctorId: this.DoctorId };
    const resp = await this.http.put<responseStatus>(this.apiUrl + "/Doctor/EditDoctor", JSON.stringify(doctorData));
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Doctor Edit Successful');
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
  public async deleteDoctor() {
    const resp = await this.http.delete<responseStatus>(this.apiUrl + "/Doctor/EditDoctor", {headers: this.token, params: {
      'DoctorId': this.DoctorId
    }});
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Doctor Delete Successful');
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
  DoctorId: number
}