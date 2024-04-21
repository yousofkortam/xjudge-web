import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProblemService } from 'src/app/ApiServices/problem.service';

@Component({
  selector: 'app-submit-problem',
  templateUrl: './submit-problem.component.html',
  styleUrls: ['./submit-problem.component.css']
})
export class SubmitProblemComponent {

  isLoading:boolean = false;
  apiError:string = '';
  submitProblemForm: FormGroup = new FormGroup({
     language:new FormControl(null, [Validators.required]),
     solution:new FormControl(null, [Validators.required ]),
  });

  constructor(
    private _ProblemService: ProblemService, private _Router:Router) {}


  handleSubmitProblem(submitProblemForm:FormGroup){
    this.isLoading = true;
    if(submitProblemForm.valid){
      this._ProblemService.submitProblem(submitProblemForm.value).subscribe({
        next: (response)=> {
          if (response.success === true) {
            localStorage.setItem('userToken', response.token);
            this._Router.navigate(['/home']).then(r => r);
            this.isLoading= false;
          }
        },
        error: (err)=> {
          this.isLoading = false;
          this.apiError = err.error.message;
        }
      });
    }
  }

}
