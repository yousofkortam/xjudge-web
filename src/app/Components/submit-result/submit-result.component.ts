import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, timer, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { SubmissionService } from 'src/app/ApiServices/submission.service';
import { apiErrorMessage } from 'src/app/api-error';

/** Verdicts that mean the judge is still working. */
const PENDING_CLASSES = new Set(['pending', 'running']);

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40;   // ~2 minutes, matching the backend's own poll budget

@Component({
  selector: 'app-submit-result',
  templateUrl: './submit-result.component.html',
  styleUrls: ['./submit-result.component.css']
})
export class SubmitResultComponent implements OnInit, OnDestroy {

  isLoading = true;
  /** True while the judge has not returned a terminal verdict yet. */
  isJudging = false;
  loadError = '';

  result: any = null;
  isChecked = false;
  visibilitySaving = false;

  private pollCount = 0;
  private pollSub?: Subscription;
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SubmitResultComponent>,
    private _snackBar: MatSnackBar,
    private submissionService: SubmissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    // The placeholder keeps the table populated while the real result arrives;
    // it may be absent when opening an existing submission, hence the fallback.
    this.result = this.data?.dummy ?? null;

    if (this.data?.submit) {
      this.submitProblem();
    } else {
      this.getSubmissionById();
    }
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get verdict(): string {
    return this.result?.verdict || 'In queue';
  }

  get canSeeSource(): boolean {
    return this.isSubmissionOwner() || !!this.result?.isOpen;
  }

  isSubmissionOwner(): boolean {
    const handle = this.authService.getUserHandle();
    return !!handle && !!this.result?.userHandle && handle === this.result.userHandle;
  }

  private submitProblem(): void {
    this.data.response
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.result = { ...(response ?? {}) };
          // The judge never echoes the source back; keep what was submitted.
          if (this.data?.dummy?.solution) this.result.solution = this.data.dummy.solution;
          this.isChecked = !!this.result.isOpen;
          this.startPollingIfPending();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.loadError = apiErrorMessage(err);
        }
      });
  }

  private getSubmissionById(): void {
    this.submissionService.getSubmissionById(this.data?.submissionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.result = response ?? null;
          this.isChecked = !!this.result?.isOpen;
          this.startPollingIfPending();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.loadError = apiErrorMessage(err);
        }
      });
  }

  /**
   * The backend judges asynchronously, so a freshly created submission comes
   * back "In queue". Re-read it until it reaches a terminal verdict instead of
   * making the user close and reopen the dialog.
   */
  private startPollingIfPending(): void {
    const verdictClass = classify(this.result?.verdict);
    if (!PENDING_CLASSES.has(verdictClass) || !this.result?.id) {
      this.isJudging = false;
      return;
    }
    if (this.pollCount >= MAX_POLLS) { this.isJudging = false; return; }

    this.isJudging = true;
    this.pollCount++;
    this.pollSub?.unsubscribe();
    this.pollSub = timer(POLL_INTERVAL_MS)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.submissionService.getSubmissionById(this.result.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: any) => {
              if (!response) { this.isJudging = false; return; }
              const solution = this.result?.solution;
              this.result = { ...response, solution: response.solution ?? solution };
              this.isChecked = !!this.result.isOpen;
              this.startPollingIfPending();
            },
            // A transient poll failure should not wipe the verdict on screen.
            error: () => { this.isJudging = false; }
          });
      });
  }

  toggleVisibility(): void {
    if (!this.result?.id || this.visibilitySaving) return;
    this.visibilitySaving = true;
    const next = !this.isChecked;
    this.submissionService.updateSubmissionOpen(this.result.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.visibilitySaving = false;
          this.isChecked = next;
          this.result.isOpen = next;
        },
        error: (err) => {
          this.visibilitySaving = false;
          this._snackBar.open(apiErrorMessage(err), 'Close', { duration: 5000 });
        }
      });
  }

  close(): void { this.dialogRef.close(); }
}

/** Local copy of the verdict grouping used by VerdictClassPipe. */
function classify(verdict: string | null | undefined): string {
  if (!verdict) return 'pending';
  const text = verdict.trim().toUpperCase().replace(/_/g, ' ');
  if (text === 'WJ' || text === 'WQ' || text === 'PENDING' ||
      text.includes('QUEUE') || text.startsWith('WAITING')) return 'pending';
  if (text === 'WR' || text.startsWith('RUNNING') || text.startsWith('JUDGING') ||
      text.startsWith('TESTING') || /^\d+\s*\/\s*\d+/.test(text)) return 'running';
  return 'done';
}
