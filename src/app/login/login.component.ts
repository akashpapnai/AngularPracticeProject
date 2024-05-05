import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
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

  public dontNavigate = true;
  
  async ngOnInit(): Promise<void> {
    
    this.dontNavigate = true;
    this.route.queryParams.subscribe(params => {
      if('signUp' in params) {
        this.values.isSignIn = 2;
        this.dontNavigate = false;
      }
    })

  if(localStorage.getItem('token') && this.dontNavigate) {
      const token = localStorage.getItem('token')

      const checkToken = await this.http.get(this.lService.__apiURL__ + `/User/IsTokenValid?token=${token}`);

      checkToken.subscribe(
        {
          next: () => {
            this.router.navigate(['/']);
          },
          error: ()=> {
            alert('Error Response from Server')
          }
        }
      )
    }
  }

  public values = { isSignIn: 1 }

  public loginObj: LoginObj = { userName:"",password:"" };

  public signUpObj: SignUpObj = { userName:"",password:"",email:"", rptPassword:"" };

  public async signInBtnClick(form: NgForm) {
    
    const apiURL = this.lService.__apiURL__;
    
    const logIn = await this.http.post(apiURL+"/User/Login", this.loginObj);

    logIn.subscribe(
      { 
        next: (data) => {
          var obj = JSON.parse(JSON.stringify(data));
          
          if('token' in obj) {
            localStorage.setItem('token', obj['token']);
            this.router.navigate(['/']);
          }
        },
        error: (data) => {
          if(data.status == 400) {
            this.loginObj.userName = "";
            this.loginObj.password = "";
            alert(data.error.invalidUser);
          }
          else {
            alert("Error Response from Server");
          }
        }
      }
    )
  }
  public async signUpBtnClick(form: NgForm) {
    const apiURL = this.lService.__apiURL__;

    const postObj = {email:this.signUpObj.email, loginName: this.signUpObj.userName, password: this.signUpObj.password };
    
    const signUp = await this.http.post(apiURL+"/User/Register", postObj);


    signUp.subscribe(
      { 
        next: (data) => {
          var obj = JSON.parse(JSON.stringify(data));
          
          if('token' in obj) {
            localStorage.setItem('token', obj['token']);
            alert(obj['message']);
            this.router.navigate(['/']);
          }
        },
        error: (data) => {
          if(data.status == 400) {
            this.loginObj.userName = "";
            this.loginObj.password = "";
            alert(data.error.message);
          }
          else {
            alert("Error Response from Server");
          }
        }
      }
    )
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
