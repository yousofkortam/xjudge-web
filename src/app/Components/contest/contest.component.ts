import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ContestService } from 'src/app/ApiServices/contest.service';
import { CreateContestComponent } from '../create-contest/create-contest.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {
  duration: any
  loading: boolean = false;
  Contests: any = [];
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 25;
  pageNo: number = 0;

  // Filter options
  category: string = '';
  status: string = '';
  title: string = '';
  owner: string = '';

  buttons: any = [
    { 'name': 'All', 'style': {'background-color': '#0275d8', 'color': 'while'}, click: () => this.reset() },
    { 'name': 'Public Contests', 'style': {'background-color': 'white', 'color': 'black'}, click: () => this.getPublicContests() },
    { 'name': 'Private Contests', 'style': {'background-color': 'white', 'color': 'black'}, click: () => this.getPrivateContests() },
    { 'name': 'My Contests', 'style': {'background-color': 'white', 'color': 'black'}, click: () => this.getMineContests() },
  ];

  buttonsType: any = [
    { 'name': 'Classical', 'style': {'background-color': 'white', 'color': 'black'}, 'img': '/assets/images/classical.gif' , click: () => this.getClassicalContests() },
    { 'name': 'Group', 'style': {'background-color': 'white', 'color': 'black'}, 'img': '/assets/images/group.png', click: () => this.getGroupContests() },
  ];

  constructor(private _ContestService: ContestService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.titleService.setTitle('Contests');
    this.setButtonStyle('All', '#0275d8', 'white');
    this.filterContests();
  }

  trackByContestId(index: number, contest: any): string {
    return contest.id; // Assuming problemCode is unique
  }

  setButtonStyle(button: string, color: string, textColor: string) {
    for (let btn of this.buttons) {
      if (btn.name === button) {
        btn['style']['background-color'] = color;
        btn['style']['color'] = textColor;
      } else {
        btn['style']['background-color'] = 'white';
        btn['style']['color'] = 'black';
      }
    }
    for (let btn of this.buttonsType) {
      if (btn.name === button) {
        btn['style']['background-color'] = color;
        btn['style']['color'] = textColor;
      } else {
        btn['style']['background-color'] = 'white';
        btn['style']['color'] = 'black';
      }
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNo = event.pageIndex;
    this.filterContests();
  }

  openCreateContestDialog() {
    this.dialog.open(CreateContestComponent, {
      data: {
        inGroup: false,
        groupId: 0
      },
      width: '65%',
      height: 'auto',
      disableClose: true
    });
  }

  filterContests(category: string = this.category, status: string = this.status, owner: string = this.owner) {
    this.loading = true;
    this._ContestService.filterContests(category, status, owner, this.title, this.pageNo, this.pageSize).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.loading = false;
          this.Contests = response.data.content;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.log(error);
      }
    });
  }

  resetFilterOptions() {
    this.category = '';
    this.status = '';
    this.owner = '';
    this.title = '';
  }

  reset() {
    this.resetFilterOptions();
    this.setButtonStyle('All', '#0275d8', 'white');
    this.filterContests();
  }

  getPublicContests() {
    this.resetFilterOptions();
    this.category = 'public';
    this.setButtonStyle('Public Contests', '#0275d8', 'white');
    this.filterContests();
  }

  getPrivateContests() {
    this.resetFilterOptions();
    this.category = 'private';
    this.setButtonStyle('Private Contests', '#0275d8', 'white');
    this.filterContests();
  }

  getMineContests() {
    this.resetFilterOptions();
    this.category = 'mine';
    this.setButtonStyle('My Contests', '#0275d8', 'white');
    this.filterContests();
  }

  getClassicalContests() {
    this.resetFilterOptions();
    this.category = 'classic';
    this.setButtonStyle('Classical', '#0275d8', 'white');
    this.filterContests();
  }

  getGroupContests() {
    this.resetFilterOptions();
    this.category = 'group';
    this.setButtonStyle('Group', '#0275d8', 'white');
    this.filterContests();
  }

}
