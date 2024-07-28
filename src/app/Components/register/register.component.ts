import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;
  validationErrors: any = {};
  apiError: string = '';


  registerForm: FormGroup = new FormGroup({
    userFirstName: new FormControl('', [Validators.required]),
    userLastName: new FormControl('', [Validators.required]),
    userHandle: new FormControl('', [Validators.required]),
    userEmail: new FormControl('', [Validators.required]),
    userPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _snackBar: MatSnackBar,
    private titleService: Title) {
    if (this._AuthService.isLogin()) {
      this._AuthService.decodeUserData();
      this._Router.navigate(['/home']).then(r => r);
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Register');
  }

  handleRegister(registerForm: FormGroup) {
    this.isLoading = true;
    if (registerForm.valid) {
      this._AuthService.register(registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this._snackBar.open(response.message, 'close', {
            duration: 5000,
            verticalPosition: 'top',
          });
        },
        error: (err) => {
          console.log(err);
          this.validationErrors = err.error.validations || {};
          console.log(this.validationErrors.userHandle); // Log the validationErrors object
          this.apiError = err.error.message;
          console.log(this.apiError)
          this.isLoading = false;

        }
      });
    }
  }

}