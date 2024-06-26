import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  isLoading: boolean = false;
  apiError: string = '';
  validations: any;

  registerForm = new FormGroup({
    userFirstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    userLastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    userHandle: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    userEmail: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.email,
    ]),

    userPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _snackBar: MatSnackBar,
    private titleService: Title
  ) {
    if (this._AuthService.isLogin()) {
      this._AuthService.decodeUserData();
      this._Router.navigate(['/home']).then((r) => r);
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Register');
  }

  // toasters
  handleRegister() {
    this.isLoading = true;
    if (this.registerForm.valid) {
      this._AuthService.register(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.success === true) {
            this.isLoading = false;
            this._snackBar.open(response.data.message, 'close', {
              duration: 5000,
              verticalPosition: 'top',
            });

            
          }
        },
        error: (response) => {
          console.log(response);
          this.isLoading = false;
          this.apiError = response.error.error.message;
          this.validations = response.error.error.validations || {};
          
        },
      });
    }
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    }
  }
}
