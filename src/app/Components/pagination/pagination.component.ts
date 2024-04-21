import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() totalPages: number = 0;
  @Input() pageSize: number = 25;
  @Output() pageChange = new EventEmitter<any>();

  onPageChange(event: any) {
    this.pageChange.emit(event);
  }
}
