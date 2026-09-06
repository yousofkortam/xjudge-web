import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { SubmitProblemComponent } from '../submit-problem/submit-problem.component';
import { SubmitResultComponent } from '../submit-result/submit-result.component';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { ProblemService } from 'src/app/ApiServices/problem.service';
import { SubmissionService } from 'src/app/ApiServices/submission.service';
import { environment } from 'src/app/environment/environment';
import { apiErrorMessage } from 'src/app/api-error';

@Component({
  selector: 'app-problem-details',
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})
export class ProblemDetailsComponent implements OnInit, OnDestroy {

  @Input() inContest = false;

  source = '';
  problemCode = '';
  problemInfo: any = null;

  loading = true;
  loadError = '';
  notFound = false;

  problemSumbissions: any[] = [];
  totalSubmissions = 0;
  submissionsLoading = false;

  isAuthenticated = false;

  /**
   * The scraped statement, rendered into a sandboxed frame via `srcdoc`.
   * The frame gets no `allow-same-origin`, so the third-party markup runs in an
   * opaque origin and cannot reach this application.
   */
  statementSrcDoc: SafeHtml | null = null;
  statementLoading = false;
  statementError = '';

  /**
   * Height of the statement frame, in px.
   *
   * The frame reports its own content height (see `STATEMENT_RESIZE_SCRIPT`)
   * because the parent cannot measure it: the sandbox deliberately withholds
   * `allow-same-origin`, so `contentDocument` is unreachable. Seeded with a
   * typical statement height so the card does not jump from zero on first paint.
   */
  statementHeight = DEFAULT_STATEMENT_HEIGHT;

  @ViewChild('statementFrame')
  set statementFrame(ref: ElementRef<HTMLIFrameElement> | undefined) {
    this.frameEl = ref?.nativeElement ?? null;
  }
  private frameEl: HTMLIFrameElement | null = null;

  private readonly onFrameMessage = (event: MessageEvent): void => {
    // Only trust messages coming from this component's own frame. Its origin is
    // opaque ("null"), so identity is established by the source window itself.
    if (!this.frameEl || event.source !== this.frameEl.contentWindow) return;

    const height = Number((event.data as any)?.xjStatementHeight);
    if (!Number.isFinite(height) || height <= 0) return;

    // Guard against a runaway report from a broken statement.
    const next = Math.min(Math.ceil(height), MAX_STATEMENT_HEIGHT);
    if (next === this.statementHeight) return;
    this.zone.run(() => { this.statementHeight = next; });
  };

  contestId: string | null = null;
  hashTag: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _ProblemService: ProblemService,
    private _ActivatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private authService: AuthService,
    private titleService: Title,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private zone: NgZone,
    private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLogin();
    window.addEventListener('message', this.onFrameMessage);

    this._ActivatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        if (this.inContest) {
          this.contestId = param.get('contestId');
          this.hashTag = param.get('hashTag');
        } else {
          this.source = param.get('source') ?? '';
          this.problemCode = param.get('problemCode') ?? '';
        }
        this.getSpecificProblem();
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.onFrameMessage);
    this.destroy$.next();
    this.destroy$.complete();
  }

  get visibleProperties(): any[] {
    const properties = this.problemInfo?.properties ?? [];
    return properties.filter((p: any) => this.inContest || !p?.spoiler);
  }

  trackByProperty = (index: number, property: any): string => property?.title ?? String(index);
  trackBySubmission = (_: number, submission: any): number => submission?.id;

  openModal(): void {
    if (!this.isAuthenticated) {
      this._snackBar.open('Sign in to submit a solution.', 'Close', {
        duration: 5000
      });
      return;
    }
    this.dialog
      .open(SubmitProblemComponent, {
        data: {
          problemCode: this.problemCode,
          source: this.source,
          inContest: this.inContest,
          contestId: this.contestId,
        },
        width: 'min(860px, 94vw)',
        maxHeight: '92vh',
        autoFocus: 'first-tabbable',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      // A fresh submission belongs at the top of the "my attempts" panel.
      .subscribe(() => this.getProblemSubissions());
  }

  getSpecificProblem(): void {
    this.loading = true;
    this.loadError = '';
    this.notFound = false;

    const request$ = this.inContest
      ? this._ProblemService.getSpecificProblemByHashTagForContest(this.contestId, this.hashTag)
      : this._ProblemService.getSpecificProblem(this.source, this.problemCode);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.loading = false;
        this.problemInfo = response ?? null;
        if (!this.problemInfo) { this.notFound = true; return; }

        this.problemCode = this.problemInfo.code ?? this.problemCode;
        this.source = this.problemInfo.onlineJudge ?? this.source;
        this.titleService.setTitle(`${this.problemInfo.title ?? 'Problem'} · X-Judge`);

        this.loadStatement(this.problemInfo.discriptionRoute);
        this.getProblemSubissions();
      },
      error: (err) => {
        this.loading = false;
        this.problemInfo = null;
        if (err?.status === 404) {
          this.notFound = true;
        } else if (err?.status !== 401) {
          this.loadError = apiErrorMessage(err);
        }
      }
    });
  }

  private loadStatement(route: string | null | undefined): void {
    this.statementSrcDoc = null;
    this.statementError = '';
    // A new statement re-measures from scratch.
    this.statementHeight = DEFAULT_STATEMENT_HEIGHT;
    if (!route) return;

    this.statementLoading = true;
    this._ProblemService.getProblemDescription(route)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (html) => {
          this.statementLoading = false;
          // Marked trusted deliberately: Angular sanitises `srcdoc` as HTML,
          // which strips the <script> tags the statement needs (MathJax renders
          // the inline formulas). The markup is confined to an iframe sandboxed
          // WITHOUT allow-same-origin, so it executes in an opaque origin and
          // cannot reach this application's DOM, storage or session.
          this.statementSrcDoc = this.sanitizer.bypassSecurityTrustHtml(
            withBaseHref(html, environment.apiUrl));
        },
        error: (err) => {
          this.statementLoading = false;
          this.statementError = apiErrorMessage(err);
        }
      });
  }

  getProblemSubissions(): void {
    const handle = this.authService.getUserHandle();
    if (!handle || !this.problemCode) return;

    this.submissionsLoading = true;
    this.submissionService.filterSubmissions(handle, '', this.problemCode, '', 5, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.submissionsLoading = false;
          this.problemSumbissions = response?.content ?? [];
          this.totalSubmissions = response?.totalElements ?? 0;
        },
        error: () => {
          this.submissionsLoading = false;
          this.problemSumbissions = [];
          this.totalSubmissions = 0;
        }
      });
  }

  showSubmissionResult(id: number): void {
    this.dialog.open(SubmitResultComponent, {
      data: { submit: false, submissionId: id },
      width: 'min(860px, 94vw)',
      maxHeight: '90vh',
      autoFocus: 'first-tabbable',
    });
  }

  /** Re-requests the problem so the backend can re-scrape a stale statement. */
  recrawl(): void {
    this.getSpecificProblem();
  }
}

