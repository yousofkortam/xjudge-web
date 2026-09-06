import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { UserService } from 'src/app/ApiServices/user.service';
import { apiErrorMessage } from 'src/app/api-error';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userHandle = '';
  user: any = null;

  loading = true;
  loadError = '';
  notFound = false;

  isTheRightUser = false;
  readonly defaultProfileImage = 'assets/images/Default_Image.jpg';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private userService: UserService,
    private titleService: Title,
    private authService: AuthService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    // switchMap rather than a nested subscribe: navigating between profiles
    // cancels the previous request instead of racing it.
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.userHandle = params.get('handle') ?? '';
          this.isTheRightUser = !!this.userHandle && this.userHandle === this.authService.getUserHandle();
          this.titleService.setTitle(`${this.userHandle || 'Profile'} · X-Judge`);
          this.loading = true;
          this.loadError = '';
          this.notFound = false;
          this.user = null;
          return this.userService.getUserDetails(this.userHandle);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.user = response ?? null;
          this.notFound = !this.user;
        },
        error: (err) => {
          this.loading = false;
          this.user = null;
          if (err?.status === 404) {
            this.notFound = true;
          } else if (err?.status !== 401) {
            this.loadError = apiErrorMessage(err);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get totalAttempts(): number {
    return Number(this.user?.solvedCount ?? 0) + Number(this.user?.attemptedCount ?? 0);
  }

  get fullName(): string {
    return [this.user?.firstName, this.user?.lastName].filter(Boolean).join(' ') || this.userHandle;
  }

  openUpdateProfileDialog(): void {
    this.dialog
      .open(UpdateProfileComponent, {
        data: { user: this.user },
        width: 'min(560px, 94vw)',
        maxHeight: '90vh',
        autoFocus: 'first-tabbable',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(updated => { if (updated) this.user = { ...this.user, ...updated }; });
  }
}
