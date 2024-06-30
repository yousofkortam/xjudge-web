import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading:boolean = false;
  apiError:string = '';
  validationErrors:any ={}

  loginForm: FormGroup = new FormGroup({
    userHandle:new FormControl(null, [Validators.required]),
    userPassword:new FormControl(null, [Validators.required ]),
  });

  constructor (
    private _AuthService:AuthService,
    private _Router:Router,
    private _snackBar: MatSnackBar,
    private titleService: Title) {
    if (this._AuthService.isLogin())
    {
      this._AuthService.decodeUserData();
      this._Router.navigate(['/home']).then(r => r);
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }

  handleLogin(loginForm:FormGroup) {
    this.isLoading = true;
    if(loginForm.valid){
      this._AuthService.login(loginForm.value).subscribe({
        next: (response)=> { // use any right now
          if(response.success === true){
            localStorage.setItem('userToken', response.data.token);
            this._AuthService.decodeUserData();
            this.isLoading = false;
            this._Router.navigate(['/home']).then(r => r);
          }
        },
        error: (err)=> {
          console.log(err);
          this.validationErrors = err.error.error.validations || {};
          console.log(this.validationErrors.userHandle); // Log the validationErrors object
          this.apiError = err.error.error.message;
          console.log(this.apiError)
          this.isLoading = false;
          this._snackBar.open(this.apiError, 'close', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      });
    }
  }

}