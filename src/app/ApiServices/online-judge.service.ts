import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OnlineJudgeService {

  baseUrl: string = environment.apiUrl + '/online-judge';
  
  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(private _HttpClient: HttpClient) { }

  getOnlineJudges(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}`, { headers: this.headers });
  }

}
