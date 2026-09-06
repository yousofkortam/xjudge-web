import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';

interface NavLink {
  label: string;
  path: string;
  /** Only shown to signed-in users. */
  requiresAuth?: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {

  readonly links: NavLink[] = [
    { label: 'Home',     path: '/home' },
    { label: 'Problems', path: '/problem' },
    { label: 'Contests', path: '/contest' },
    { label: 'Groups',   path: '/group' },
    { label: 'Status',   path: '/status' },
  ];

  isLogin = false;
  handle = '';
  menuOpen = false;
  userMenuOpen = false;
  searchTerm = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._AuthService.userData
      .pipe(takeUntil(this.destroy$))
      .subscribe(session => {
        this.isLogin = session !== null;
        this.handle = session?.sub ?? '';
        this.cdr.markForCheck();
      });

    // Close the mobile menu after any navigation, otherwise it covers the page.
    this._Router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => {
        this.menuOpen = false;
        this.userMenuOpen = false;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; this.userMenuOpen = false; }

  toggleUserMenu(): void { this.userMenuOpen = !this.userMenuOpen; }

  @HostListener('document:keydown.escape')
  closeMenus(): void {
    if (this.menuOpen || this.userMenuOpen) {
      this.menuOpen = false;
      this.userMenuOpen = false;
      this.cdr.markForCheck();
    }
  }

  submitSearch(): void {
    const term = this.searchTerm.trim();
    // The problems list is the only endpoint with a free-text title filter.
    void this._Router.navigate(['/problem'], term ? { queryParams: { title: term } } : {});
  }

  logOut(): void {
    this._AuthService.logOut();
  }
}
