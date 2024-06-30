import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { SubmitResultComponent } from '../submit-result/submit-result.component';
import { ContestService } from 'src/app/ApiServices/contest.service';

@Component({
  selector: 'app-submit-problem',
  templateUrl: './submit-problem.component.html',
  styleUrls: ['./submit-problem.component.css']
})
export class SubmitProblemComponent implements OnInit {
 
  compilers:any=[]
  isLoading:boolean = false;
  apiError:string = '';
  apiResponse:any;
  languages:any = [];
  contestId: any;

  
  submitProblemForm: FormGroup = new FormGroup({
    problemCode: new FormControl(this.data.problemCode),
    ojType: new FormControl(this.data.source),
    solutionCode: new FormControl("", [Validators.required]),
    isOpen: new FormControl(true, [Validators.required]),
    idValue: new FormControl("", [Validators.required]),
  });

  constructor(
    private _contestService: ContestService ,
    private _ProblemService: ProblemService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (this.data.inContest){
      this.contestId = this.data.contestId;
    }
    this.getCompilers();
  }


  handleSubmitProblem(){
    this.isLoading = true;
    if(this.submitProblemForm.valid){
      console.log(this.data.problemCode)
      let submitionRequest = {
        code: this.data.problemCode,
        ojType: this.data.source,
        solutionCode: this.submitProblemForm.value.solutionCode,
        isOpen: this.submitProblemForm.value.isOpen,
        compiler: {
          idValue: this.submitProblemForm.value.idValue,
          name: this.languages.find((lang:any)=> lang.idValue === this.submitProblemForm.value.idValue).name
        }
      }
      console.log(submitionRequest);
      console.log("incontest " +this.data.inContest);
      let submitProblem$ = (this.data.inContest)? this.submitToContest(this.contestId , submitionRequest) : this.submitGeneral(submitionRequest);
      this.dialog.closeAll();
      this.dialog.open(SubmitResultComponent, {
        data: { 
          response: submitProblem$,
          submit: true,
          dummy: {
            verdict: "In Queue",
            language: submitionRequest.compiler.name,
            submitTime: Date.now() / 1000,
            timeUsage: "0 ms",
            memoryUsage: "0 KB",
            isOpen: submitionRequest.isOpen,
            solution: submitionRequest.solutionCode
          }
        },
        width: '70%',
        height: 'auto'
      });
    }
  }

  getCompilers() {
    this._ProblemService.getCompilersForSubmitProblem(this.data.source).subscribe({
      next: (response) => {
        console.log(response)
        this.languages = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  submitToContest(contestId , data){
    return this._contestService.submitToContest(contestId , data);
  }

  submitGeneral(data){
    return this._ProblemService.submitProblem(data);
  }
 
}
