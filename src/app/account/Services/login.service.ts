import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public Apiurl = environment.url;
  constructor(public _httpclient: HttpClient,private router:Router) { }
 
  loginRes:any;
  LoginAuth(username: any, password: any) {
    return this._httpclient.get(this.Apiurl + "api/LoginMasters/loginCheck?username=" + username + "&password=" + password)
  }


  isLoggeIn(){
    return  !!localStorage.getItem("UserId");
  }

  logout(){
    let getData = localStorage.getItem("Rem");
    localStorage.clear()
    if (getData) {
      localStorage.setItem('Rem', getData)
    }
  }


  CheckMail(Email: any) {
    return this._httpclient.get(this.Apiurl + "api/LoginMasters/generateMasterOTP?Email=" + Email)
  }


  VerifyOTP(otp: any, email: any) {
    return this._httpclient.post(this.Apiurl + "api/LoginMasters/verifyMasterEmail?otp=" + otp + "&email=" + email, { responseType: 'text' })
  }


  ResetPassword(password: any, email: any) {
    return this._httpclient.get(this.Apiurl + "api/LoginMasters/ResetMasterPassword?password=" + password + "&email=" + email)
  }
}
