import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { SubmitResultComponent } from '../submit-result/submit-result.component';

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
  submitProblemForm: FormGroup = new FormGroup({
    problemCode: new FormControl(this.data.problemCode),
    ojType: new FormControl(this.data.source),
    solutionCode: new FormControl("", [Validators.required]),
    isOpen: new FormControl(true, [Validators.required]),
    idValue: new FormControl("", [Validators.required]),
  });

  constructor(
    private _ProblemService: ProblemService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getCompilers();
  }


  handleSubmitProblem(){
    this.isLoading = true;
    if(this.submitProblemForm.valid){
      let submitionRequest = {
        problemCode: this.data.problemCode,
        ojType: this.data.source,
        solutionCode: this.submitProblemForm.value.solutionCode,
        isOpen: this.submitProblemForm.value.isOpen,
        compiler: {
          idValue: this.submitProblemForm.value.idValue,
          name: this.languages.find((lang:any)=> lang.idValue === this.submitProblemForm.value.idValue).name
        }
      }
      console.log(submitionRequest);
      let submitProblem$ = this._ProblemService.submitProblem(submitionRequest);
      this.dialog.closeAll();
      this.dialog.open(SubmitResultComponent, {
        data: { 
          response: submitProblem$,
          submit: true,
          dummy: {
            verdict: "In Queue",
            language: submitionRequest.compiler.name,
            submitTime: "Now",
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
        this.languages = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

 
}
