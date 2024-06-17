import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../../login.service';
import { companyResponse } from '../../links/opd/transaction/opdmanagement/interfaces';

@Injectable({
  providedIn: 'root'
})

export class DialogBoxService {
  constructor(private http: HttpClient, private lService: LoginService) { }
  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public async getCompanyNameById(Id: number): Promise<string> {

    return new Promise<string>((resolve) => {
      const allCompanies = this.http.get<companyResponse>(this.lService.__apiURL__ + "/Common/getAllCompanies", {
        headers: this.token, params: {
          'Id': Id
        }
      });

      allCompanies.subscribe({
        next: (data) => {
          const companiesData: any[] = data.allCompanies;
          resolve(companiesData[0].value);
        }
      });
    });
  }

  public async DepartmentEdit(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const departmentData: editInput = { DepartmentId: Id };
      const resp = await this.http.put<responseStatus>(this.apiUrl + "/Department/EditDepartment", JSON.stringify(departmentData));
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Department Edit Successful');
          }
          else {
            resolve('Something went wrong while Editing');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Edit');
        }
      })
    });
  }

  public async DepartmentDelete(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const resp = this.http.delete<responseStatus>(this.apiUrl + "/Department/EditDepartment", {
        headers: this.token, params: {
          'DepartmentId': Id
        }
      });
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Department Delete Successful');

          }
          else {
            resolve('Something went wrong while Deleting');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Delete');
        }
      })
    })
  }

  public async BankEdit(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const bankData: editBankInput = { BankId: Id };
      const resp = await this.http.put<responseStatus>(this.apiUrl + "/Bank/EditBank", JSON.stringify(bankData));
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Bank Edit Successful');
          }
          else {
            resolve('Something went wrong while Editing');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Edit');
        }
      })
    });
  }

  public async BankDelete(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const resp = this.http.delete<responseStatus>(this.apiUrl + "/Bank/EditBank", {
        headers: this.token, params: {
          'BankId': Id
        }
      });
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Bank Delete Successful');

          }
          else {
            resolve('Something went wrong while Deleting');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Delete');
        }
      })
    })
  }

  public async CompanyEdit(Id: number, companyName: string): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const companyData: editCompanyInput = { CompanyId: Id, CompanyName: companyName, token: localStorage.getItem('token') };
      const resp = this.http.put<responseStatus>(this.apiUrl + "/Company/EditCompany", companyData, {headers: this.token});
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Company Edit Successful');
          }
          else {
            resolve('Something went wrong while Editing');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Edit');
        }
      })
    });
  }

  public async CompanyDelete(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const resp = this.http.delete<responseStatus>(this.apiUrl + "/Company/DeleteCompany", {
        headers: this.token, params: {
          'CompanyId': Id
        }
      });
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Company Delete Successful');

          }
          else {
            resolve('Something went wrong while Deleting');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Delete');
        }
      })
    })
  }

  public async DoctorEdit(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const doctorData: editDoctorInput = { DoctorId: Id };
      const resp = await this.http.put<responseStatus>(this.apiUrl + "/Doctor/EditDoctor", JSON.stringify(doctorData));
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Doctor Edit Successful');
          }
          else {
            resolve('Something went wrong while Editing');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Edit');
        }
      })
    });
  }

  public async DoctorDelete(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const resp = this.http.delete<responseStatus>(this.apiUrl + "/Doctor/DeleteDoctor", {
        headers: this.token, params: {
          'DoctorId': Id
        }
      });
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Doctor Delete Successful');

          }
          else {
            resolve('Something went wrong while Deleting');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Delete');
        }
      })
    })
  }

  public async EmployeeEdit(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const EmployeeData: editEmployeeInput = { EmployeeId: Id };
      const resp = await this.http.put<responseStatus>(this.apiUrl + "/Employee/EditEmployee", JSON.stringify(EmployeeData));
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Employee Edit Successful');
          }
          else {
            resolve('Something went wrong while Editing');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Edit');
        }
      })
    });
  }

  public async EmployeeDelete(Id: number): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const resp = this.http.delete<responseStatus>(this.apiUrl + "/Employee/DeleteEmployee", {
        headers: this.token, params: {
          'EmployeeId': Id
        }
      });
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Employee Delete Successful');

          }
          else {
            resolve('Something went wrong while Deleting');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Delete');
        }
      })
    })
  }

  public async getAllChiefComplaints(): Promise<ChiefComplaintInterface[]> {
    return new Promise<ChiefComplaintInterface[]>(async (resolve) => {
      const newComp = this.http.get<ChiefComplaintInterface[]>(this.apiUrl + '/Common/getAllChiefComplaints', { headers: this.token });
      newComp.subscribe({
        next: (data) => {
          console.log(data);
          resolve(data);
        },
        error: (error) => {
          console.error(error);
          resolve([]);
        }
      });
    });
  }

  public async saveChiefComplaint(chiefComplaints: string) {
    return new Promise<string>(async (resolve) => {
      const resp = this.http.post<responseStatus>(this.apiUrl + "/Common/AddChiefComplaint", {
        'chiefComplainName': chiefComplaints.trim(),
        'token': localStorage.getItem('token')?.toString()
      }, {
        headers: this.token
      });
      resp.subscribe({
        next: (response) => {
          if (response.status > 0) {
            resolve('Chief Complaint Added Successfully');
          }
          else if (response.status == -10) {
            resolve('This Chief complaint name already exists');
          }
          else {
            resolve('Something went wrong while Adding Chief Complaints');
          }
        },
        error: () => {
          resolve('Error Response from Server. Unable to Add Chief Complaints');
        }
      })
    })
  }
}

interface editInput {
  DepartmentId: number,
}

interface editBankInput {
  BankId: number,
}

interface editCompanyInput {
  CompanyName: string;
  CompanyId: number;
  token: string | null;
}

interface editDoctorInput {
  DoctorId: number
}

interface editEmployeeInput {
  EmployeeId: number
}

interface responseStatus {
  status: number
}

export interface ChiefComplaintData {
  value: string,
  row: number
}

export interface ChiefComplaintInterface {
  key: number,
  value: string
}