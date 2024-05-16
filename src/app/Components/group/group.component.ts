import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  constructor(private titleService: Title,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.titleService.setTitle('Group');
  }
  currentTab: string = 'myGroups'; // Default tab

  showMyGroups() {
    this.currentTab = 'myGroups';
  }

  showExploreGroups() {
    this.currentTab = 'exploreGroups';
  }
  openCreateGrouptDialog() {
    this.dialog.open( CreateGroupComponent, {
      width: '50%',
      height: 'auto',
      disableClose: true
    });
  }

}
