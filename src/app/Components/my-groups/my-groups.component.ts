import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../ApiServices/group.service';
import { apiErrorMessage } from 'src/app/api-error';
import { PageChange } from '../pagination/pagination.component';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit, OnDestroy {

  groups: any[] = [];
  loading = false;
  loadError = '';

  pageNo = 0;
  pageSize = 25;
  totalPages = 0;
  totalElements = 0;

  isAuthenticated = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.groupService.isAuthenticated();
    if (this.isAuthenticated) this.loadGroups();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadGroups(): void {
    this.loading = true;
    this.loadError = '';
    this.groupService.getGroupsByUserHandle(this.pageNo, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.groups = response?.content ?? [];
          this.pageNo = response?.number ?? this.pageNo;
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

  onPageChange(event: PageChange): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadGroups();
  }
}
