import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { GroupService } from './group.service';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  baseUrl: string = environment.apiUrl + '/contest';

  private dataSubject = new Subject<any>();
  data$ = this.dataSubject.asObservable();

  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(
    private _HttpClient: HttpClient,
    private groupService: GroupService) { }


  searchContestByTitle(title: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/search?title=${title}&size=${pageSize}&pageNo=${pageNo}`, { headers: this.headers });
  }
  searchContestByOwner(owner: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/search?title=${owner}&size=${pageSize}&pageNo=${pageNo}`, { headers: this.headers });
  }
  createContest(request: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}`, request, { headers: this.headers });
  }

  submitToContest(id: number, submitData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/${id}/submit`, submitData, { headers: this.headers });
  }

  getAllContests(pageSize: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}?size=${pageSize}`, { headers: this.headers });
  }

  getAllContestProblems(id: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}?size=${id}/problems`, { headers: this.headers });
  }

  getContstRank(id: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${id}/rank`, { headers: this.headers });
  }

  getContestProblemByHashTag(contestId: number, hashTag: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${contestId}/problem/${hashTag}`, { headers: this.headers });
  }

  getSpecificContestById(id: number, password: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${id}?password=${password}`, { headers: this.headers });
  }

  updateSpecificContestById(id: number, data: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${id}`, data, { headers: this.headers });
  }

  deleteSpecificContestById(id: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  getGrouspqwned(): Observable<any> {
    return this.groupService.getGroupsAwnedByUser();
  }

  filterContests(category: string, status: string, owner: string, title: string, pageNo: number, size: number) {
    return this._HttpClient.get(`${this.baseUrl}?category=${category}&status=${status}&owner=${owner}&title=${title}&pageNo=${pageNo}&size=${size}`, { headers: this.headers });
  }

  filterSubmissionsInContest(contestId: number, userHandle: string, problemCode: string, result: string, language: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/${contestId}/submissions?userHandle=${userHandle}&problemCode=${problemCode}&result=${result}&language=${language}&size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }
  markUserAsCheater(contestId: number): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${contestId}/user/mark-cheater`, {}, { headers: this.headers });
  }
 
  
  }
