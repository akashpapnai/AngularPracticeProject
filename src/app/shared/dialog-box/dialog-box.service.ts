import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../../login.service';

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

 public async CompanyEdit(Id: number): Promise<string> {
  return new Promise<string>(async (resolve) => {
   const companyData: editCompanyInput = { CompanyId: Id };
   const resp = await this.http.put<responseStatus>(this.apiUrl + "/Company/EditCompany", JSON.stringify(companyData));
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
}

interface editInput {
 DepartmentId: number,
}

interface editBankInput {
 BankId: number,
}

interface editCompanyInput {
 CompanyId: number
}

interface editDoctorInput {
 DoctorId: number
}

interface responseStatus {
 status: number
}