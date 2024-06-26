import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';

@Component({
  selector: 'app-update-contest',
  templateUrl: './update-contest.component.html',
  styleUrls: ['./update-contest.component.css']
})
export class UpdateContestComponent implements OnInit {

  isLoading: boolean = false;
  validationsErrors: any = {};
  userGroups: any = [];
  onlineJudges: any = [];
  isGroupSelected:boolean = false;
  isGroupSelectorDisabled:boolean = false;
  enableDeleteProblem:boolean = false;
 
  constructor(
    private _ContestService: ContestService,
    private _OnlineJudgeService: OnlineJudgeService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any = {}) { }

  updateContestForm: FormGroup = new FormGroup({
    title:new FormControl(this.data.contest.title, [Validators.required]),
    durationSeconds:new FormControl(this.data.contest.durationSeconds, [Validators.required ]),
    type:new FormControl(this.data.contest.type, [Validators.required ]),
    visibility:new FormControl(this.data.contest.visibility, [Validators.required ]),
    beginTime:new FormControl(this.data.contest.beginTime, [Validators.required ]),
    problems:new FormArray([
      new FormGroup({
        problemAlias: new FormControl(this.data.contest.problems[0].problemAlias, [Validators.required]),
        ojType: new FormControl(this.data.contest.problems[0].ojType, [Validators.required]),
        code: new FormControl(this.data.contest.problems[0].code, [Validators.required]),
        problemHashtag: new FormControl(this.data.contest.problems[0].problemHashtag),
        problemWeight: new FormControl(this.data.contest.problems[0].problemWeight, [Validators.required]),
      })
    ]),
    groupId :new FormControl(0),
    password :new FormControl(this.data.contest.password),
    description :new FormControl(this.data.contest.description, [Validators.required ]),
  }, { validators: this.groupIdValidator });

  ngOnInit(): void {

  }

  handleUpdateContest() {
    this.isLoading = true;
    console.log(this.updateContestForm.value);
    this._ContestService.updateSpecificContestById(this.data.contest.id).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.dialog.closeAll();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/contest', this.data.contest.id]);
        }); 
      },
      error: (err) => {
        console.log(err);
        this.validationsErrors = err.error.errors;
        this.isLoading = false;
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
    this.updateContestForm.controls['type'].setValue('CLASSIC');
    this.updateContestForm.controls['groupId'].setValue(0);
  }

  onGroupClick() {
    this.isGroupSelected = true;
    this.updateContestForm.controls['type'].setValue('GROUP');
    if (this.data.inGroup) {
      this.updateContestForm.controls['groupId'].setValue(this.data.groupId);
    }
  }

  getFormProblems() {
    return (this.updateContestForm.get('problems') as FormArray).controls;
  }

  addNewProblemForm() {
    const problems = this.updateContestForm.get('problems') as FormArray;
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
    const problems = this.updateContestForm.get('problems') as FormArray;
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
    return this._OnlineJudgeService.getOnlineJudges().subscribe({
      next: (response)=> {
        this.onlineJudges = response.data;
      },
      error: (err)=> {
        console.log(err);
      }
    });
  }

}
