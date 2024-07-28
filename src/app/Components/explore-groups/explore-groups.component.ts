import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../ApiServices/group.service';

@Component({
  selector: 'app-explore-groups',
  templateUrl: './explore-groups.component.html',
  styleUrls: ['./explore-groups.component.css']
})
export class ExploreGroupsComponent implements OnInit {
  groups: any[] = [];
  searchName: string = '';
  loading: boolean = false;
  pageNo: number = 0;
  size: number = 25;
  totalPages: number = 0;

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.searchGroups();
  }

  searchGroups(): void {
    this.loading = true;
    this.groupService.searchGroupByName(this.searchName, this.pageNo, this.size).subscribe({
      next: (response) => {
        this.groups = response.content;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching groups', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.pageNo = 0; // Reset to first page on new search
    this.searchGroups();
  }

  onPageChange(pageNo: number): void {
    this.pageNo = pageNo;
    this.searchGroups();
  }
}
