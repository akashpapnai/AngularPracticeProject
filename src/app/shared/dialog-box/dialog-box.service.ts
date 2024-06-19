import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../../login.service';
import { bankResponse, companyResponse, departmentResponse, doctorResponse, employeeResponse } from '../../links/opd/transaction/opdmanagement/interfaces';

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

  public async getBankNameById(Id: number): Promise<string> {

    return new Promise<string>((resolve) => {
      const allBanks = this.http.get<bankResponse>(this.lService.__apiURL__ + "/Bank/GetAllBanks", {
        headers: this.token, params: {
          'Id': Id
        }
      });

      allBanks.subscribe({
        next: (data) => {
          const banksData: any[] = data.allBanks;
          resolve(banksData[0].bankName);
        }
      });
    });
  }

  public async getDoctorNameById(Id: number): Promise<any> {
    return new Promise<any>((resolve) => {
      const allDoctors = this.http.get<doctorResponse>(this.lService.__apiURL__ + "/Doctor/GetAllDoctors", {
        headers: this.token, params: {
          'Id': Id
        }
      });

      allDoctors.subscribe({
        next: (data) => {
          const doctorsData: any[] = data.allDoctors;
          resolve({docName: doctorsData[0].doctorName, referringDoctor: doctorsData[0].isReferring, department: doctorsData[0].department});
        }
      });
    });
  }

  public async getEmployeeNameById(Id: number): Promise<any> {
    return new Promise<any>((resolve) => {
      const allEmployees = this.http.get<employeeResponse>(this.lService.__apiURL__ + "/Employee/GetAllEmployees", {
        headers: this.token, params: {
          'Id': Id
        }
      });

      allEmployees.subscribe({
        next: (data) => {
          const employeesData: any[] = data.allEmployees;
          resolve({empName: employeesData[0].employeeName, canAuthorize: employeesData[0].CanAuthorizePatients});
        }
      });
    });
  }

  public async getDepartmentNameById(Id: number): Promise<string> {
    return new Promise<string>((resolve) => {
      const allDepartments = this.http.get<departmentResponse>(this.lService.__apiURL__ + "/Department/GetAllDepartments", {
        headers: this.token, params: {
          'Id': Id
        }
      });

      allDepartments.subscribe({
        next: (data) => {
          const departmentsData: any[] = data.allDepartments;
          resolve(departmentsData[0].departmentName);
        }
      });
    });
  }

  public async DepartmentEdit(Id: number, departmentName: string): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const departmentData: editDepartmentInput = { DepartmentId: Id, DepartmentName: departmentName, token: localStorage.getItem('token') };
      const resp = this.http.put<responseStatus>(this.apiUrl + "/Department/EditDepartment", departmentData, {headers: this.token});
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
      const resp = this.http.delete<responseStatus>(this.apiUrl + "/Department/DeleteDepartment", {
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

  public async BankEdit(Id: number, bankName: string): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const bankData: editBankInput = { BankId: Id, BankName: bankName, token: localStorage.getItem('token') };
      const resp = this.http.put<responseStatus>(this.apiUrl + "/Bank/EditBank", bankData, {headers: this.token});
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
      const resp = this.http.delete<responseStatus>(this.apiUrl + "/Bank/DeleteBank", {
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

  public async DoctorEdit(Id: number, doctorName: string, department: number, isReferring: boolean): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const doctorData: editDoctorInput = { DoctorId: Id, DoctorName: doctorName, department: department, isReferring: isReferring, token: localStorage.getItem('token') };
      const resp = this.http.put<responseStatus>(this.apiUrl + "/Doctor/EditDoctor", doctorData, {headers: this.token});
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

  public async EmployeeEdit(Id: number, employeeName: string, canAuthorize: boolean): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const employeeData: editEmployeeInput = { EmployeeId: Id, EmployeeName: employeeName, CanAuthorizePatients: canAuthorize, token: localStorage.getItem('token') };
      const resp = this.http.put<responseStatus>(this.apiUrl + "/Employee/EditEmployee", JSON.stringify(employeeData), {headers: this.token});
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

interface editDepartmentInput {
  DepartmentId: number,
  DepartmentName: string;
  token: string | null;
}

interface editBankInput {
  BankId: number,
  BankName: string;
  token: string | null;
}

interface editCompanyInput {
  CompanyName: string;
  CompanyId: number;
  token: string | null;
}

interface editDoctorInput {
  DoctorId: number,
  DoctorName: string;
  department: number;
  isReferring: boolean;
  token: string | null;
}

interface editEmployeeInput {
  EmployeeId: number;
  EmployeeName: string;
  CanAuthorizePatients: boolean;
  token: string | null;
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