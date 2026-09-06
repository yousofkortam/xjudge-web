import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent {
  @Input() groups: any[] = [];

  trackByGroup = (_: number, group: any): number => group?.id;

  roleClass(role: string | undefined): string {
    switch ((role ?? '').toUpperCase()) {
      case 'LEADER':  return 'xj-badge--brand';
      case 'MANAGER': return 'xj-badge--info';
      case 'MEMBER':  return 'xj-badge--neutral';
      default:        return 'xj-badge--neutral';
    }
  }
}
