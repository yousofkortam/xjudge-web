import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateGroupComponent } from '../create-group/create-group.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  currentTab: string = 'myGroups'; // Default tab

  constructor(
    private titleService: Title,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Group');
  }

  showMyGroups() {
    this.currentTab = 'myGroups';
    this.router.navigate(['myGroups'], { relativeTo: this.route });
  }

  showExploreGroups() {
    this.currentTab = 'exploreGroups';
    this.router.navigate(['exploreGroups'], { relativeTo: this.route });
  }

  showInvitations() {
    this.currentTab = 'invitations';
    this.router.navigate(['invitations'], { relativeTo: this.route });
  }

  openCreateGroupForm() {
    this.dialog.open(CreateGroupComponent, {
      width: '50%',
      height: 'auto',
      disableClose: true
    });
  }
}


