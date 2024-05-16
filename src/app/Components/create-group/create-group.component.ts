import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../ApiServices/group.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {
  isLoading:boolean = false;
  apiError:string = '';
  
  createGroupForm: FormGroup = new FormGroup({
    name:new FormControl(null, [Validators.required]),
    description:new FormControl(null, [Validators.required ]),
    visibility:new FormControl("PUBLIC", [Validators.required ]),
   });
 
  constructor( private _GroupService: GroupService, private _Router: Router, private dialgo: MatDialog){}

  handleCreateGroup() {
    this.isLoading = true;
    const formValue = this.createGroupForm.value;
    this._GroupService.createGroup(formValue).subscribe({
      next: (response)=> {
        console.log(response);
        if (response.success === true) {
          this.isLoading= false;
          this.dialgo.closeAll();
          this._Router.navigate(['/group']);
        }
      },
      error: (err)=> {
        this.isLoading = false;
        this.apiError = err.error.message;
      }
    });
  }
}
