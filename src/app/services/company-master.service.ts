import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyMasterService {
  constructor(private lService: LoginService, private http: HttpClient) { }

  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public async addCompany(data: AddCompanyModel): Promise<any> {
    return new Promise<any>(async (resolve) => {
      debugger;
      let alrt: any = {};
      const newComp = await this.http.post<compAddStatus>(this.apiUrl + '/Company/AddCompany', JSON.stringify(data), { headers: this.token });

      newComp.subscribe(
        {
          next: (data) => {
            if (data.status > 0) {
              alrt = { message: 'Company added Successfully', status: 1 };
            }
            else if (data.status === -10) {
              alrt = { message: 'Company already exists!!', status: 0 };
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

  public getAllCompanies(): Promise<CompaniesData[]> {
    return new Promise<CompaniesData[]>(async (resolve) => {
      const newComp = await this.http.get<CompaniesData[]>(this.apiUrl + '/Company/GetAllCompanies', { headers: this.token });
      newComp.subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          console.error(error);
          resolve([]);
        }
      });
    });
  }
}

interface compAddStatus {
  status: number
}

export interface AddCompanyModel {
  CompanyName: string | null,
  Token: string | null
}

export interface CompaniesData {
  companyId: number;
  companyName: number,
  isActive: string;
  createdBy: string;
  row: number;
}