import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public __apiURL__: string = 'https://akashpapnai.bsite.net';
  // public __apiURL__:string = 'https://localhost:7112'
  constructor() { }
}
