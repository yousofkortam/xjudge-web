import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from 'src/app/ApiServices/group.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent {

  isLoading: boolean = false;
  validationsErrors: any = {};

  inviteUserForm: FormGroup = new FormGroup({
    handle:new FormControl(null, [Validators.required]),
  });

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any = {}) { }


  handleInviteUser() {
    this.isLoading = true;
    let request = {
      receiverHandle: this.inviteUserForm.value.handle,
      groupId: this.data.groupId
    };
    console.log(request);
    this.groupService.inviteUser(request).subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.snackBar.open(response.message, 'close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.validationsErrors = err.error.error;
        this.snackBar.open(err.error.error.message, 'close', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    });
    
  }

}
