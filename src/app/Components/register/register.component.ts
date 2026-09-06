import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

/** Mirrors the backend's RegisterRequest constraint so the user finds out before submitting. */
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLoading = false;
  apiError = '';
  successMessage = '';
  showPassword = false;
  validationErrors: Record<string, string> = {};

  registerForm: FormGroup = new FormGroup({
    userFirstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z]+$/)]),
    userLastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z]+$/)]),
    userHandle: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(PASSWORD_RULE)]),
  });

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Create account · X-Judge');
    if (this._AuthService.isLogin()) void this._Router.navigate(['/home']);
  }

  handleRegister(registerForm: FormGroup): void {
    if (this.isLoading) return;
    if (registerForm.invalid) {
      registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.successMessage = '';
    this.validationErrors = {};

    this._AuthService.register(registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response?.message || 'Account created. Check your inbox to verify your email address.';
        registerForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.validationErrors = apiValidationErrors(err);
        this.apiError = apiErrorMessage(err);
      }
    });
  }
}
