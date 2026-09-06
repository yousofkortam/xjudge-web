import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { UserService } from 'src/app/ApiServices/user.service';
import { apiErrorMessage } from 'src/app/api-error';
import { MatDialog } from '@angular/material/dialog';
import { UpdateContestComponent } from '../update-contest/update-contest.component';

type ContestTab = 'overview' | 'status' | 'rank';

@Component({
  selector: 'app-contest-details',
  templateUrl: './contest-details.component.html',
  styleUrls: ['./contest-details.component.css']
})
export class ContestDetailsComponent implements OnInit, OnDestroy {

  loading = true;
  loadError = '';
  notFound = false;

  contestId: string | null = null;
  contest: any = null;
  problemSet: any[] = [];

  selectedButton: ContestTab = 'overview';
  isLeaderOrManager = false;

  showPasswordForm = false;
  password = '';
  passwordError = '';
  unlocking = false;

  progressBarValue = 0;
  countdownTimer = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private titleService: Title,
    private _ActivatedRoute: ActivatedRoute,
    private contestService: ContestService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.contestId = param.get('contestId');
        this.getContestDetails();
      });

    // The ticker is scoped to this component's lifetime; the previous version
    // left it running (and dereferencing a null contest) after navigation.
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.contest) return;
        this.updateProgressBar();
        this.updateCountdownTimer();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get status(): string {
    return this.contest?.contestStatus ?? 'SCHEDULED';
  }

  get statusBadgeClass(): string {
    return {
      RUNNING:   'xj-badge--success',
      SCHEDULED: 'xj-badge--info',
      ENDED:     'xj-badge--neutral',
    }[this.status] ?? 'xj-badge--neutral';
  }

  get canSeeContent(): boolean {
    return this.status !== 'SCHEDULED' || this.isLeaderOrManager;
  }

  trackByProblem = (_: number, problem: any): string => problem?.problemHashtag;

  onBtnClick(button: ContestTab): void {
    this.selectedButton = button;
  }

  getContestDetails(): void {
    this.loading = true;
    this.loadError = '';
    this.notFound = false;
    this.passwordError = '';

    this.contestService.getSpecificContestById(this.contestId, this.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.unlocking = false;
          this.showPasswordForm = false;
          this.contest = response ?? null;
          if (!this.contest) { this.notFound = true; return; }

          this.isLeaderOrManager = this.authService.getUserHandle() === this.contest.ownerHandle;
          this.titleService.setTitle(`${this.contest.title} · X-Judge`);

          this.problemSet = [...(response.problemSet ?? [])].sort(
            (a: any, b: any) => String(a?.problemHashtag ?? '').localeCompare(String(b?.problemHashtag ?? '')));

          this.updateProgressBar();
          this.updateCountdownTimer();
        },
        error: (err) => {
          this.loading = false;
          this.unlocking = false;
          const status = err?.status;

          if (status === 403) {
            // A private contest: ask for the password instead of erroring out.
            if (this.password) this.passwordError = 'That password was not accepted.';
            this.showPasswordForm = true;
            return;
          }
          if (status === 404) { this.notFound = true; return; }
          if (status === 401) {
            void this.router.navigate(['/login'], { queryParams: { returnUrl: `/contest/${this.contestId}` } });
            return;
          }
          this.loadError = apiErrorMessage(err);
        }
      });
  }

  unlockContest(): void {
    if (this.unlocking) return;
    this.unlocking = true;
    this.getContestDetails();
  }

  updateProgressBar(): void {
    const begin = Number(this.contest?.beginTime) * 1000;
    const end = Number(this.contest?.endTime) * 1000;
    if (!begin || !end || end <= begin) { this.progressBarValue = 0; return; }
    const elapsed = Date.now() - begin;
    this.progressBarValue = Math.min(100, Math.max(0, (elapsed / (end - begin)) * 100));
  }

  updateCountdownTimer(): void {
    const begin = Number(this.contest?.beginTime) * 1000;
    const end = Number(this.contest?.endTime) * 1000;
    if (!begin || !end) return;

    const now = Date.now();
    let remaining: number;

    if (now < begin) {
      this.contest.contestStatus = 'SCHEDULED';
      remaining = begin - now;
    } else if (now < end) {
      this.contest.contestStatus = 'RUNNING';
      remaining = end - now;
    } else {
      this.contest.contestStatus = 'ENDED';
      this.countdownTimer = '';
      return;
    }

    const seconds = Math.floor(remaining / 1000) % 60;
    const minutes = Math.floor(remaining / 60_000) % 60;
    const hours = Math.floor(remaining / 3_600_000) % 24;
    const days = Math.floor(remaining / 86_400_000);
    const pad = (n: number) => n.toString().padStart(2, '0');

    this.countdownTimer = days > 0
      ? `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  openUpdateContestDialog(): void {
    this.dialog
      .open(UpdateContestComponent, {
        data: { contest: this.contest, problemSet: this.problemSet },
        width: 'min(720px, 94vw)',
        maxHeight: '90vh',
        autoFocus: 'first-tabbable',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(updated => { if (updated) this.getContestDetails(); });
  }

  handleDeleteContest(): void {
    if (!confirm(`Delete “${this.contest?.title}”? This cannot be undone.`)) return;
    this.contestService.deleteSpecificContestById(this.contest.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this._snackBar.open('Contest deleted.', 'Close', { duration: 4000 });
          void this.router.navigate(['/contest']);
        },
        error: (err) => {
          this._snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
        }
      });
  }
}
