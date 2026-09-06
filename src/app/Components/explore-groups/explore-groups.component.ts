import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../ApiServices/group.service';
import { apiErrorMessage } from 'src/app/api-error';
import { PageChange } from '../pagination/pagination.component';

@Component({
  selector: 'app-explore-groups',
  templateUrl: './explore-groups.component.html',
  styleUrls: ['./explore-groups.component.css']
})
export class ExploreGroupsComponent implements OnInit, OnDestroy {

  groups: any[] = [];
  searchName = '';

  loading = false;
  loadError = '';

  pageNo = 0;
  size = 25;
  totalPages = 0;
  totalElements = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.searchGroups();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchGroups(): void {
    this.loading = true;
    this.loadError = '';
    this.groupService.searchGroupByName(this.searchName, this.pageNo, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.groups = response?.content ?? [];
          this.totalPages = response?.totalPages ?? 0;
          this.totalElements = response?.totalElements ?? this.groups.length;
        },
        error: (error) => {
          this.loading = false;
          this.groups = [];
          this.totalElements = 0;
          if (error?.status !== 401) this.loadError = apiErrorMessage(error);
        }
      });
  }

  onSearch(): void {
    this.pageNo = 0;
    this.searchGroups();
  }

  onPageChange(event: PageChange): void {
    this.pageNo = event.pageIndex;
    this.size = event.pageSize;
    this.searchGroups();
  }
}
