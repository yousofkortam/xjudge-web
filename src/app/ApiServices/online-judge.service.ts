import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OnlineJudgeService {

  baseUrl: string = environment.apiUrl + '/online-judge';
  constructor(private _HttpClient: HttpClient) {}

  getOnlineJudges(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}`);
  }

}
