import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, skip, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'X-Judge';

  private readonly destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        // `skip(1)` leaves the initial page load alone: moving focus there would
        // drop a keyboard user past the skip link and the navigation before they
        // have pressed anything. Only in-app navigations are managed.
        skip(1),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // A router navigation swaps the outlet's contents without moving focus
        // or scroll, which otherwise strands the user at the previous position.
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.getElementById('xj-main')?.focus({ preventScroll: true });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
