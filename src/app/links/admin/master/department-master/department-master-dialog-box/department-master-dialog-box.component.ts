import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginService } from '../../../../../login.service';

@Component({
  selector: 'app-department-master-dialog-box',
  standalone: true,
  imports: [],
  templateUrl: './department-master-dialog-box.component.html',
  styleUrl: './department-master-dialog-box.component.scss'
})
export class DepartmentMasterDialogBoxComponent {
  @Output() close = new EventEmitter<void>();
  @Input() DepartmentId: number = 0;
  @Input() Action: string = '';

  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  constructor(private lService: LoginService, private http: HttpClient) {}
  
  public async editDepartment() {
    const departmentData: editInput = { DepartmentId: this.DepartmentId };
    const resp = await this.http.put<responseStatus>(this.apiUrl + "/Department/EditDepartment", JSON.stringify(departmentData));
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Department Edit Successful');
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
  public async deleteDepartment() {
    const resp = await this.http.delete<responseStatus>(this.apiUrl + "/Department/EditDepartment", {headers: this.token, params: {
      'DepartmentId': this.DepartmentId
    }});
    resp.subscribe({
      next: (response) => {
        if (response.status > 0) {
          alert('Department Delete Successful');
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
  DepartmentId: number
}