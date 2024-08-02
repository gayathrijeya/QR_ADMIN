import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginMaster } from '../modal/loginModal';
import { LoginService } from '../Services/login.service';
import Swal from 'sweetalert2';
import { json } from 'stream/consumers';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {


  public loginMaster: LoginMaster = new LoginMaster();

  ngRemeberme: boolean = false;
  RemCheck: any;
  constructor(private router: Router, public Service: LoginService) {

  }

  ngOnInit(): void {
    // if (this.Service.isLoggeIn()) {
    //   this.router.navigateByUrl('/dashboard');
    // }
    debugger
    this.RemCheck = localStorage.getItem("Rem");
    const eText = localStorage.getItem('Rem') || '';
    const decryptedWord = CryptoJS.AES.decrypt(eText, 'data_key');
    let data = JSON.parse(decryptedWord.toString(CryptoJS.enc.Utf8))


    //  let data = JSON.parse(this.RemCheck)
    if (data != null) {
      this.loginMaster.UserName = data.userName;
      this.loginMaster.Password = data.password;
      this.ngRemeberme = data.RememberMe;
    }

  }


  LoginCheck() {
    this.Service.LoginAuth(this.loginMaster.UserName, this.loginMaster.Password).subscribe((res: any) => {
      console.log(res, "login");
      let data = res
      debugger
      if (data != '') {
        localStorage.setItem('UserId', data[0].id);
        localStorage.setItem('UserName', data[0].name);
        this.RememberMeFn();
        this.router.navigateByUrl('/dashboard');
        //  this.router.navigateByUrl('/dashboard');

      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "In-Valid Credential"
        });
      }
    })
  }


  RememberMeFn() {
    if (this.ngRemeberme == true) {
      var obj = {
        userName: this.loginMaster.UserName,
        password: this.loginMaster.Password,
        RememberMe: this.ngRemeberme
      }
      debugger
      const ecntyptedData = CryptoJS.AES.encrypt(JSON.stringify(obj), 'data_key').toString();
      localStorage.setItem("Rem", ecntyptedData)
    } else if (this.ngRemeberme == false) {
      localStorage.removeItem("Rem");
    }
  }




  //Reset Password

  ShowOtpSection: boolean = false;

  ShowOtpEnterSection: boolean = false;
  ShowRestPassword: boolean = false;
  ShowOtp() {
    this.ShowOtpSection = true;
    this.ShowOtpEnterSection = false;
    this.ShowRestPassword = false;
  }

  BackToLogin() {
    this.ShowOtpSection = false;
    this.ShowOtpEnterSection = false;
    this.ShowRestPassword = false;
  }

  GotoOtpArea() {
    this.ShowOtpSection = false;
    this.ShowOtpEnterSection = true;
    this.ShowRestPassword = false;
  }


  GotoResetPassword() {
    this.ShowOtpSection = false;
    this.ShowOtpEnterSection = false;
    this.ShowRestPassword = true;
  }
  registeredEmail: any;
  ResetPassword: any;
  ReenterPassword: any;

  SendOtpFn() {
    this.Service.CheckMail(this.registeredEmail).subscribe((res: any) => {
      console.log(res, "mail");
      if (res == 'sent') {
        this.GotoOtpArea();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'OTP Sented To Your Mail',
          showConfirmButton: false,
          timer: 1500
        })
        this.ResetPassword= '';
      } else if (res == 'EmailNotExsist') {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email Not Exist",
          footer: 'Try Again or Contect Print Preview'
        });
      } else if (res == 'noEmailFound') {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email Not Found",
          footer: 'Try Again or Contect Print Preview'
        });
      }

    })
  }
  public otpInputs = [0, 1, 2, 3];
  public otp = Array(this.otpInputs.length).fill('');
  verifyOtp() {
    const enteredOtp = this.otp.join(''); // Convert array to a single string (e.g., "1234")
    console.log(enteredOtp);
    this.Service.VerifyOTP(enteredOtp, this.registeredEmail).subscribe((res: any) => {
      debugger
      if (res == 'OTP verified successfully!') {
        localStorage.setItem('OTP', res)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res,
          showConfirmButton: false,
          timer: 1500,
        })
        this.GotoResetPassword();
      } else {
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: res,
          showConfirmButton: false,
          timer: 3000
        })
      }
    });
  }


  onOtpChange(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    if (!/^[0-9]*$/.test(inputValue)) {
      input.value = '';
      return;
    }

    if (inputValue === '') {
      if (index > 0) {
        const previousInput = document.getElementById('otp' + (index - 1));
        if (previousInput) {
          previousInput.focus();
        }
      }
    } else {
      if (index < this.otpInputs.length - 1) {
        const nextInput = document.getElementById('otp' + (index + 1));
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      if (!this.otp[index] && index > 0) {
        event.preventDefault();
        const previousInput = document.getElementById('otp' + (index - 1));
        if (previousInput) {
          previousInput.focus();
        }
      }
    }
  }



  ResetPasswordFn() {
    if (this.ResetPassword == this.ReenterPassword) {
      this.Service.ResetPassword(this.ResetPassword, this.registeredEmail).subscribe((res: any) => {
        if (res == "updated") {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: "Password Reset Successfully",
            showConfirmButton: false,
            timer: 1500,
          })
          this.ShowOtpSection = false;
          this.ShowOtpEnterSection = false;
          this.ShowRestPassword = false;
          this.ResetPassword= '';
          this.registeredEmail='';
        }else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something Went Wrong",
          });
        }
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Not Matching",
        footer: 'Enter Password and Re-enter Password should Match'
      });
    }
  }



}
