import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/ApiServices/user.service';
import { apiErrorMessage } from 'src/app/api-error';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit, OnDestroy {

  invitations: any[] = [];
  loading = false;
  loadError = '';
  isAuthenticated = false;

  /** Ids currently being accepted/declined, so the buttons can't double-fire. */
  pending = new Set<number>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.isAuthenticated = this.userService.isAuthenticated();
    if (this.isAuthenticated) this.loadInvitations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByInvitation = (_: number, invitation: any): number => invitation?.id;

  isPending(id: number): boolean { return this.pending.has(id); }

  statusClass(status: string | undefined): string {
    switch ((status ?? '').toUpperCase()) {
      case 'ACCEPTED': return 'xj-badge--success';
      case 'DECLINED': return 'xj-badge--danger';
      case 'PENDING':  return 'xj-badge--warning';
      default:         return 'xj-badge--neutral';
    }
  }

  loadInvitations(): void {
    this.loading = true;
    this.loadError = '';
    this.userService.getUserInvitations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.invitations = Array.isArray(response) ? response : (response?.content ?? []);
        },
        error: (error) => {
          this.loading = false;
          this.invitations = [];
          if (error?.status !== 401) this.loadError = apiErrorMessage(error);
        }
      });
  }

  acceptInvitation(invitationId: number): void {
    this.respond(invitationId, 'ACCEPTED');
  }

  declineInvitation(invitationId: number): void {
    this.respond(invitationId, 'DECLINED');
  }

  private respond(invitationId: number, status: 'ACCEPTED' | 'DECLINED'): void {
    if (this.pending.has(invitationId)) return;
    this.pending.add(invitationId);

    const request$ = status === 'ACCEPTED'
      ? this.userService.acceptInvitation(invitationId)
      : this.userService.declineInvitation(invitationId);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.pending.delete(invitationId);
        this.invitations = this.invitations.map(invitation =>
          invitation.id === invitationId ? { ...invitation, status } : invitation);
        this.snackBar.open(
          status === 'ACCEPTED' ? 'Invitation accepted.' : 'Invitation declined.',
          'Close', { duration: 4000 });
      },
      error: (error) => {
        this.pending.delete(invitationId);
        this.snackBar.open(apiErrorMessage(error), 'Close', { duration: 6000 });
      }
    });
  }
}
