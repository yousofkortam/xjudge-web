import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl , Validators} from '@angular/forms';
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

  isLoading:boolean = false;
  apiError:string = '';
  validations: any;

  registerForm: FormGroup = new FormGroup({
    userFirstName:new FormControl(null, [Validators.required ,Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]+$')]),
    userLastName:new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]+$')]),
    userHandle:new FormControl(null, [Validators.required,  Validators.maxLength(20)]),
    userEmail:new FormControl(null, [Validators.required, Validators.email]),
    userPassword:new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*$')]),
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
    this.titleService.setTitle('Register');
  }

  handleRegister(registerForm:FormGroup) {
    this.isLoading = true;
    if(registerForm.valid){
      this._AuthService.register(registerForm.value).subscribe({
        next: (response )=> {
          if(response.success === true){
            this.isLoading= false;
            this._snackBar.open(response.data.message, 'close', {
              duration: 5000,
              verticalPosition: 'top',
            });
          }
        },
        error: (response)=> {
          console.log(response);
          this.isLoading = false;
          this.apiError = response.error.error.message;
          this.validations = response.error.error.validations;
        }
      });
    }
  }

}
