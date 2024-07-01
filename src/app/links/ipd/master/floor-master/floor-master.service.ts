import { Injectable } from "@angular/core";
import { LoginService } from "../../../../login.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FloorMasterService {
  constructor(private lService: LoginService, private http: HttpClient) { }

  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public getAllFloors(): Promise<FloorData[]> {
    return new Promise<FloorData[]>((resolve) => {
      const newComp = this.http.get<FloorData[]>(this.lService.__apiURL__ + '/Floor/GetAllFloors', { headers: this.token });
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

  public async addFloor(data: AddFloorModel): Promise<any> {
    return new Promise<any>(async (resolve) => {
      let alrt: any = {};
      const newFloor = this.http.post<floorAddStatus>(this.lService.__apiURL__ + '/Floor/AddFloor', JSON.stringify(data), { headers: this.token });

      newFloor.subscribe(
        {
          next: (data) => {
            if (data.status > 0) {
              alrt = { message: 'Floor added Successfully', status: 1 };
            }
            else if (data.status === -10) {
              alrt = { message: 'Floor already exists!!', status: 0 };
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
}

interface floorAddStatus {
  status: number
}

export interface FloorData {
  Id: number;
  FloorName: number,
  isActive: string;
  CreatedBy: string;
  row: number;
}

export interface AddFloorModel {
  FloorName: string | null,
  Token: string | null
}