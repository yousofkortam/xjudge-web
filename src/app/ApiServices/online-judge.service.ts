import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OnlineJudgeService {

  baseUrl: string = environment.apiUrl + '/online-judge';

  headers: any;
  constructor(private _HttpClient: HttpClient) {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      this.headers = new HttpHeaders();
    }
  }

  getOnlineJudges(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}`, { headers: this.headers });
  }

}
