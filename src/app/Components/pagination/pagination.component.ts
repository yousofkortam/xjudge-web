import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PageChange {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() totalPages = 0;
  @Input() totalElements = 0;
  @Input() pageSize = 25;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Output() pageChange = new EventEmitter<PageChange>();

  /**
   * Page numbers to render, with -1 standing in for a gap. Keeps the control a
   * fixed width no matter how many pages exist.
   */
  get pages(): number[] {
    const total = this.totalPages;
    if (total <= 1) return [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);

    const current = this.pageIndex;
    const out = new Set<number>([0, total - 1, current]);
    if (current - 1 > 0) out.add(current - 1);
    if (current + 1 < total - 1) out.add(current + 1);

    const sorted = [...out].sort((a, b) => a - b);
    const withGaps: number[] = [];
    sorted.forEach((page, i) => {
      if (i > 0 && page - sorted[i - 1] > 1) withGaps.push(-1);
      withGaps.push(page);
    });
    return withGaps;
  }

  get rangeStart(): number {
    return this.totalElements === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalElements);
  }

  goTo(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.pageIndex) return;
    this.pageChange.emit({ pageIndex: page, pageSize: this.pageSize });
  }

  changeSize(value: string): void {
    const size = Number(value);
    if (!size || size === this.pageSize) return;
    // Reset to the first page: the old index may not exist at the new size.
    this.pageChange.emit({ pageIndex: 0, pageSize: size });
  }

  trackByPage = (index: number, page: number): string => `${index}-${page}`;
}
