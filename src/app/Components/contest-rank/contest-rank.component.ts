import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { apiErrorMessage } from 'src/app/api-error';

interface ProblemCell {
  problemHashtag: string;
  isAttempt: number;
  isAccepted: number;
  attempted: number;
  time: string;
}

@Component({
  selector: 'app-contest-rank',
  templateUrl: './contest-rank.component.html',
  styleUrls: ['./contest-rank.component.css']
})
export class ContestRankComponent implements OnInit, OnDestroy {

  @Input() problemSet: any[] = [];
  @Input() contestId: string | number | null = null;

  contestRank: any[] = [];
  loading = false;
  loadError = '';

  readonly defaultAvatar = 'assets/images/Default_Image.jpg';

  private readonly destroy$ = new Subject<void>();

  constructor(private contestService: ContestService) {}

  ngOnInit(): void {
    this.loadRank();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByHandle = (index: number, row: any): string => row?.handle ?? String(index);
  trackByCell = (index: number, cell: ProblemCell): string => cell?.problemHashtag ?? String(index);
  trackByProblem = (index: number, problem: any): string => problem?.problemHashtag ?? String(index);

  loadRank(): void {
    this.loading = true;
    this.loadError = '';
    this.contestService.getContstRank(this.contestId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          const rows = Array.isArray(response) ? response : [];
          this.contestRank = rows.map(row => ({
            ...row,
            submissionStatus: this.getSubmissionsForContestant(row),
          }));
        },
        error: (err) => {
          this.loading = false;
          this.contestRank = [];
          if (err?.status !== 401) this.loadError = apiErrorMessage(err);
        }
      });
  }

  /**
   * Builds one cell per contest problem for a contestant, in problem order.
   *
   * The previous merge-style walk assumed both lists were sorted and dropped
   * every problem after the contestant's last submission; this indexes the
   * submissions instead, so the row always spans the whole problem set.
   */
  getSubmissionsForContestant(contestant: any): ProblemCell[] {
    const byProblem = new Map<string, any[]>();
    for (const submission of contestant?.submissionList ?? []) {
      const key = String(submission?.problemIndex ?? '');
      const bucket = byProblem.get(key);
      if (bucket) bucket.push(submission);
      else byProblem.set(key, [submission]);
    }

    return this.problemSet.map(problem => {
      const hashtag = String(problem?.problemHashtag ?? '');
      const submissions = byProblem.get(hashtag) ?? [];
      const cell: ProblemCell = { problemHashtag: hashtag, isAttempt: 0, isAccepted: 0, attempted: 0, time: '' };

      for (const submission of submissions) {
        cell.isAttempt = 1;
        if (submission?.status === 'Accepted') {
          // Penalties only count the failures before the first accepted run.
          if (!cell.isAccepted) {
            cell.isAccepted = 1;
            cell.time = this.formatTime(submission.submitTime);
          }
        } else if (!cell.isAccepted) {
          cell.attempted++;
        }
      }
      return cell;
    });
  }

  cellClass(cell: ProblemCell): string {
    if (!cell.isAttempt) return 'xj-rank__cell';
    return cell.isAccepted ? 'xj-rank__cell is-accepted' : 'xj-rank__cell is-failed';
  }

  formatTime(time: any): string {
    const total = Number(time);
    if (!Number.isFinite(total) || total < 0) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(Math.floor(total % 60))}`;
  }

  penaltyInMinute(timeInSecond: any): number {
    const seconds = Number(timeInSecond);
    return Number.isFinite(seconds) ? Math.floor(seconds / 60) : 0;
  }
}
