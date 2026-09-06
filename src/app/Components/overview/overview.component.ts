import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  @Input() problemSet: any[] = [];
  /** Reveal the originating judge once the contest is over. */
  @Input() shorOrigin = false;
  @Input() contestId: any;

  trackByHashtag = (index: number, problem: any): string =>
    problem?.problemHashtag ?? String(index);

  acceptanceRate(problem: any): number {
    const submitted = Number(problem?.numberOfSubmission ?? 0);
    if (!submitted) return 0;
    return Math.round((Number(problem?.numberOfAccepted ?? 0) / submitted) * 100);
  }
}
