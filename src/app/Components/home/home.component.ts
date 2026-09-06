import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { SubmissionService } from 'src/app/ApiServices/submission.service';

type PanelState = 'loading' | 'ready' | 'empty' | 'error';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLogin = false;
  handle = '';

  /** Upcoming + running contests, newest window first. */
  contests: any[] = [];
  contestsState: PanelState = 'loading';

  submissions: any[] = [];
  submissionsState: PanelState = 'loading';

  statistics: { solvedProblems: number; attemptedProblems: number } | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _AuthService: AuthService,
    private _ContestService: ContestService,
    private _SubmissionService: SubmissionService,
    private _ProblemService: ProblemService,
    private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('X-Judge');
    this.isLogin = this._AuthService.isLogin();
    this.handle = this._AuthService.getUserHandle();

    // Submissions are readable without a session; contests and statistics are
    // not, so signed-out visitors get the landing page instead of failed calls.
    this.loadSubmissions();
    if (this.isLogin) {
      this.loadContests();
      this.loadStatistics();
    } else {
      this.contestsState = 'empty';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById = (_: number, item: any): number => item?.id;

  private loadContests(): void {
    this.contestsState = 'loading';
    this._ContestService.filterContests('', '', '', '', 0, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.contests = response?.content ?? [];
          this.contestsState = this.contests.length ? 'ready' : 'empty';
        },
        error: () => { this.contests = []; this.contestsState = 'error'; }
      });
  }

  private loadSubmissions(): void {
    this.submissionsState = 'loading';
    this._SubmissionService.getAllSubmissions(6, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.submissions = response?.content ?? [];
          this.submissionsState = this.submissions.length ? 'ready' : 'empty';
        },
        error: () => { this.submissions = []; this.submissionsState = 'error'; }
      });
  }

  private loadStatistics(): void {
    this._ProblemService.getUserStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.statistics = {
            solvedProblems: response?.solvedProblems ?? 0,
            attemptedProblems: response?.attemptedProblems ?? 0,
          };
        },
        error: () => { this.statistics = null; }
      });
  }

  contestState(contest: any): 'running' | 'upcoming' | 'finished' {
    const start = Number(contest?.beginTime) * 1000;
    const end = start + Number(contest?.duration ?? 0) * 1000;
    const now = Date.now();
    if (!start || Number.isNaN(start) || now < start) return 'upcoming';
    return now <= end ? 'running' : 'finished';
  }

  contestBadgeClass(contest: any): string {
    return {
      running: 'xj-badge--success',
      upcoming: 'xj-badge--info',
      finished: 'xj-badge--neutral',
    }[this.contestState(contest)];
  }
}
