import { Component } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isLoading:boolean = false;
  apiError:string = '';

  loginForm: FormGroup = new FormGroup({
    userHandle:new FormControl(null, [Validators.required]),
    userPassword:new FormControl(null, [Validators.required ]),
  });

  constructor (
    private _AuthService:AuthService,
    private _Router:Router,
    private _snackBar: MatSnackBar) {
    if (this._AuthService.isLogin())
    {
      this._AuthService.decodeUserData();
      this._Router.navigate(['/home']).then(r => r);
    }
  }

  handleLogin(loginForm:FormGroup) {
    this.isLoading = true;
    if(loginForm.valid){
      this._AuthService.login(loginForm.value).subscribe({
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
  }

}
