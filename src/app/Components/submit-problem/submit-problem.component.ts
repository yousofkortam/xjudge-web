import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProblemService } from 'src/app/ApiServices/problem.service';

@Component({
  selector: 'app-submit-problem',
  templateUrl: './submit-problem.component.html',
  styleUrls: ['./submit-problem.component.css']
})
export class SubmitProblemComponent implements OnInit {
 @Input() problemCode:string = '';
  @Input() onlineJudge:string = '';
 
  compilers:any=[]
  isLoading:boolean = false;
  apiError:string = '';
  languages:any = [];

  submitProblemForm: FormGroup = new FormGroup({
  problemCode: new FormControl(this.problemCode),
  ojType: new FormControl(this.onlineJudge),    
  solutionCode: new FormControl("", [Validators.required]),
  isOpen: new FormControl(true, [Validators.required]),    
  idValue: new FormControl("", [Validators.required]),});

  constructor(
    private _ProblemService: ProblemService, private _Router:Router) {}

  ngOnInit(): void {
    this._ProblemService.getCompilersForSubmitProblem(this.onlineJudge).subscribe({
      next: (response) => {
        this.languages = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  handleSubmitProblem(){
    this.isLoading = true;
    if(this.submitProblemForm.valid){
      let submitionRequest = {
        problemCode: this.problemCode,
        ojType: this.onlineJudge,
        solutionCode: this.submitProblemForm.value.solutionCode,
        isOpen: this.submitProblemForm.value.isOpen,
        compiler: {
          idValue: this.submitProblemForm.value.idValue,
          name: ""
        }
      }
      console.log(submitionRequest);
      this._ProblemService.submitProblem(submitionRequest).subscribe({
        next: (response)=> {
          if (response.success === true) {
            console.log(response);
            this.isLoading = false;
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
