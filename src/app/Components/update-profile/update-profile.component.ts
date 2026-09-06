import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/ApiServices/user.service';
import { apiErrorMessage, apiValidationErrors } from 'src/app/api-error';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnDestroy {

  isLoading = false;
  apiError = '';
  validationErrors: Record<string, string> = {};

  updateProfielForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private userServive: UserService,
    private dialogRef: MatDialogRef<UpdateProfileComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any = {}) {
    const user = data?.user ?? {};
    // Built in the constructor body so a missing `user` cannot throw during
    // field initialisation, which used to take the whole dialog down.
    this.updateProfielForm = new FormGroup({
      firstName: new FormControl(user.firstName ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z]+$/)]),
      lastName: new FormControl(user.lastName ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z]+$/)]),
      email: new FormControl(user.email ?? '', [Validators.required, Validators.email]),
      school: new FormControl(user.school ?? '', [Validators.maxLength(100)]),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleUpdateProfile(): void {
    if (this.isLoading) return;
    if (this.updateProfielForm.invalid) {
      this.updateProfielForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';
    this.validationErrors = {};

    this.userServive.updateUser(this.updateProfielForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.isLoading = false;
          this.snackBar.open('Profile updated.', 'Close', { duration: 4000, verticalPosition: 'top' });
          // Hand the new values back so the profile page can refresh in place
          // rather than round-tripping through the router.
          this.dialogRef.close(updated ?? this.updateProfielForm.value);
        },
        error: (err) => {
          this.isLoading = false;
          this.validationErrors = apiValidationErrors(err);
          this.apiError = apiErrorMessage(err);
        }
      });
  }
}
