import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../ApiServices/group.service';


@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {
  groups: any[] = []; // Array to hold the groups
  currentPage = 0;
  totalPages = 0;

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroupsByUserHandle(this.currentPage, 25).subscribe(
      (response) => {
        this.groups = response.data.content; 
        this.currentPage = response.data.number; 
        this.totalPages = response.data.totalPages; 
        console.log(this.groups);
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadGroups();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadGroups();
    }
  }
}
