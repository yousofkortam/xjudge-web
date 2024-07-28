import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { UserService } from 'src/app/ApiServices/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  currentTab: string = 'myGroups';

  constructor(
    private titleService: Title,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private userService: UserService
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
    if (!this.userService.isAuthenticated()) {
      this._snackBar.open('You need to login to create a group', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }
    this.dialog.open(CreateGroupComponent, {
      width: '50%',
      height: 'auto',
      disableClose: true
    });
  }
}


