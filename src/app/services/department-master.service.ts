import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentMasterService {

  constructor(private http:HttpClient, private lService: LoginService) { }
  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public async addDepartment(data: AddDepartmentModel): Promise<any> {
    return new Promise<any>(async (resolve) => {
      let alrt: any = {};
      const newComp = await this.http.post<departmentAddStatus>(this.apiUrl + '/Department/AddDepartment', JSON.stringify(data), { headers: this.token });

      newComp.subscribe(
        {
          next: (data) => {
            if (data.status > 0) {
              alrt = { message: 'Department added Successfully', status: 1 };
            }
            else if (data.status === -10) {
              alrt = { message: 'Department already exists!!', status: 0 };
            }
            else {
              alrt = { message: 'Something went wrong', status: 0 };
            }
            resolve(alrt);
          },
          error: (err) => {
            alrt = { message: 'Server not responding', status: 0 };
            resolve(alrt);
          }
        });
    }
    );
  }

  public getAllDepartments(): Promise<Department[]> {
    return new Promise<Department[]>(async (resolve) => {
      const departments = await this.http.get<DepartmentData>(this.apiUrl + '/Department/GetAllDepartments', { headers: this.token });
      departments.subscribe({
        next: (data) => {
          resolve(data.allDepartments);
        },
        error: (error) => {
          console.error(error);
          resolve([]);
        }
      });
    });
  }
}

interface departmentAddStatus {
  status: number
}


export interface AddDepartmentModel {
  DepartmentName: string | null,
  Token: string | null
}

export interface DepartmentData {
  allDepartments: Department[]
}

export interface Department {
  departmentId: number;
  departmentName: number,
  isActive: string;
  createdBy: string;
  row: number;
}