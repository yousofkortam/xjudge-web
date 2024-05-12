import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(private _HttpClient: HttpClient) { }

  getAllSubmissions(pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/submission?size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  filterSubmissions(userHandle: string, oj: string, problemCode: string, language: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/submission?userHandle=${userHandle}&oj=${oj}&problemCode=${problemCode}&language=${language}&size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }
}
