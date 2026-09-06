import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})


export class ResetPasswordComponent implements OnInit {

  isLoading: boolean = false;
  apiError: string = '';
  validationErrors: Record<string, string> = {};
  showPassword = false;
  token: string = '';

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private titleService: Title) {
    this._ActivatedRoute.queryParams.subscribe((value) => {
      this.token = value['token'] ?? '';
    })
  }

  ngOnInit(): void {
    this.titleService.setTitle('Reset Password');
  }

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/)]),
    confirmPassword: new FormControl('', [Validators.required]),
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
    if (this.isLoading) return;
    if (resetPasswordForm.invalid) {
      resetPasswordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};
    this._AuthService.resetPassword({
      token: this.token,
      password: resetPasswordForm.get('password')?.value,
      confirmPassword: resetPasswordForm.get('confirmPassword')?.value,
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._snackBar.open(response?.message || 'Password updated. You can sign in now.', 'Close', {
          duration: 5000, verticalPosition: 'top',
        });
        void this._Router.navigate(['/login']);
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