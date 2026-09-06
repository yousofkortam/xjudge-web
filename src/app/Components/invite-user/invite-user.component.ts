import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from 'src/app/ApiServices/group.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnDestroy {

  isLoading = false;
  apiError = '';
  successMessage = '';
  validationErrors: Record<string, string> = {};

  inviteUserForm = new FormGroup({
    handle: new FormControl('', [Validators.required, Validators.maxLength(20)]),
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private groupService: GroupService,
    private dialogRef: MatDialogRef<InviteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {}) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleInviteUser(): void {
    if (this.isLoading) return;
    if (this.inviteUserForm.invalid) {
      this.inviteUserForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.successMessage = '';
    this.validationErrors = {};

    this.groupService.inviteUser({
      receiverHandle: this.inviteUserForm.value.handle,
      groupId: this.data?.groupId,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = typeof response === 'string'
          ? response
          : (response?.message || `Invitation sent to ${this.inviteUserForm.value.handle}.`);
        // Keep the dialog open so a leader can invite several people in a row.
        this.inviteUserForm.reset({ handle: '' });
      },
      error: (err) => {
        this.isLoading = false;
        this.validationErrors = apiValidationErrors(err);
        this.apiError = apiErrorMessage(err);
      }
    });
  }

  close(): void { this.dialogRef.close(); }
}
