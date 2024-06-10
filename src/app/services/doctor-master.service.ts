import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorMasterService {

  constructor(private http:HttpClient, private lService: LoginService) { }
  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public async addDoctor(data: AddDoctorModel): Promise<any> {
    return new Promise<any>(async (resolve) => {
      let alrt: any = {};
      const newComp = await this.http.post<doctorAddStatus>(this.apiUrl + '/Doctor/AddDoctor', JSON.stringify(data), { headers: this.token });

      newComp.subscribe(
        {
          next: (data) => {
            if (data.status > 0) {
              alrt = { message: 'Doctor added Successfully', status: 1 };
            }
            else if (data.status === -10) {
              alrt = { message: 'Doctor already exists!!', status: 0 };
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

  public getAllDoctors(): Promise<Doctor[]> {
    return new Promise<Doctor[]>(async (resolve) => {
      const doctors = await this.http.get<DoctorData>(this.apiUrl + '/Doctor/GetAllDoctors', { headers: this.token });
      doctors.subscribe({
        next: (data) => {
          resolve(data.allDoctors);
        },
        error: (error) => {
          console.error(error);
          resolve([]);
        }
      });
    });
  }
}

interface doctorAddStatus {
  status: number
}


export interface AddDoctorModel {
  DoctorName: string | null,
  Token: string | null
}

export interface DoctorData {
  allDoctors: Doctor[]
}

export interface Doctor {
  doctorId: number;
  doctorName: number,
  isActive: string;
  createdBy: string;
  row: number;
}