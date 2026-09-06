import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  baseUrl: string = environment.apiUrl + '/submission';
  constructor(private _HttpClient: HttpClient) {}

  getAllSubmissions(pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}?size=${pageSize}&pageNo=${pageNo}`
    );
  }

  filterSubmissions(userHandle: string, oj: string, problemCode: string, language: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}?userHandle=${userHandle}&oj=${oj}&problemCode=${problemCode}&language=${language}&size=${pageSize}&pageNo=${pageNo}`
    );
  }

  getSubmissionById(submissionId: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/${submissionId}`
    );
  }

  updateSubmissionOpen(contestId: number): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}/${contestId}/open`,
      {}
    );
  }
}
