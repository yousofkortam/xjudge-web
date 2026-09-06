import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { OnlineJudgeService } from 'src/app/ApiServices/online-judge.service';
import { SubmissionService } from 'src/app/ApiServices/submission.service';
import { apiErrorMessage } from 'src/app/api-error';
import { PageChange } from '../pagination/pagination.component';
import { SubmitResultComponent } from '../submit-result/submit-result.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {

  loading = false;
  loadError = '';
  needsAuth = false;
  submissions: any[] = [];

  totalPages = 0;
  totalElements = 0;
  pageSize = 25;
  pageNo = 0;

  onlineJudges: string[] = [];

  userHandle = '';
  oj = '';
  problemCode = '';
  language = '';

  scope: 'all' | 'mine' = 'all';
  isLogin = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private submissionService: SubmissionService,
    private onlineJudgeService: OnlineJudgeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.titleService.setTitle('Status · X-Judge');
    this.isLogin = this.authService.isLogin();
    if (this.isLogin) this.getOnlineJudges();
    this.filterSubmissions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackBySubmission = (_: number, submission: any): number => submission?.id;

  filterSubmissions(): void {
    this.loading = true;
    this.loadError = '';
    this.needsAuth = false;
    this.submissionService
      .filterSubmissions(this.userHandle, this.oj, this.problemCode, this.language, this.pageSize, this.pageNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.submissions = response?.content ?? [];
          this.totalPages = response?.totalPages ?? 0;
          this.totalElements = response?.totalElements ?? 0;
          // Trust the server's echo of the page it actually served.
          this.pageNo = response?.pageable?.pageNumber ?? this.pageNo;
        },
        error: (err: any) => {
          this.loading = false;
          this.submissions = [];
          this.totalElements = 0;
          this.totalPages = 0;
          if (err?.status === 401 || err?.status === 403) this.needsAuth = true;
          else this.loadError = apiErrorMessage(err);
        }
      });
  }

  showAll(): void {
    this.scope = 'all';
    this.userHandle = '';
    this.pageNo = 0;
    this.filterSubmissions();
  }

  showMine(): void {
    const handle = this.authService.getUserHandle();
    if (!handle) {
      this.snackBar.open('Sign in to see your own submissions.', 'Close', { duration: 4000 });
      return;
    }
    this.scope = 'mine';
    this.userHandle = handle;
    this.pageNo = 0;
    this.filterSubmissions();
  }

  applyFilters(): void {
    this.pageNo = 0;
    this.filterSubmissions();
  }

  onPageChange(event: PageChange): void {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.filterSubmissions();
  }

  resetFilters(): void {
    this.userHandle = '';
    this.oj = '';
    this.problemCode = '';
    this.language = '';
    this.scope = 'all';
    this.pageNo = 0;
    this.filterSubmissions();
  }

  showSubmissionResult(id: number): void {
    this.dialog.open(SubmitResultComponent, {
      data: { submit: false, submissionId: id },
      width: 'min(860px, 94vw)',
      maxHeight: '90vh',
      autoFocus: 'first-tabbable',
    });
  }

  private getOnlineJudges(): void {
    this.onlineJudgeService.getOnlineJudges()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => { this.onlineJudges = Array.isArray(response) ? response : []; },
        error: () => { this.onlineJudges = []; }
      });
  }
}
