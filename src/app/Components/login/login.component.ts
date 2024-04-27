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

  loginForm = new FormGroup({
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

  handleLogin() {
    this.isLoading = true;
    if(this.loginForm.valid){
      this._AuthService.login(this.loginForm.value).subscribe({
        next: (response )=> {
          if(response.success === true){
            localStorage.setItem('userToken', response.data.token);
            this._AuthService.decodeUserData();
            this.isLoading= false;
            this._Router.navigate(['/home']).then(r => r);
          }
        },
        error: (response)=> {
          this.isLoading = false;
          this.apiError = response.error.error.message;
          this._snackBar.open(this.apiError, 'close', {
            duration: 2000,
            verticalPosition: 'top',
          });
         
        }
      });
    }
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }
  }

}
