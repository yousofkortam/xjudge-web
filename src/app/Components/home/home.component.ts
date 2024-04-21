import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLogin: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private titleService: Title
  ) {
    this.isLogin = this._AuthService.isLogin();
  }

  ngOnInit(): void {
    this.titleService.setTitle('X-Judge');
  }

}
