import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { apiErrorMessage } from 'src/app/api-error';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit, OnDestroy {

  loading = false;
  loadError = '';
  /** True when the backend refused the request for lack of a session. */
  needsAuth = false;
  Problems: any[] = [];

  totalPages = 0;
  totalElements = 0;
  pageSize = 25;
  pageNo = 0;

  onlineJudges: string[] = [];
  isLogin = false;

  statistics = { solvedProblems: 0, attemptedProblems: 0 };

  oj = '';
  problemCode = '';
  title = '';
  contestName = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _problemService: ProblemService,
    private onlineJudgeService: OnlineJudgeService,
    private _AuthService: AuthService,
    private _route: ActivatedRoute,
    private _Router: Router,
    private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Problems · X-Judge');
    this.isLogin = this._AuthService.isLogin();

    if (this.isLogin) {
      this.getOnlineJudges();
      this.getUserStatistics();
    }

    // The navbar search drops the user here with ?title=…; react to later
    // changes too so a second search from this page still refreshes the list.
    this._route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.title = params.get('title') ?? '';
        this.oj = params.get('oj') ?? '';
        this.pageNo = Number(params.get('page') ?? 0) || 0;
        this.filterProblems();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProblem = (_: number, problem: any): string =>
    `${problem?.onlineJudge}-${problem?.code}`;

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.filterProblems();
  }

  applyFilters(): void {
    this.pageNo = 0;
    this.filterProblems();
  }

  filterProblems(): void {
    this.loading = true;
    this.loadError = '';
    this.needsAuth = false;
    this._problemService
      .filterProblem(this.oj, this.problemCode, this.title, this.contestName, this.pageSize, this.pageNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.Problems = response?.content ?? [];
          this.totalPages = response?.totalPages ?? 0;
          this.totalElements = response?.totalElements ?? 0;
        },
        error: (error) => {
          this.loading = false;
          this.Problems = [];
          this.totalElements = 0;
          this.totalPages = 0;
          // The problems endpoint requires a session. A signed-out visitor gets
          // an explanation and a sign-in link rather than a bare error.
          if (error?.status === 401 || error?.status === 403) this.needsAuth = true;
          else this.loadError = apiErrorMessage(error);
        }
      });
  }

  resetFilters(): void {
    this.oj = '';
    this.problemCode = '';
    this.title = '';
    this.contestName = '';
    this.pageNo = 0;
    void this._Router.navigate([], { relativeTo: this._route, queryParams: {} });
  }

  problemLink(problem: any): string[] {
    return ['/problem', problem?.onlineJudge, problem?.code];
  }

  private getOnlineJudges(): void {
    this.onlineJudgeService.getOnlineJudges()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => { this.onlineJudges = Array.isArray(response) ? response : []; },
        // A missing judge list only costs the filter dropdown; the page still works.
        error: () => { this.onlineJudges = []; }
      });
  }

  private getUserStatistics(): void {
    this._problemService.getUserStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.statistics = {
            solvedProblems: response?.solvedProblems ?? 0,
            attemptedProblems: response?.attemptedProblems ?? 0,
          };
        },
        error: () => { /* statistics are supplementary */ }
      });
  }
}
