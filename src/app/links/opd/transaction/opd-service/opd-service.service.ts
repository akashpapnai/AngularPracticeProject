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
}

interface opdResponse {
  nOPDPatients: any[]
}

export interface opdObjectResponse {
  opid: string;
  uhid: string;
  patientsName: string;
  companyName: string;
  admissionDate: Date
}