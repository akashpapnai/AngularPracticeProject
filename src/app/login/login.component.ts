import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginService } from '../login.service';
import { CookieService } from 'ngx-cookie-service'
import { ActivatedRoute, Router } from '@angular/router';

interface LoginObj {
  userName:string,
  password:string
}

interface SignUpObj {
  userName: string,
  email: string,
  password: string,
  rptPassword: string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(
    private ele: ElementRef, 
    private http: HttpClient, 
    private lService: LoginService, 
    private cService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      if('signUp' in params) {
        this.values.isSignIn = 2;
      }
    })

  if(this.cService.get('user')) {
      const user = this.cService.get('user');
      if(user !== null && this.values.isSignIn === 1){
        const deserializedUser = JSON.parse(user);
        if(deserializedUser['loginName'] !== null ) {
          debugger;
          this.router.navigate(['/homePage']); // , {queryParams: { signUp: false }}
        }
      }
    }
  }

  public values = { isSignIn: 1 }

  public loginObj: LoginObj = { userName:"",password:"" };

  public signUpObj: SignUpObj = { userName:"",password:"",email:"", rptPassword:"" };

  public async signInBtnClick(form: NgForm) {
    
    const apiURL = this.lService.__apiURL__;
    
    this.http.post(apiURL+"/User/Login", this.loginObj).subscribe(
      { 
        next: (data) => {
          if('errorCode' in data && 'message' in data) {
            this.loginObj.userName = "";
            this.loginObj.password = "";
            alert('No user found with username: '+this.loginObj.userName);
          }
          else if('userName' in data && 'loginName' in data) {
            this.cService.set('user', JSON.stringify(data));
            alert('Login Success.');
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.loginObj.userName = "";
          this.loginObj.password = "";
          alert("Error Response from Server");
        }
      }
    )
  }
  public signUpBtnClick() {
  }
  public sendVerificationLink() {
    if(this.loginObj.userName.trim() === "") {
      alert('Please enter email id');
    }
  }
  public checkPassword():boolean {
    if(this.signUpObj.password.length > 0 && this.signUpObj.rptPassword.length > 0) {
      if(this.signUpObj.password !== this.signUpObj.rptPassword) {
        return false;
      }
    }
    return true;
  }
}
