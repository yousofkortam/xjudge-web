import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../ApiServices/group.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {

  isLoading: boolean = false;
  apiError: string = '';

  createGroupForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    visibility: new FormControl('PUBLIC', Validators.required)
  });

  constructor(
    private _snackBar: MatSnackBar,
    private groupService: GroupService,
    private _Router: Router,
    private dialgo: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.createGroupForm.controls['name'].setValue(data.name);
      this.createGroupForm.controls['description'].setValue(data.description);
      this.createGroupForm.controls['visibility'].setValue(data.visibility);
    }
  }

  handleSubmitGroup() {
    if (this.data) {
      this.handleUpdateGroup();
    } else {
      this.handleCreateGroup();
    }
  }

  handleCreateGroup() {
    this.isLoading = true;
    if (this.createGroupForm.valid) {
      this.groupService.createGroup(this.createGroupForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Response received:', response);
          if (response.success === true) {
            const groupId = response.data?.id;
            if (groupId) {
              console.log('Group ID:', groupId);
              this.dialgo.closeAll();
              this._Router.navigate(['/group', groupId]);
            } else {
              console.error('Group ID not found in response:', response);
            }
          }
        },
        error: (response) => {
          this.isLoading = false;
          this.apiError = response.error.error.message;
          this._snackBar.open(this.apiError, 'close', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  handleUpdateGroup() {
    this.isLoading = true;
    if (this.createGroupForm.valid) {
      this.groupService.updateGroup(this.data.groupId, this.createGroupForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Response received:', response);
          if (response.success === true) {
            this.dialgo.closeAll();
            window.location.reload();
          }
        },
        error: (response) => {
          this.isLoading = false;
          this.apiError = response.error.error.message;
          this._snackBar.open(this.apiError, 'close', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      });
    }
  }}
