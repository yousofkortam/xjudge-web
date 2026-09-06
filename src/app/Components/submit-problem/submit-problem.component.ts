import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { apiErrorMessage } from 'src/app/api-error';
import { SubmitResultComponent } from '../submit-result/submit-result.component';

@Component({
  selector: 'app-submit-problem',
  templateUrl: './submit-problem.component.html',
  styleUrls: ['./submit-problem.component.css']
})
export class SubmitProblemComponent implements OnInit, OnDestroy {

  languages: any[] = [];
  compilersLoading = true;
  compilersError = '';

  isLoading = false;
  apiError = '';

  contestId: any;

  submitProblemForm = new FormGroup({
    solutionCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    isOpen: new FormControl(true, [Validators.required]),
    idValue: new FormControl('', [Validators.required]),
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _contestService: ContestService,
    private _ProblemService: ProblemService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SubmitProblemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (this.data?.inContest) this.contestId = this.data.contestId;
    this.getCompilers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByCompiler = (_: number, compiler: any): string => compiler?.idValue;

  get solutionLines(): number {
    return (this.submitProblemForm.value.solutionCode ?? '').split('\n').length;
  }

  setOpen(value: boolean): void {
    this.submitProblemForm.controls.isOpen.setValue(value);
  }

  handleSubmitProblem(): void {
    if (this.isLoading) return;                     // no double submits
    if (this.submitProblemForm.invalid) {
      this.submitProblemForm.markAllAsTouched();
      return;
    }

    const idValue = this.submitProblemForm.value.idValue;
    const compiler = this.languages.find((lang: any) => lang.idValue === idValue);
    if (!compiler) {
      // Guard: the old code indexed straight into find()'s result and threw.
      this.apiError = 'Pick a language before submitting.';
      return;
    }

    this.isLoading = true;
    this.apiError = '';

    const submissionRequest = {
      code: this.data?.problemCode,
      ojType: this.data?.source,
      solutionCode: this.submitProblemForm.value.solutionCode,
      isOpen: this.submitProblemForm.value.isOpen,
      compiler: { idValue: compiler.idValue, name: compiler.name },
    };

    // The request itself is executed by the result dialog, which streams the
    // verdict; this dialog just hands the cold observable over and closes.
    const submitProblem$ = this.data?.inContest
      ? this._contestService.submitToContest(this.contestId, submissionRequest)
      : this._ProblemService.submitProblem(submissionRequest);

    this.dialogRef.close(true);
    this.dialog.open(SubmitResultComponent, {
      data: {
        response: submitProblem$,
        submit: true,
        dummy: {
          verdict: 'In queue',
          language: compiler.name,
          submitTime: Date.now() / 1000,
          timeUsage: '—',
          memoryUsage: '—',
          isOpen: submissionRequest.isOpen,
          solution: submissionRequest.solutionCode,
        }
      },
      width: 'min(860px, 94vw)',
      maxHeight: '92vh',
      autoFocus: 'first-tabbable',
    });
  }

  private getCompilers(): void {
    this.compilersLoading = true;
    this.compilersError = '';
    this._ProblemService.getCompilersForSubmitProblem(this.data?.source)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.compilersLoading = false;
          this.languages = Array.isArray(response) ? response : [];
          if (!this.languages.length) {
            this.compilersError = `No compilers are configured for ${this.data?.source ?? 'this judge'}.`;
          }
        },
        error: (err) => {
          this.compilersLoading = false;
          this.languages = [];
          this.compilersError = apiErrorMessage(err);
        }
      });
  }
}
