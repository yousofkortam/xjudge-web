import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { UserService } from 'src/app/ApiServices/user.service';
import { CreateGroupComponent } from '../create-group/create-group.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {

  readonly tabs = [
    { path: 'myGroups',      label: 'My groups',  requiresAuth: true },
    { path: 'exploreGroups', label: 'Explore',    requiresAuth: false },
    { path: 'invitations',   label: 'Invitations', requiresAuth: true },
  ];

  isAuthenticated = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private titleService: Title,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private userService: UserService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Groups · X-Judge');
    this.isAuthenticated = this.userService.isAuthenticated();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get visibleTabs() {
    return this.tabs.filter(tab => !tab.requiresAuth || this.isAuthenticated);
  }

  openCreateGroupForm(): void {
    if (!this.isAuthenticated) {
      this._snackBar.open('Sign in to create a group.', 'Close', { duration: 4000, verticalPosition: 'top' });
      return;
    }
    this.dialog
      .open(CreateGroupComponent, {
        width: 'min(560px, 94vw)',
        maxHeight: '90vh',
        autoFocus: 'first-tabbable',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(created => {
        // Re-enter the current child route so the freshly created group appears.
        if (created) void this.router.navigateByUrl(this.router.url);
      });
  }
}
