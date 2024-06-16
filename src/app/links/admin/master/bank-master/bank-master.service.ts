import { Injectable } from '@angular/core';
import { LoginService } from '../../../../login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BankMasterService {

  constructor(private lService: LoginService, private http: HttpClient) { }

  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public async addBank(data: AddBankModel): Promise<any> {
    return new Promise<any>(async (resolve) => {
      let alrt: any = {};
      const newComp = await this.http.post<bankAddStatus>(this.apiUrl + '/Bank/AddBank', JSON.stringify(data), { headers: this.token });

      newComp.subscribe(
        {
          next: (data) => {
            if (data.status > 0) {
              alrt = { message: 'Bank added Successfully', status: 1 };
            }
            else if (data.status === -10) {
              alrt = { message: 'Bank already exists!!', status: 0 };
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

  public getAllBanks(): Promise<Bank[]> {
    return new Promise<Bank[]>(async (resolve) => {
      const newComp = await this.http.get<BankData>(this.apiUrl + '/Bank/GetAllBanks', { headers: this.token });
      newComp.subscribe({
        next: (data) => {
          resolve(data.allBanks);
        },
        error: (error) => {
          console.error(error);
          resolve([]);
        }
      });
    });
  }
}

interface bankAddStatus {
  status: number
}


export interface AddBankModel {
  BankName: string | null,
  Token: string | null
}

export interface BankData {
  allBanks: Bank[]
}

export interface Bank {
  bankId: number;
  bankName: number,
  isActive: string;
  createdBy: string;
  row: number;
}