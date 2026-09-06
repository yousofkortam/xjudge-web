import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Inline placeholder for panels that need a session. Used inside a page rather
 * than as a route, so the surrounding page still renders.
 */
@Component({
  selector: 'app-not-logged-in',
  templateUrl: './not-logged-in.component.html',
  styleUrls: ['./not-logged-in.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotLoggedInComponent {
  @Input() message = 'Sign in to see this.';
  @Input() returnUrl = '';
}
