import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../ApiServices/group.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnDestroy {

  isLoading = false;
  apiError = '';
  validationErrors: Record<string, string> = {};

  /** The same dialog serves creation and editing; `data` decides which. */
  readonly isEdit: boolean;

  createGroupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    visibility: new FormControl('PUBLIC', [Validators.required]),
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _snackBar: MatSnackBar,
    private groupService: GroupService,
    private _Router: Router,
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isEdit = !!data;
    if (data) {
      this.createGroupForm.patchValue({
        name: data.name ?? '',
        description: data.description ?? '',
        visibility: data.visibility ?? 'PUBLIC',
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubmitGroup(): void {
    if (this.isLoading) return;
    if (this.createGroupForm.invalid) {
      this.createGroupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};

    const request$ = this.isEdit
      ? this.groupService.updateGroup(this.data.groupId, this.createGroupForm.value)
      : this.groupService.createGroup(this.createGroupForm.value);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._snackBar.open(this.isEdit ? 'Group updated.' : 'Group created.', 'Close',
          { duration: 4000, verticalPosition: 'top' });
        // Closing with a truthy value lets the opener refresh instead of the
        // old full-page window.location.reload().
        this.dialogRef.close(true);
        if (!this.isEdit && response?.id) void this._Router.navigate(['/group', response.id]);
      },
      error: (err) => {
        this.isLoading = false;
        this.validationErrors = apiValidationErrors(err);
        this.apiError = apiErrorMessage(err);
      }
    });
  }
}
