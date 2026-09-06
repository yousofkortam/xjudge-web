import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  apiError = '';
  sessionExpired = false;
  showPassword = false;
  validationErrors: Record<string, string> = {};

  loginForm: FormGroup = new FormGroup({
    userHandle: new FormControl('', [Validators.required]),
    userPassword: new FormControl('', [Validators.required]),
  });

  private returnUrl = '/home';

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Sign in · X-Judge');

    const params = this._route.snapshot.queryParamMap;
    this.sessionExpired = params.get('session') === 'expired';
    // Never bounce back to an auth page, or the redirect chases its own tail.
    const requested = params.get('returnUrl');
    if (requested && requested.startsWith('/') && !isAuthRoute(requested)) {
      this.returnUrl = requested;
    }

    // Already signed in and arriving at /login by hand: send the user onwards.
    if (this._AuthService.isLogin()) {
      void this._Router.navigateByUrl(this.returnUrl);
    }
  }

  handleLogin(loginForm: FormGroup): void {
    if (this.isLoading) return;               // guards against double submits
    if (loginForm.invalid) {
      loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};

    this._AuthService.login(loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        // The backend answers `{statusCode, token}` once the envelope is
        // unwrapped. Anything else must not be written to storage — a bad value
        // there is what used to break the app on the next page load.
        if (!this._AuthService.setSession(response?.token)) {
          this.apiError = 'Sign-in succeeded but the server did not return a usable session. Please try again.';
          this._snackBar.open(this.apiError, 'Close', { duration: 5000, verticalPosition: 'top' });
          return;
        }
        void this._Router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.validationErrors = apiValidationErrors(err);
        this.apiError = apiErrorMessage(err);
        this._snackBar.open(this.apiError, 'Close', { duration: 5000, verticalPosition: 'top' });
      }
    });
  }
}

function isAuthRoute(url: string): boolean {
  return /^\/(login|register|forgetPassword|resetPassword)\b/.test(url);
}
