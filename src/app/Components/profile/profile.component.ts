import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/ApiServices/auth.service';
import { UserService } from 'src/app/ApiServices/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userHandle: any;
  user: any;
  isTheRightUser: boolean = true;
  defaultProfileImage: string = "./assets/images/Default_Image.jpg";
  
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private userService: UserService,
    private titleService: Title,
    private authService: AuthService) { }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      this.userHandle = param.get('handle');
    });
    this.titleService.setTitle(`${this.userHandle}'s profile`);
    this.isTheRightUser = this.userHandle == this.authService.getUserHandle();
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUserDetails(this.userHandle).subscribe({
      next: (response) => {
        console.log(response);
        this.user = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
