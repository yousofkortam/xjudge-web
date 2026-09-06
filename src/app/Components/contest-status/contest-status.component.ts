import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { apiErrorMessage } from 'src/app/api-error';
import { PageChange } from '../pagination/pagination.component';
import { SubmitResultComponent } from '../submit-result/submit-result.component';

@Component({
  selector: 'app-contest-status',
  templateUrl: './contest-status.component.html',
  styleUrls: ['./contest-status.component.css']
})
export class ContestStatusComponent implements OnInit, OnDestroy {

  @Input() contestId: string | number | null = null;
  @Input() problemSet: any[] = [];

  submissions: any[] = [];
  loading = false;
  loadError = '';

  totalPages = 0;
  totalElements = 0;
  pageSize = 25;
  pageNo = 0;

  userHandle = '';
  result = '';
  problemCode = '';
  language = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private contestService: ContestService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
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
    this.contestService
      .filterSubmissionsInContest(this.contestId, this.userHandle, this.problemCode, this.result, this.language, this.pageSize, this.pageNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.submissions = response?.content ?? [];
          this.totalPages = response?.totalPages ?? 0;
          this.totalElements = response?.totalElements ?? 0;
          this.pageNo = response?.pageable?.pageNumber ?? this.pageNo;
        },
        error: (err) => {
          this.loading = false;
          this.submissions = [];
          this.totalElements = 0;
          this.totalPages = 0;
          if (err?.status !== 401) this.loadError = apiErrorMessage(err);
        }
      });
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
    this.result = '';
    this.problemCode = '';
    this.language = '';
    this.pageNo = 0;
    this.filterSubmissions();
  }

  showSubmissionResult(submissionId: number): void {
    this.dialog.open(SubmitResultComponent, {
      data: { submissionId, submit: false },
      width: 'min(860px, 94vw)',
      maxHeight: '90vh',
      autoFocus: 'first-tabbable',
    });
  }
}
