import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';

@Component({
  selector: 'app-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css']
})
export class CreateContestComponent implements OnInit {

  isLoading:boolean = false;
  apiError:string = '';
  userGroups: any = [];

  onlineJudges: any = [];

  isGroupSelected:boolean = false;
  isGroupSelectorDisabled:boolean = false;
  enableDeleteProblem:boolean = false;
  
  createContestForm: FormGroup = new FormGroup({
    title:new FormControl(null, [Validators.required]),
    durationSeconds:new FormControl(null, [Validators.required ]),
    type:new FormControl("CLASSIC", [Validators.required ]),
    visibility:new FormControl("PUBLIC", [Validators.required ]),
    beginTime:new FormControl(null, [Validators.required ]),
    problems:new FormArray([
      new FormGroup({
        problemAlias: new FormControl(null, [Validators.required]),
        ojType: new FormControl("", [Validators.required]),
        code: new FormControl(null, [Validators.required]),
        problemHashtag: new FormControl(null),
        problemWeight: new FormControl(null, [Validators.required]),
      })
    ]),
    groupId :new FormControl(0),
    password :new FormControl(null),
    description :new FormControl(null, [Validators.required ]),
  }, { validators: this.groupIdValidator });
 
  constructor(
    private _ContestService: ContestService,
    private onlineJudgeService: OnlineJudgeService,
    private _Router: Router,
    private dialgo: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (this.data.inGroup) {
      this.isGroupSelectorDisabled = true;
      this.isGroupSelected = true;
      this.createContestForm.controls['type'].setValue('GROUP');
      this.createContestForm.controls['groupId'].setValue(this.data.groupId);
    }
    this.getOnlineJudges();
    this.getGroupsAwnedByUser();
  }


  handleCreateContest() {
    this.isLoading = true;
    const formValue = this.createContestForm.value;
    formValue.durationSeconds = formValue.durationSeconds * 60;
    const beginTimeDate = new Date(formValue.beginTime);
    formValue.beginTime = Math.floor(beginTimeDate.getTime() / 1000);
    formValue.problems.forEach((problem: any, i: number) => {
        problem.problemHashtag = this.getLetter(i);
    });
    this._ContestService.createContest(formValue).subscribe({
      next: (response)=> {
        console.log(response);
        if (response.success === true) {
          this.isLoading= false;
          this.dialgo.closeAll();
          this._Router.navigate(['/contest', response.data.id]);
        }
      },
      error: (err)=> {
        this.isLoading = false;
        this.apiError = err.error.message;
      }
    });
  }

  getGroupsAwnedByUser() {
    this._ContestService.getGrouspqwned().subscribe({
      next: (response)=> {
        this.userGroups = response.data;
      },
      error: (err)=> {
        console.log(err);
      }
    });
  }

  groupIdValidator(control: AbstractControl): ValidationErrors | null {
    const typeControl = control.get('type');
    const groupIdControl = control.get('groupId');

    if (typeControl?.value === 'GROUP' && groupIdControl?.value === 0) {
      return { "GroupRequired": true };
    }
  
    return null;
  }

  onClassicClick() {
    this.isGroupSelected = false;
    this.createContestForm.controls['type'].setValue('CLASSIC');
    this.createContestForm.controls['groupId'].setValue(0);
  }

  onGroupClick() {
    this.isGroupSelected = true;
    this.createContestForm.controls['type'].setValue('GROUP');
    if (this.data.inGroup) {
      this.createContestForm.controls['groupId'].setValue(this.data.groupId);
    }
  }

  getFormProblems() {
    return (this.createContestForm.get('problems') as FormArray).controls;
  }

  addNewProblemForm() {
    const problems = this.createContestForm.get('problems') as FormArray;
    this.enableDeleteProblem = true;
    problems.push(new FormGroup({
      problemAlias: new FormControl(null, [Validators.required]),
      ojType: new FormControl("", [Validators.required]),
      code: new FormControl(null, [Validators.required]),
      problemHashtag: new FormControl(null),
      problemWeight: new FormControl(null, [Validators.required]),
    }));
  }

  removeProblemForm(index:number) {
    const problems = this.createContestForm.get('problems') as FormArray;
    if (problems.length > 1)
      problems.removeAt(index);

    if (problems.length === 1)
      this.enableDeleteProblem = false;
  }

  getLetter(index: number) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    while (index >= 0) {
      result = letters.charAt(index % 26) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  }

  getOnlineJudges() {
    return this.onlineJudgeService.getOnlineJudges().subscribe({
      next: (response)=> {
        this.onlineJudges = response.data;
      },
      error: (err)=> {
        console.log(err);
      }
    });
  }

}

