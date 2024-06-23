import { SubmitProblemComponent } from './../Components/submit-problem/submit-problem.component';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  userData = new BehaviorSubject(null);

  headers: any = {token: localStorage.getItem("userToken")};

  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router) {
    if (this.isLogin()) {
      this.decodeUserData();
    }
  }

  getUserToken() {
    return localStorage.getItem('userToken');
  }

  ngOnInit(): void {
    this.userData.subscribe(() => {
      setTimeout(() => {
        if (this.getUserHandle()) {
          this.logOut();
        }
      }, 86400000);
    });
  }

  decodeUserData() {
    let encodedToken = JSON.stringify(localStorage.getItem('userToken'));
    let decodedToken: any = jwtDecode(encodedToken);
    if (this.userData.value == null) {
      this.userData.next(decodedToken);
    }
    return decodedToken;
  }

  getUserHandle() {
    return this.decodeUserData().sub;
  }

  register(userData: object): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:7070/auth/register',
      userData
    );
  }

  login(userData: object): Observable<any> {
    return this._HttpClient.post('http://localhost:7070/auth/login', userData);
  }

  forgetPassword(email: string): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:7070/auth/forget-password',
      { email: email }
    );

  };

  resetPassword(requestBody: any): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:7070/auth/reset-password',
      requestBody
    );
  }

  changePassword(userData: object): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:7070',
      userData,
      { headers: this.headers }
    );
  }

  logOut() {
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this._Router.navigate(['/login']).then(r => r);
  }

  isLogin(): boolean {
    return localStorage.getItem('userToken') != null;
  }

}
