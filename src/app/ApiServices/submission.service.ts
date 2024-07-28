import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  baseUrl: string = environment.apiUrl + '/submission';

  headers: any;
  constructor(private _HttpClient: HttpClient) {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      this.headers = new HttpHeaders();
    }
  }

  getAllSubmissions(pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}?size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  filterSubmissions(userHandle: string, oj: string, problemCode: string, language: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}?userHandle=${userHandle}&oj=${oj}&problemCode=${problemCode}&language=${language}&size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  getSubmissionById(submissionId: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/${submissionId}`,
      { headers: this.headers }
    );
  }

  updateSubmissionOpen(contestId: number): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}/${contestId}/open`,
      {},
      { headers: this.headers }
    );
  }
}
