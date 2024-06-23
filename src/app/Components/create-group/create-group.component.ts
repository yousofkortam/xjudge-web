import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../ApiServices/group.service';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent  {
  
  isLoading:boolean = false;
  apiError:string = '';

  createGroupForm= new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    visibility: new FormControl('', Validators.required)
  })

  constructor(   private _snackBar: MatSnackBar, private groupService: GroupService, private _Router: Router) {}



  handleSubmitGroup() {
    this.isLoading = true;
    if (this.createGroupForm.valid) {
      this.groupService.createGroup(this.createGroupForm.value).subscribe({
        next: (response )=> {
          if(response.success === true){
            console.log('Group created successfully:', response);
            this._Router.navigate(['/group']);
          }         
        },
        error: (response)=> {
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
}
