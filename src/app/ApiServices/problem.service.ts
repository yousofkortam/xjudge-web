import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(private _HttpClient: HttpClient) { }

  getAllProblems(pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/problem?size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  getSpecificProblem(problemSource: string, problemCode: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/problem/${problemSource}-${problemCode}`,
      { headers: this.headers }
    );
  };

  searchByCode(code: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/problem/code?problemCode=${code}&size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  searchByTitle(title: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/problem/search?title=${title}&size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }

  submitProblem(userData: object): Observable<any> {
     return this._HttpClient.post( 'http://localhost:7070/problem/submit',  userData);
  }

  getCompilersForSubmitProblem(onlineJudge:string){
    return this._HttpClient.get(`http://localhost:7070/compiler?onlineJudge=${onlineJudge}`);
  }

}
