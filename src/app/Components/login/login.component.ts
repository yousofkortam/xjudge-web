import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  /** Short heading above the error text; set from the HTTP status. */
  errorTitle = 'Sign-in failed';
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
    // Clear the previous failure so a retry never leaves a stale message on
    // screen next to a fresh one.
    this.apiError = '';
    this.sessionExpired = false;
    this.validationErrors = {};

    this._AuthService.login(loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        // The backend answers `{statusCode, token}` once the envelope is
        // unwrapped. Anything else must not be written to storage — a bad value
        // there is what used to break the app on the next page load.
        if (!this._AuthService.setSession(response?.token)) {
          this.errorTitle = 'Session could not be started';
          this.apiError = 'The server accepted your credentials but did not return a usable session. Please try again.';
          return;
        }
        void this._Router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.validationErrors = apiValidationErrors(err);
        this.errorTitle = errorTitleFor(err?.status);
        this.apiError = apiErrorMessage(err);
      }
    });
  }
}

/** A short, human heading for the alert; the detail comes from the API message. */
function errorTitleFor(status: number | undefined): string {
  switch (status) {
    case 0:   return 'Cannot reach the server';
    case 401:
    case 403: return 'Sign-in failed';
    case 429: return 'Too many attempts';
    default:  return status && status >= 500 ? 'Server error' : 'Sign-in failed';
  }
}

function isAuthRoute(url: string): boolean {
  return /^\/(login|register|forgetPassword|resetPassword)\b/.test(url);
}
