import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

@Component({
  selector: 'app-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css']
})
export class CreateContestComponent implements OnInit, OnDestroy {

  isLoading = false;
  apiError = '';
  validationErrors: Record<string, string> = {};

  userGroups: any[] = [];
  onlineJudges: string[] = [];

  isGroupSelected = false;
  isGroupSelectorDisabled = false;

  createContestForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    // Captured in minutes; converted to the seconds the API expects on submit.
    durationSeconds: new FormControl(120, [Validators.required, Validators.min(1), Validators.max(525600)]),
    type: new FormControl('CLASSIC', [Validators.required]),
    visibility: new FormControl('PUBLIC', [Validators.required]),
    beginTime: new FormControl('', [Validators.required]),
    problems: new FormArray([CreateContestComponent.newProblemGroup()]),
    groupId: new FormControl(0),
    password: new FormControl(''),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
  }, { validators: groupIdValidator });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _ContestService: ContestService,
    private onlineJudgeService: OnlineJudgeService,
    private _Router: Router,
    private dialogRef: MatDialogRef<CreateContestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  static newProblemGroup(): FormGroup {
    return new FormGroup({
      problemAlias: new FormControl('', [Validators.required]),
      ojType: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      problemHashtag: new FormControl(''),
      problemWeight: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
    if (this.data?.inGroup) {
      this.isGroupSelectorDisabled = true;
      this.isGroupSelected = true;
      this.createContestForm.patchValue({ type: 'GROUP', groupId: this.data.groupId });
    }
    this.getOnlineJudges();
    this.getGroupsAwnedByUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get problems(): FormArray {
    return this.createContestForm.get('problems') as FormArray;
  }

  get canDeleteProblem(): boolean {
    return this.problems.length > 1;
  }

  get isPrivate(): boolean {
    return this.createContestForm.get('visibility')?.value === 'PRIVATE';
  }

  getFormProblems(): AbstractControl[] {
    return this.problems.controls;
  }

  trackByIndex = (index: number): number => index;

  onClassicClick(): void {
    this.isGroupSelected = false;
    this.createContestForm.patchValue({ type: 'CLASSIC', groupId: 0 });
  }

  onGroupClick(): void {
    this.isGroupSelected = true;
    this.createContestForm.patchValue({ type: 'GROUP' });
    if (this.data?.inGroup) this.createContestForm.patchValue({ groupId: this.data.groupId });
  }

  addNewProblemForm(): void {
    this.problems.push(CreateContestComponent.newProblemGroup());
  }

  removeProblemForm(index: number): void {
    if (this.problems.length > 1) this.problems.removeAt(index);
  }

  /** Contest problems are labelled A, B, … Z, AA, AB … in submission order. */
  getLetter(index: number): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    let i = index;
    while (i >= 0) {
      result = letters.charAt(i % 26) + result;
      i = Math.floor(i / 26) - 1;
    }
    return result;
  }

  handleCreateContest(): void {
    if (this.isLoading) return;
    if (this.createContestForm.invalid) {
      this.createContestForm.markAllAsTouched();
      this.apiError = 'Fill in every required field before creating the contest.';
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};

    const raw = this.createContestForm.getRawValue();
    const beginTime = new Date(raw.beginTime).getTime();
    if (Number.isNaN(beginTime)) {
      this.isLoading = false;
      this.apiError = 'Enter a valid start date and time.';
      return;
    }

    const payload = {
      ...raw,
      durationSeconds: Number(raw.durationSeconds) * 60,
      beginTime: Math.floor(beginTime / 1000),
      problems: raw.problems.map((problem: any, i: number) => ({
        ...problem,
        problemHashtag: this.getLetter(i),
        problemWeight: Number(problem.problemWeight) || 1,
      })),
    };

    this._ContestService.createContest(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dialogRef.close(true);
          if (response?.id) void this._Router.navigate(['/contest', response.id]);
        },
        error: (err) => {
          this.isLoading = false;
          this.validationErrors = apiValidationErrors(err);
          this.apiError = apiErrorMessage(err);
        }
      });
  }

  private getGroupsAwnedByUser(): void {
    this._ContestService.getGrouspqwned()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => { this.userGroups = Array.isArray(response) ? response : (response?.content ?? []); },
        error: () => { this.userGroups = []; }
      });
  }

  private getOnlineJudges(): void {
    this.onlineJudgeService.getOnlineJudges()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        // The interceptor already unwraps the `{success, data}` envelope, so the
        // judge names arrive as a bare array here.
        next: (response) => { this.onlineJudges = Array.isArray(response) ? response : []; },
        error: () => { this.onlineJudges = []; }
      });
  }
}

function groupIdValidator(control: AbstractControl): ValidationErrors | null {
  const type = control.get('type')?.value;
  const groupId = control.get('groupId')?.value;
  return type === 'GROUP' && !groupId ? { GroupRequired: true } : null;
}
