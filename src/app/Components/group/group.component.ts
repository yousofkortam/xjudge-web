import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  constructor(private titleService: Title) {}

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

  showInvitations() {
    this.currentTab = 'invitations';
  }

}
