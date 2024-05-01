import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../ApiServices/group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
  
  createGroupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private groupService: GroupService, private _Router: Router) {}

  ngOnInit(): void {
    this.createGroupForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      visibility: ['PUBLIC', Validators.required] 
    });
  }

  handleSubmitGroup() {
    if (this.createGroupForm.valid) {
      const groupData = {
        name: this.createGroupForm.value.name,
        description: this.createGroupForm.value.description,
        visibility: this.createGroupForm.value.visibility
      };
  
      this.groupService.createGroup(groupData).subscribe(
        (response) => {
          console.log('Group created successfully:', response);
          this._Router.navigate(['/group']);
          
        },
        (error) => {
          console.error('Error creating group:', error);
        }
      );
    } else {
      console.log('Form is invalid!');
    }
  }
}
