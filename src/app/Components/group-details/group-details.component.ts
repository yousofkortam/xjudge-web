import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { GroupService } from 'src/app/ApiServices/group.service';
import { apiErrorMessage } from 'src/app/api-error';
import { InviteUserComponent } from '../invite-user/invite-user.component';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { CreateContestComponent } from '../create-contest/create-contest.component';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  groupId: string | null = null;
  group: any = null;
  members: any[] = [];
  contests: any[] = [];

  loading = true;
  loadError = '';
  notFound = false;

  isLeader = false;
  isMember = false;
  isAuthenticated = false;
  actionPending = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLogin();
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.groupId = param.get('groupId');
        this.reload();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByContest = (_: number, contest: any): number => contest?.id;
  trackByMember = (index: number, member: any): string => member?.handle ?? String(index);

  reload(): void {
    this.getGroupDetails();
    this.getGroupMembers();
    this.getGroupContests();
  }

  private getGroupDetails(): void {
    this.loading = true;
    this.loadError = '';
    this.notFound = false;

    this.groupService.getSpecificGroup(Number(this.groupId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.group = response ?? null;
          if (!this.group) { this.notFound = true; return; }
          this.isLeader = !!this.group.leader;
          this.isMember = !!this.group.member;
          this.titleService.setTitle(`${this.group.name} · X-Judge`);
        },
        error: (error: any) => {
          this.loading = false;
          this.group = null;
          if (error?.status === 404) this.notFound = true;
          else if (error?.status !== 401) this.loadError = apiErrorMessage(error);
        }
      });
  }

  private getGroupMembers(): void {
    this.groupService.getGroupMembers(Number(this.groupId), 0, 25)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => { this.members = response?.content ?? []; },
        // Members are restricted for non-members; an empty list is the right
        // outcome, not an error banner over the whole page.
        error: () => { this.members = []; }
      });
  }

  private getGroupContests(): void {
    this.groupService.getGroupContests(Number(this.groupId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => { this.contests = Array.isArray(response) ? response : (response?.content ?? []); },
        error: () => { this.contests = []; }
      });
  }

  leaveGroup(): void {
    if (this.actionPending) return;
    if (!confirm(`Leave “${this.group?.name}”?`)) return;

    this.actionPending = true;
    this.groupService.leaveGroup(Number(this.groupId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.actionPending = false;
          this.snackBar.open('You left the group.', 'Close', { duration: 4000, verticalPosition: 'top' });
          // A leader who leaves loses access to the page entirely.
          if (this.isLeader) void this.router.navigate(['/group/myGroups']);
          else this.reload();
        },
        error: (error: any) => {
          this.actionPending = false;
          this.snackBar.open(apiErrorMessage(error), 'Close', { duration: 6000, verticalPosition: 'top' });
        }
      });
  }

  joinGroup(): void {
    if (this.actionPending) return;
    if (!this.isAuthenticated) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: `/group/${this.groupId}` } });
      return;
    }

    this.actionPending = true;
    this.groupService.joinGroup(Number(this.groupId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.actionPending = false;
          this.snackBar.open(
            this.group?.visibility === 'PRIVATE' ? 'Join request sent.' : 'You joined the group.',
            'Close', { duration: 4000, verticalPosition: 'top' });
          this.reload();
        },
        error: (error: any) => {
          this.actionPending = false;
          this.snackBar.open(apiErrorMessage(error), 'Close', { duration: 6000, verticalPosition: 'top' });
        }
      });
  }

  openInviteUserDialog(): void {
    this.dialog.open(InviteUserComponent, {
      data: { groupId: this.groupId },
      width: 'min(480px, 94vw)',
      autoFocus: 'first-tabbable',
      disableClose: true,
    });
  }

  UpdateGroup(): void {
    this.dialog
      .open(CreateGroupComponent, {
        data: {
          groupId: this.groupId,
          name: this.group?.name,
          description: this.group?.description,
          visibility: this.group?.visibility,
        },
        width: 'min(560px, 94vw)',
        maxHeight: '90vh',
        autoFocus: 'first-tabbable',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(updated => { if (updated) this.reload(); });
  }

  addContest(): void {
    this.dialog
      .open(CreateContestComponent, {
        data: { inGroup: true, groupId: this.groupId },
        width: 'min(720px, 94vw)',
        maxHeight: '90vh',
        autoFocus: 'first-tabbable',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(created => { if (created) this.getGroupContests(); });
  }
}
