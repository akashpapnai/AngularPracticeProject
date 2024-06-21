import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../../../../login.service";

@Injectable({
  providedIn: 'root'
})
export class OpdServiceService {
  constructor(private http:HttpClient, private lService: LoginService){}
  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });
  
  public async getnDaysPatients(nDays: number): Promise<opdObjectResponse[]> {
    return new Promise<opdObjectResponse[]>((resolve) => {
      const allPatients = this.http.get<opdResponse>(this.lService.__apiURL__ + "/OPD/GetNDaysOPDPatients", {
        headers: this.token, params: {
          'n': nDays
        }
      });

      allPatients.subscribe({
        next: (data) => {
          const patientsData: opdObjectResponse[] = data.nOPDPatients;
          resolve(patientsData);
        }
      });
    });
  }

  public async loadPatientsDetails(opid: string): Promise<PatientDetails> {
    return new Promise<PatientDetails>((resolve)=> {
      const patient = this.http.get<PatientDetails>(this.lService.__apiURL__ + "/OPD/GetPatientDetailsByOpid", {
        headers: this.token, params: {
          'opid': opid
        }
      });

      patient.subscribe({
        next: (data) => {
          resolve(data);
        }
      });
    });
  }
}

interface opdResponse {
  nOPDPatients: any[]
}

export interface PatientDetails {
  date: Date,
  uhid: string,
  opid: string,
  receiptNo: string,
  patientsName: string,
  age: string,
  departmentId: number,
  companyId: number,
  type: string, // Cash Patient, Cheque Patient or Online Patient
  doctorId: number
}

export interface opdObjectResponse {
  opid: string;
  uhid: string;
  patientsName: string;
  companyName: string;
  admissionDate: Date
}