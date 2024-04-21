import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(private _HttpClient: HttpClient) { }

  searchContestByTitle(title: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest/search?title=${title}&size=${pageSize}&pageNo=${pageNo}`, { headers: this.headers });
  }
   searchContestByOwner(owner: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest/search?title=${owner}&size=${pageSize}&pageNo=${pageNo}`, { headers: this.headers });
  }
  createContest():Observable<any> {
    return this._HttpClient.post(`http://localhost:7070/contest`,{ headers: this.headers });
  }

  AddContestSubmission(id: number):Observable<any> {
    return this._HttpClient.post(`http://localhost:7070/contest/${id}/submit`,{ headers: this.headers });
  }
  getAllContests(pageSize: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest?size=${pageSize}`,{ headers: this.headers });
  }

  getAllContestProblems(id: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest?size=${id}/problems`,{ headers: this.headers });
  }

  getSpecificContestById(id:number):Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest/${id}`,{ headers: this.headers });
  }

  updateSpecificContestById(id:number):Observable<any> {
    return this._HttpClient.put(`http://localhost:7070/contest/${id}`,{ headers: this.headers });
  }

  deleteSpecificContestById(id:number):Observable<any> {
    return this._HttpClient.delete(`http://localhost:7070/contest/${id}`,{ headers: this.headers });
  }
}
