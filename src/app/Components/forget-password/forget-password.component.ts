import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/ApiServices/auth.service';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  apiError: string = "";
  validationErrors: any 
  isLoading: boolean = false;

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required])
  });

  constructor(
    private _AuthService: AuthService,
    private _snackBar: MatSnackBar,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Forget Password');
  }

  handleForgetPassword(forgetPasswordForm:FormGroup) {
    this.isLoading = true;
    if(forgetPasswordForm.valid){
      this._AuthService.forgetPassword(forgetPasswordForm.value).subscribe({
        next: (response) => {
          console.log(response);
          if (response.success === true) {        
            this._snackBar.open(response.data.message, 'close', {
              duration: 5000,
              verticalPosition: 'top',
            });
            localStorage.setItem("isSendCode", 'true');
           this.isLoading = false;
      }
         
        },
        error: (err) => {
          console.log(err)
          this.validationErrors = err.error.error.message ;
           console.log(this.validationErrors)
          // this.apiError = err.error.message;         
          // this._snackBar.open(this.apiError, 'close', {
          //   duration: 2000,
          //   verticalPosition: 'top',
          // });
           this.isLoading = false;   
    }
      })
  }
  }
}