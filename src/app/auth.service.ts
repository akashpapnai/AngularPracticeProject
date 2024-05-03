
import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";

@Injectable ({
   providedIn: 'root'
})

export class AuthService {

   constructor(
      private lService: LoginService 
   ) {}

   isLoggedIn():boolean {
      try {
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
