import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { GroupMemberModel } from "../../models/group/GroupMemberModel";
import { GroupService } from "../../ApiServices/group.service";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-group-members-table',
  templateUrl: './group-members-table.component.html',
  styleUrls: ['./group-members-table.component.css'],
  standalone: true,
  imports: [TableModule, CommonModule, RouterLink]
})
export class GroupMembersTableComponent implements OnInit {
  pageNo: number = 0;
  size: number = 5;

  members: GroupMemberModel[] = [];
  errorMessage: string | null = null;

  constructor(private groupService: GroupService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getGroupMembers();
  }

  getGroupMembers() {
    const groupIdParam = this.route.snapshot.paramMap.get('groupId');

    if (groupIdParam == null) {
      this.errorMessage = "Group Id is not provided.";
      return;
    }

    const groupId = parseInt(groupIdParam);

    this.groupService.getGroupMembers(groupId, this.pageNo, this.size).subscribe({
      next: (response) => {
        this.members = response.data.content as GroupMemberModel[];
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error.message;
      },
    });
  }

  onPage(event: { first: number; rows: number; }) {
    this.pageNo = event.first / event.rows;
    this.size = event.rows;
    this.getGroupMembers();
  }
}
