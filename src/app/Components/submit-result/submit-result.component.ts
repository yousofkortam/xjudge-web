import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { SubmissionService } from 'src/app/ApiServices/submission.service';

@Component({
  selector: 'app-submit-result',
  templateUrl: './submit-result.component.html',
  styleUrls: ['./submit-result.component.css']
})
export class SubmitResultComponent implements OnInit {
  isLoading: boolean = true;
  result: any;
  contestId: any
  isChecked: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public submit: any,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private submissionService: SubmissionService,
    private authService : AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.result = this.data.dummy;
    if (!this.data.submit) {
      this.getSubmissionById();
    }
    else {
      this.data.response.subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.result = response.data;
          this.isChecked = this.result.isOpen;
        },
        error: (err: any) => {
          this.isLoading = false;
          if (err.error.success === false) {
            this.dialog.closeAll();
            this._snackBar.open(err.error.error.message, 'close', {
              verticalPosition: 'bottom',
            });
          }
        }
      })
    };
  }

  updateSubmissioinOpen(event : Event , submissionId : any) {
   this.submissionService.updateSubmissionOpen(submissionId).subscribe(
    (rsp)=>{
      const inputElement = event.target as HTMLInputElement;
      console.log('Checkbox is checked:', inputElement.checked)
      console.log(rsp);
    }
   )
  }    
    

  getSubmissionById() {
    this.submissionService.getSubmissionById(this.data.contestId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.result = response.data;
        this.isChecked = this.result.isOpen;
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.error.success === false) {
          this.dialog.closeAll();
          this._snackBar.open(err.error.error.message, 'close', {
            verticalPosition: 'bottom',
          });
        }
      }
    })
  }

  isSubmissionOwner() {
    return this.authService.getUserHandle() === this.result.userHandle;
  }
}

