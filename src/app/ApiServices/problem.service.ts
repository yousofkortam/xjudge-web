import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContestService } from './contest.service';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(private _HttpClient: HttpClient,
    private contestService: ContestService
  ) { }

  getAllProblems(pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/problem?size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  getSpecificProblem(problemSource: string, problemCode: string): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/problem/${problemSource}-${problemCode}`,
      { headers: this.headers }
    );
  };

  filterProblem(source: string, problemCode: string, title: string, contestName: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/problem?source=${source}&problemCode=${problemCode}&title=${title}&size=${pageSize}&pageNo=${pageNo}&contestName=${contestName}`, { headers: this.headers });
  }

  submitProblem(userData: object): Observable<any> {
    return this._HttpClient.post('http://localhost:7070/problem/submit', userData, { headers: this.headers });
  }

  getCompilersForSubmitProblem(onlineJudge: string): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/compiler?onlineJudge=${onlineJudge}`, { headers: this.headers });
  }

  getSpecificProblemByHashTagForContest(contestId: number, hashTag: string): Observable<any> {
    return this.contestService.getContestProblemByHashTag(contestId, hashTag);
  }
  
  getSpecificProblemDetailsByHashtag(contestId: string, hashtag: string): Observable<any> {
    return this._HttpClient.get<any>(`http://localhost:7070/contest/${contestId}/problem/${hashtag}`);
  }

  getUserStatistics(): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/problem/user-statistics`, { headers: this.headers });
  }
}
