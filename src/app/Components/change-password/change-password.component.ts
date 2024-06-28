import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  isLoading:boolean = false;
  apiError:string = '';
  token: string = '';

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*$')]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*$')]),
    confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*$')]),
  }, { validators: this.rePasswordMatch });

  constructor (
    private _AuthService:AuthService,
    private _ActivatedRoute:ActivatedRoute,
    private titleService: Title) {
    this._ActivatedRoute.queryParams.subscribe(
      value=>{
        this.token = value[('token')];
        console.log(this.token)
      });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Change Password');
  }

  rePasswordMatch(resetPasswordForm:any) {
      let password =  resetPasswordForm.get('password');
      let rePassword =  resetPasswordForm.get('confirmPassword');
      if(password.value === rePassword.value)
      {
        return null;
      }
      else
      {
        rePassword.setErrors({ Match : "Password and confirm password doesn't match" });
        return { Match : "Password and confirm password doesn't match" };
      }
  }

  handleChangePassword(changePasswordForm: FormGroup) {
    this.isLoading = true;
    this._AuthService.changePassword(changePasswordForm.value).subscribe({
      next: (response) => {
        if(response.statusCode === 200)
        {
            console.log(response);
            this.isLoading = false;
            window.alert(response.message)
            localStorage.setItem("userToken", response.token);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.apiError = "Current Password Is Wrong! Please Try Again";
      }
    })
  }

}