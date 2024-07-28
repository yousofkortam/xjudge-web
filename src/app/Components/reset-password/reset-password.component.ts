import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})


export class ResetPasswordComponent implements OnInit {

  isLoading: boolean = false;
  apiError: string = '';
  validationErrors: any = {}
  token: string = '';

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
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

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [Validators.required]),
  }, { validators: this.rePasswordMatch });


  rePasswordMatch(resetPasswordForm: any) {
    let password = resetPasswordForm.get('password');
    let rePassword = resetPasswordForm.get('confirmPassword');
    if (password.value === rePassword.value) {
      return null;
    }
    else {
      rePassword.setErrors({ match: "Password and confirm password doesn't match" });
      return { match: "Password and confirm password doesn't match" };
    }
  }

  handleResetPassword(resetPasswordForm: FormGroup) {
    this.isLoading = true;
    const requestBody = {
      token: this.token,
      password: this.resetPasswordForm.get('password')?.value,
      confirmPassword: this.resetPasswordForm.get('confirmPassword')?.value
    };
    this._AuthService.resetPassword(requestBody).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._snackBar.open(response.message, 'close', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this._Router.navigate(["/login"]).then(r => r);
      },
      error: (err) => {
        console.log(err);
        this.validationErrors = err.error.message
        // this.apiError = err.error.message;
        // console.log(this.apiError)
        this.isLoading = false;

        // this._snackBar.open(this.apiError, 'close', {
        //   duration: 2000,
        //   verticalPosition: 'top',
        // });
      }
    });
  }

}