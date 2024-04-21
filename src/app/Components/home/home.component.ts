import { Component } from '@angular/core';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLogin: boolean = false;

  constructor(private _AuthService: AuthService) {
    this.isLogin = this._AuthService.isLogin();
  }

}
