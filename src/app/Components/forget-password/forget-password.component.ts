import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  apiError: string = '';
  successMessage: string = '';
  validationErrors: Record<string, string> = {};
  isLoading: boolean = false;

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private _AuthService: AuthService,
    private _snackBar: MatSnackBar,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Forget Password');
  }

  handleForgetPassword(forgetPasswordForm: FormGroup) {
    if (this.isLoading) return;
    if (forgetPasswordForm.invalid) {
      forgetPasswordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};
    this._AuthService.forgetPassword(forgetPasswordForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response?.message || 'If that address has an account, a reset link is on its way.';
        this._snackBar.open(this.successMessage, 'Close', { duration: 8000, verticalPosition: 'top' });
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