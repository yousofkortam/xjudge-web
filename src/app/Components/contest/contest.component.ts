import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { UserService } from 'src/app/ApiServices/user.service';
import { apiErrorMessage } from 'src/app/api-error';
import { CreateContestComponent } from '../create-contest/create-contest.component';
import { PageChange } from '../pagination/pagination.component';

type ContestState = 'running' | 'upcoming' | 'finished';

interface CategoryFilter {
  key: string;
  label: string;
  /** Hidden from signed-out visitors, because the endpoint needs a principal. */
  requiresAuth?: boolean;
}

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit, OnDestroy {

  loading = false;
  loadError = '';
  needsAuth = false;
  Contests: any[] = [];

  totalPages = 0;
  totalElements = 0;
  pageSize = 25;
  pageNo = 0;

  category = '';
  status = '';
  title = '';
  owner = '';

  isAuthenticated = false;

  readonly categories: CategoryFilter[] = [
    { key: '',        label: 'All' },
    { key: 'public',  label: 'Public' },
    { key: 'private', label: 'Private' },
    { key: 'classic', label: 'Classical' },
    { key: 'group',   label: 'Group' },
    { key: 'mine',    label: 'Mine', requiresAuth: true },
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _ContestService: ContestService,
    private titleService: Title,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.titleService.setTitle('Contests · X-Judge');
    this.isAuthenticated = this.userService.isAuthenticated();
    this.filterContests();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get visibleCategories(): CategoryFilter[] {
    return this.categories.filter(c => !c.requiresAuth || this.isAuthenticated);
  }

  trackByContestId = (_: number, contest: any): number => contest?.id;

  selectCategory(key: string): void {
    this.category = key;
    this.pageNo = 0;
    this.filterContests();
  }

  onPageChange(event: PageChange): void {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.filterContests();
  }

  applyFilters(): void {
    this.pageNo = 0;
    this.filterContests();
  }

  openCreateContestDialog(): void {
    if (!this.isAuthenticated) {
      this._snackBar.open('Sign in to create a contest.', 'Close', { duration: 4000 });
      return;
    }
    this.dialog
      .open(CreateContestComponent, {
        data: { inGroup: false, groupId: 0 },
        width: 'min(720px, 94vw)',
        maxHeight: '90vh',
        autoFocus: 'first-tabbable',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(created => { if (created) this.filterContests(); });
  }

  filterContests(): void {
    this.loading = true;
    this.loadError = '';
    this.needsAuth = false;
    this._ContestService
      .filterContests(this.category, this.status, this.owner, this.title, this.pageNo, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.Contests = response?.content ?? [];
          this.totalPages = response?.totalPages ?? 0;
          this.totalElements = response?.totalElements ?? 0;
        },
        error: (error: any) => {
          this.loading = false;
          this.Contests = [];
          this.totalElements = 0;
          this.totalPages = 0;
          if (error?.status === 401 || error?.status === 403) this.needsAuth = true;
          else this.loadError = apiErrorMessage(error);
        }
      });
  }

  reset(): void {
    this.category = '';
    this.status = '';
    this.owner = '';
    this.title = '';
    this.pageNo = 0;
    this.filterContests();
  }

  // --- derived contest state ------------------------------------------------
  // ContestPageModel carries beginTime (epoch seconds) and duration (seconds)
  // but no status, so the window is computed here rather than invented.

  stateOf(contest: any): ContestState {
    const start = Number(contest?.beginTime) * 1000;
    const end = start + Number(contest?.duration ?? 0) * 1000;
    const now = Date.now();
    if (!start || Number.isNaN(start)) return 'upcoming';
    if (now < start) return 'upcoming';
    return now <= end ? 'running' : 'finished';
  }

  stateLabel(contest: any): string {
    return { running: 'Running', upcoming: 'Upcoming', finished: 'Finished' }[this.stateOf(contest)];
  }

  stateClass(contest: any): string {
    return {
      running: 'xj-badge--success',
      upcoming: 'xj-badge--info',
      finished: 'xj-badge--neutral',
    }[this.stateOf(contest)];
  }
}
