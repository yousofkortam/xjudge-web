import { Component } from '@angular/core';
import { AuthService } from 'src/app/ApiServices/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

   isLogin:boolean = false ;

    constructor(private _AuthService:AuthService) {
      _AuthService.userData.subscribe ({
        next:()=> {
          this.isLogin = _AuthService.userData.getValue() !== null;
        }
      });
    }

    logOut() {
      this._AuthService.logOut();
    }

}