/** Shown until the frame reports its real height; also the fallback if it never does. */
const DEFAULT_STATEMENT_HEIGHT = 520;

/** Upper bound, so one malformed statement cannot produce an endless page. */
const MAX_STATEMENT_HEIGHT = 20000;

/**
 * Injected into the statement frame so it can report its own content height.
 *
 * The parent cannot measure the frame: the sandbox withholds `allow-same-origin`
 * on purpose, so `contentDocument` is unreachable and adding that flag would let
 * scraped third-party markup run with access to this app's session. A frame can
 * still `postMessage` out of an opaque origin, so it measures and reports itself.
 *
 * The script hides its own scrollbars as its first act: if it never runs (scripts
 * blocked, parse error) the frame keeps native scrolling instead of clipping the
 * statement at the fallback height.
 */
const STATEMENT_RESIZE_SCRIPT = `<script>(function () {
  var d = document, r = d.documentElement, last = 0;
  r.style.overflow = 'hidden';

  function measure() {
    var b = d.body;
    return Math.max(
      r.scrollHeight, r.offsetHeight,
      b ? b.scrollHeight : 0, b ? b.offsetHeight : 0
    );
  }

  function report() {
    var h = measure();
    // Ignore sub-pixel churn; MathJax reflow moves the height by far more.
    if (Math.abs(h - last) < 2) return;
    last = h;
    parent.postMessage({ xjStatementHeight: h }, '*');
  }

  if (typeof ResizeObserver === 'function') {
    var ro = new ResizeObserver(report);
    ro.observe(r);
    if (d.body) ro.observe(d.body);
  }
  addEventListener('load', report);
  addEventListener('resize', report);
  // MathJax typesets after load and changes the height substantially; webfonts
  // land later still. A few settling passes cover both without polling forever.
  [0, 150, 400, 900, 1800, 3500].forEach(function (t) { setTimeout(report, t); });
  report();
}());<\/script>`;

/**
 * The scraped page links its CSS, scripts and images with root-relative paths
 * that only resolve against the API host, so a <base> is injected before the
 * markup is handed to `srcdoc`.
 *
 * The statement also pulls in the backend's bundled Bootstrap 4, which expects
 * a jQuery the page never loads and throws on evaluation. A static statement
 * needs none of its behaviour, so the tag is dropped rather than left to fail.
 */
function withBaseHref(html: string, apiUrl: string): string {
  const head = `<base href="${apiUrl.replace(/\/$/, '')}/">`;
  const cleaned = html.replace(
    /<script\b[^>]*\bsrc\s*=\s*["'][^"']*bootstrap[^"']*["'][^>]*>\s*<\/script>/gi, '');

  // The reporter goes last so it observes the fully parsed document.
  const withBase =
    /<head[^>]*>/i.test(cleaned) ? cleaned.replace(/<head([^>]*)>/i, `<head$1>${head}`)
    : /<html[^>]*>/i.test(cleaned) ? cleaned.replace(/<html([^>]*)>/i, `<html$1><head>${head}</head>`)
    : `<head>${head}</head>${cleaned}`;

  return /<\/body>/i.test(withBase)
    ? withBase.replace(/<\/body>/i, `${STATEMENT_RESIZE_SCRIPT}</body>`)
    : withBase + STATEMENT_RESIZE_SCRIPT;
}
