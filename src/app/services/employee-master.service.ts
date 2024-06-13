import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMasterService {
  constructor(private http: HttpClient, private lService: LoginService) { }
  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public async addEmployee(data: AddEmployeeModel): Promise<any> {
    return new Promise<any>(async (resolve) => {
      let alrt: any = {};
      const newEmp = await this.http.post<employeeAddStatus>(this.apiUrl + '/Employee/AddEmployee', JSON.stringify(data), { headers: this.token });

      newEmp.subscribe(
        {
          next: (data) => {
            if (data.status > 0) {
              alrt = { message: 'Employee added Successfully', status: 1 };
            }
            else if (data.status === -10) {
              alrt = { message: 'Employee already exists!!', status: 0 };
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

  public getAllEmployees(): Promise<Employee[]> {
    return new Promise<Employee[]>(async (resolve) => {
      const employees = await this.http.get<EmployeeData>(this.apiUrl + '/Employee/GetAllEmployees', { headers: this.token });
      employees.subscribe({
        next: (data) => {
          resolve(data.allEmployees);
        },
        error: (error) => {
          console.error(error);
          resolve([]);
        }
      });
    });
  }
}

interface employeeAddStatus {
  status: number
}


export interface AddEmployeeModel {
  EmployeeName: string | null,
  Token: string | null,
  CanAuthorizePatients: boolean
}

export interface EmployeeData {
  allEmployees: Employee[]
}

export interface Employee {
  employeeId: number;
  employeeName: number,
  isActive: string;
  createdBy: string;
  canAuthorizePatient: boolean
  row: number;
}