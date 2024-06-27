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
  isGroupSelected: boolean = false;
  isGroupSelectorDisabled: boolean = false;
  enableDeleteProblem: boolean = false;

  updateContestForm: any;

  constructor(
    private _ContestService: ContestService,
    private _OnlineJudgeService: OnlineJudgeService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Contestdata: any = {}
  ) {}

  ngOnInit(): void {
    // Ensure data is loaded before initializing the form
    if (this.Contestdata && this.Contestdata.contest) {
      this.initializeForm();
    } else {
      console.error('Contest data is not available');
    }
  }

  initializeForm() {
    const contest = this.Contestdata.contest;
    const problems = contest.problems || [];

    this.updateContestForm = new FormGroup({
      title: new FormControl(contest.title, [Validators.required]),
      durationSeconds: new FormControl(contest.durationSeconds, [Validators.required]),
      type: new FormControl(contest.type, [Validators.required]),
      visibility: new FormControl(contest.visibility, [Validators.required]),
      beginTime: new FormControl(contest.beginTime, [Validators.required]),
      problems: new FormArray(problems.map(problem => new FormGroup({
        problemAlias: new FormControl(problem.problemAlias, [Validators.required]),
        ojType: new FormControl(problem.ojType, [Validators.required]),
        code: new FormControl(problem.code, [Validators.required]),
        problemHashtag: new FormControl(problem.problemHashtag),
        problemWeight: new FormControl(problem.problemWeight, [Validators.required]),
      }))),
      groupId: new FormControl(contest.groupId || 0),
      password: new FormControl(contest.password || ''),
      description: new FormControl(contest.description, [Validators.required]),
    }, { validators: this.groupIdValidator });
  }

  handleUpdateContest() {
     this.isLoading = true;
    console.log(this.updateContestForm.value);
    this._ContestService.updateSpecificContestById(this.Contestdata.contest.id, this.updateContestForm.value).subscribe({
      next: (res) => {
        console.log("update ya hambozo please");    
        console.log(res);
        this.isLoading = false;
        this.dialog.closeAll();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/contest', this.Contestdata.contest.id]);
        });
      },
      error: (err) => {
        console.log(err);
        this.validationsErrors = err.error.errors ;
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
    if (this.Contestdata.inGroup) {
      this.updateContestForm.controls['groupId'].setValue(this.Contestdata.groupId);
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

  removeProblemForm(index: number) {
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
      next: (response) => {
        this.onlineJudges = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}