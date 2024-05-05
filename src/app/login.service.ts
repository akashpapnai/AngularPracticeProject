import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public __apiURL__:string = 'https://akashpapnai.bsite.net';
  constructor() { }
}
