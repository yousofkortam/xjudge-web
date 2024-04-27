import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})


export class ResetPasswordComponent implements OnInit {

  isLoading:boolean = false;
  apiError:string = '';
  token: string = '';

  constructor (
    private _AuthService:AuthService,
    private _Router:Router ,
    private _ActivatedRoute:ActivatedRoute,
    private _snackBar: MatSnackBar,
    private titleService: Title) {
    this._ActivatedRoute.queryParams.subscribe((value) => {
      this.token = value['token'];
      console.log(this.token);
  })
  }

  ngOnInit(): void {
    this.titleService.setTitle('Reset Password');
  }

  resetPasswordForm = new FormGroup({
    password:new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*$')]),
    confirmPassword:new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*$')]),
  },{validators: this.rePasswordMatch});


  rePasswordMatch(resetPasswordForm:any) {
      let password =  resetPasswordForm.get('password');
      let rePassword =  resetPasswordForm.get('confirmPassword');
      if(password.value === rePassword.value)
      {
        return null;
      }
      else
      {
        rePassword.setErrors({match : "Password and confirm password doesn't match"});
        return {match : "Password and confirm password doesn't match"};
      }
  }

  handleResetPassword() {
      this.isLoading = true;
      const requestBody = {
        token: this.token,
        password: this.resetPasswordForm.get('password')?.value,
        confirmPassword: this.resetPasswordForm.get('confirmPassword')?.value
      };
      this._AuthService.resetPassword(requestBody).subscribe({
      next: (response)=> {
          if(response.success === true){
            this.isLoading= false;
            this._snackBar.open(response.data.message, 'close', {
              duration: 2000,
              verticalPosition: 'top',
            });
            this._Router.navigate(["/login"]).then(r => r);
        }
     },
     error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.apiError = err.error.error.message;

        this._snackBar.open(this.apiError, 'close', {
          duration: 2000,
          verticalPosition: 'top',
        });
        }
     });
    }

}
