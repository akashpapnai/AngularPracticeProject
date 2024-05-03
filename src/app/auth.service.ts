import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";

@Injectable ({
   providedIn: 'root'
})

export class AuthService {

   constructor(
   ) {}

   isLoggedIn():boolean {
      try {
         debugger;
         if(localStorage.getItem('token')) {
            return true;
         }
         return false;
      }
      catch(ex) {
         return false;
      }
   }
}
