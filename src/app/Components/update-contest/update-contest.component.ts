import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

@Component({
  selector: 'app-update-contest',
  templateUrl: './update-contest.component.html',
  styleUrls: ['./update-contest.component.css'],
})
export class UpdateContestComponent implements OnInit, OnDestroy {

  isLoading = false;
  apiError = '';
  validationErrors: Record<string, string> = {};

  onlineJudges: string[] = [];
  isGroupSelected = false;

  updateContestForm!: FormGroup;
  ready = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _ContestService: ContestService,
    private _OnlineJudgeService: OnlineJudgeService,
    private dialogRef: MatDialogRef<UpdateContestComponent>,
    @Inject(MAT_DIALOG_DATA) public Contestdata: any = {}) {}

  ngOnInit(): void {
    if (!this.Contestdata?.contest) {
      this.apiError = 'This contest could not be loaded for editing.';
      return;
    }
    this.getOnlineJudges();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    const contest = this.Contestdata.contest;
    const problems = this.Contestdata.problemSet ?? [];

    this.isGroupSelected = contest.type === 'GROUP';

    this.updateContestForm = new FormGroup({
      title: new FormControl(contest.title ?? '', [Validators.required, Validators.maxLength(120)]),
      // Shown in minutes, like the create dialog; converted back on submit.
      durationSeconds: new FormControl(Math.round(Number(contest.duration ?? 0) / 60),
        [Validators.required, Validators.min(1)]),
      type: new FormControl(contest.type ?? 'CLASSIC', [Validators.required]),
      visibility: new FormControl(contest.visibility ?? 'PUBLIC', [Validators.required]),
      beginTime: new FormControl(toLocalDateTimeInput(contest.beginTime), [Validators.required]),
      problems: new FormArray((problems.length ? problems : [{}]).map((problem: any) => new FormGroup({
        problemAlias: new FormControl(problem.problemAlias ?? '', [Validators.required]),
        ojType: new FormControl(problem.source ?? '', [Validators.required]),
        code: new FormControl(problem.problemCode ?? '', [Validators.required]),
        problemHashtag: new FormControl(problem.problemHashtag ?? ''),
        problemWeight: new FormControl(problem.problemWeight ?? 1, [Validators.required, Validators.min(1)]),
      }))),
      groupId: new FormControl(contest.groupId ?? 0),
      password: new FormControl(contest.password ?? ''),
      description: new FormControl(contest.description ?? '', [Validators.required, Validators.maxLength(500)]),
    }, { validators: groupIdValidator });

    this.ready = true;
  }

  get problems(): FormArray {
    return this.updateContestForm.get('problems') as FormArray;
  }

  get canDeleteProblem(): boolean { return this.problems.length > 1; }

  get isPrivate(): boolean { return this.updateContestForm?.get('visibility')?.value === 'PRIVATE'; }

  getFormProblems(): AbstractControl[] { return this.problems.controls; }

  trackByIndex = (index: number): number => index;

  onClassicClick(): void {
    this.isGroupSelected = false;
    this.updateContestForm.patchValue({ type: 'CLASSIC', groupId: 0 });
  }

  onGroupClick(): void {
    this.isGroupSelected = true;
    this.updateContestForm.patchValue({ type: 'GROUP' });
  }

  addNewProblemForm(): void {
    this.problems.push(new FormGroup({
      problemAlias: new FormControl('', [Validators.required]),
      ojType: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      problemHashtag: new FormControl(''),
      problemWeight: new FormControl(1, [Validators.required, Validators.min(1)]),
    }));
  }

  removeProblemForm(index: number): void {
    if (this.problems.length > 1) this.problems.removeAt(index);
  }

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

  handleUpdateContest(): void {
    if (this.isLoading) return;
    if (this.updateContestForm.invalid) {
      this.updateContestForm.markAllAsTouched();
      this.apiError = 'Fill in every required field before saving.';
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};

    const raw = this.updateContestForm.getRawValue();
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

    this._ContestService.updateSpecificContestById(this.Contestdata.contest.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          // The opener reloads on a truthy result; no full page reload needed.
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isLoading = false;
          this.validationErrors = apiValidationErrors(err);
          this.apiError = apiErrorMessage(err);
        }
      });
  }

  private getOnlineJudges(): void {
    this._OnlineJudgeService.getOnlineJudges()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

/**
 * `<input type="datetime-local">` wants a local-time string. `toISOString()`
 * yields UTC, which shifted the displayed start time by the local offset.
 */
function toLocalDateTimeInput(epochSeconds: any): string {
  const ms = Number(epochSeconds) * 1000;
  if (!Number.isFinite(ms) || !ms) return '';
  const date = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000);
  return date.toISOString().slice(0, 16);
}
