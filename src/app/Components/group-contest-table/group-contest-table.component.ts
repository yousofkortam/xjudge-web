import { Component } from '@angular/core';
import {GroupContestModel} from "../../models/group/GroupContestModel";
import {GroupService} from "../../ApiServices/group.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-group-contest-table',
  templateUrl: './group-contest-table.component.html',
  styleUrls: ['./group-contest-table.component.css']
})
export class GroupContestTableComponent {
  pageNo: number = 0;
  size: number = 5;

  contestData: GroupContestModel[] = [];
  errorMessage: string | null = null;

  constructor(private groupService: GroupService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllContests();
  }

  getAllContests() {
    const groupIdParam = this.route.snapshot.paramMap.get('groupId');

    if (groupIdParam == null) {
      this.errorMessage = "Group Id is not provided.";
      return;
    }

    const groupId = parseInt(groupIdParam);

    this.groupService.getGroupContests(groupId).subscribe({
      next: (response) => {
        this.contestData = response.data as GroupContestModel[];
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      },
    });
  }

  onPage(event: { first: number; rows: number; }) {
    this.pageNo = event.first / event.rows;
    this.size = event.rows;
  }
}
