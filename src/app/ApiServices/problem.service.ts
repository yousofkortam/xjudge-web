import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContestService } from './contest.service';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  baseUrl: string = environment.apiUrl;
  constructor(
    private _HttpClient: HttpClient,
    private contestService: ContestService) {}

  getAllProblems(pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/problem?size=${pageSize}&pageNo=${pageNo}`
    );
  }

  getSpecificProblem(problemSource: string, problemCode: string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/problem/${problemSource}-${problemCode}`
    );
  };

  filterProblem(source: string, problemCode: string, title: string, contestName: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/problem?source=${source}&problemCode=${problemCode}&title=${title}&size=${pageSize}&pageNo=${pageNo}&contestName=${contestName}`);
  }

  submitProblem(userData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/problem/submit`, userData);
  }

  getCompilersForSubmitProblem(onlineJudge: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/compiler?onlineJudge=${onlineJudge}`);
  }

  getSpecificProblemByHashTagForContest(contestId: string | number | null, hashTag: string | null): Observable<any> {
    return this.contestService.getContestProblemByHashTag(contestId, hashTag);
  }

  getSpecificProblemDetailsByHashtag(contestId: string, hashtag: string): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}/contest/${contestId}/problem/${hashtag}`);
  }

  /**
   * Fetches the scraped statement as raw HTML.
   *
   * It is requested rather than framed by URL because the backend sends
   * `X-Frame-Options: DENY`, which blocks a cross-origin <iframe src>. The
   * caller renders the markup through `srcdoc` in a sandboxed frame instead.
   */
  getProblemDescription(descriptionRoute: string): Observable<string> {
    return this._HttpClient.get(`${this.baseUrl}${descriptionRoute}`, { responseType: 'text' });
  }

  getUserStatistics(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/problem/user-statistics`);
  }
}
