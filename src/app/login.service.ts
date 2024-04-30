import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public __apiURL__:string = 'https://localhost:5203';
  constructor() { }
}
