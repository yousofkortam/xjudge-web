import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/ApiServices/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  isLoading: boolean = false;

  updateProfielForm: FormGroup = new FormGroup({
    firstName:new FormControl(this.data.user.firstName, [Validators.required]),
    lastName:new FormControl(this.data.user.lastName, [Validators.required ]),
    school:new FormControl(this.data.user.school),
  });

  constructor(
    private userServive: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any = {}) { }

  ngOnInit(): void {
    console.log(this.data.user.firstName);
    console.log(this.data.user.email);
    
  }

  handleUpdateProfile() {
    this.isLoading = true;
    this.userServive.updateUser(this.data.user.handle, this.data.user.email, this.updateProfielForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

}
