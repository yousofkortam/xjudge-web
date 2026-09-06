import { ErrorHandler, Injectable, NgZone, isDevMode } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage } from './api-error';

/**
 * Last line of defence. Angular's default handler only logs, which is fine —
 * the reason this exists is to surface the failure to the user instead of
 * leaving a silently broken screen, while still keeping the full error in the
 * console for development.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private lastMessage = '';
  private lastShownAt = 0;

  constructor(private zone: NgZone, private snackBar: MatSnackBar) {}

  handleError(error: unknown): void {
    console.error(error);

    // HTTP failures are reported by the component that made the call; a toast
    // here as well would double up on every failed request.
    if (error instanceof HttpErrorResponse) return;

    const message = isDevMode()
      ? apiErrorMessage(error)
      : 'Something went wrong. Please refresh the page.';

    // Errors often arrive in bursts from the same broken template.
    const now = Date.now();
    if (message === this.lastMessage && now - this.lastShownAt < 5000) return;
    this.lastMessage = message;
    this.lastShownAt = now;

    this.zone.run(() => {
      this.snackBar.open(message, 'Dismiss', { duration: 6000, verticalPosition: 'top' });
    });
  }
}
