import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-submit-result',
  templateUrl: './submit-result.component.html',
  styleUrls: ['./submit-result.component.css']
})
export class SubmitResultComponent implements OnInit {

  isLoading: boolean = true;
  result: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public submit: boolean = true,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.result = this.data.dummy;
    if (this.data.submit === false) {
      this.result = this.data.response;
      this.isLoading = false;
    } else {
      this.data.response.subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.result = response.data;
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
      });
    }
  }

}
