import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyMasterService {
  constructor(private lService: LoginService) { }
  
  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  public addCompany(data: company) {
    console.log(data);
  }
}

interface company {
  CompanyName: string
}
