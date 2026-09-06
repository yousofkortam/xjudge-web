import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  isLoading:boolean = false;
  validationErrors: any = {};
  apiError:string = '';
  successMessage: string = '';
  showPassword = false;
  token: string = '';

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    // Field name must match the backend's ChangePasswordRequest.newPassword.
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.rePasswordMatch });

  constructor (
    private _AuthService:AuthService,
    private _snackBar: MatSnackBar,
    private _ActivatedRoute:ActivatedRoute,
    private titleService: Title) {
    this._ActivatedRoute.queryParams.subscribe(value => {
      this.token = value['token'] ?? '';
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Change Password');
  }

  rePasswordMatch(resetPasswordForm:any) {
      let password =  resetPasswordForm.get('newPassword');
      let rePassword =  resetPasswordForm.get('confirmPassword');
      if(password.value === rePassword.value)
      {
        return null;
      }
      else
      {
        rePassword.setErrors({ Match : "Password and confirm password doesn't match" });
        return { Match : "Password and confirm password doesn't match" };
      }
  }

  handleChangePassword(changePasswordForm: FormGroup) {
    if (this.isLoading) return;
    if (changePasswordForm.invalid) {
      changePasswordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};
    this._AuthService.changePassword(changePasswordForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        // The change-password endpoint returns `{statusCode, message}` — it does
        // not issue a new token, so nothing may be written to session storage here.
        this.successMessage = response?.message || 'Your password has been changed.';
        this._snackBar.open(this.successMessage, 'Close', { duration: 5000, verticalPosition: 'top' });
        changePasswordForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.validationErrors = apiValidationErrors(err);
        this.apiError = apiErrorMessage(err);
        this._snackBar.open(this.apiError, 'Close', { duration: 6000, verticalPosition: 'top' });
      }
    });
  }

}