import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContestService } from './contest.service';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  baseUrl: string = environment.apiUrl;

  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(private _HttpClient: HttpClient,
    private contestService: ContestService
  ) { }

  getAllProblems(pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/problem?size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  getSpecificProblem(problemSource: string, problemCode: string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/problem/${problemSource}-${problemCode}`,
      { headers: this.headers }
    );
  };

  filterProblem(source: string, problemCode: string, title: string, contestName: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/problem?source=${source}&problemCode=${problemCode}&title=${title}&size=${pageSize}&pageNo=${pageNo}&contestName=${contestName}`, { headers: this.headers });
  }

  submitProblem(userData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/problem/submit`, userData, { headers: this.headers });
  }

  getCompilersForSubmitProblem(onlineJudge: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/compiler?onlineJudge=${onlineJudge}`, { headers: this.headers });
  }

  getSpecificProblemByHashTagForContest(contestId: number, hashTag: string): Observable<any> {
    return this.contestService.getContestProblemByHashTag(contestId, hashTag);
  }

  getSpecificProblemDetailsByHashtag(contestId: string, hashtag: string): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}/contest/${contestId}/problem/${hashtag}`);
  }

  getUserStatistics(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/problem/user-statistics`, { headers: this.headers });
  }
}
