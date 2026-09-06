import { HttpClient } from '@angular/common/http';
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
  constructor(
    private _HttpClient: HttpClient,
    private groupService: GroupService) {}


  searchContestByTitle(title: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/search?title=${title}&size=${pageSize}&pageNo=${pageNo}`);
  }
  searchContestByOwner(owner: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/search?title=${owner}&size=${pageSize}&pageNo=${pageNo}`);
  }
  createContest(request: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}`, request);
  }

  submitToContest(id: number, submitData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/${id}/submit`, submitData);
  }

  getAllContests(pageSize: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}?size=${pageSize}`);
  }

  getAllContestProblems(id: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}?size=${id}/problems`);
  }

  getContstRank(id: string | number | null): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${id}/rank`);
  }

  getContestProblemByHashTag(contestId: string | number | null, hashTag: string | null): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${contestId}/problem/${hashTag}`);
  }

  getSpecificContestById(id: string | number | null, password: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${id}?password=${password}`);
  }

  updateSpecificContestById(id: number, data: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${id}`, data);
  }

  deleteSpecificContestById(id: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`);
  }

  getGrouspqwned(): Observable<any> {
    return this.groupService.getGroupsAwnedByUser();
  }

  filterContests(category: string, status: string, owner: string, title: string, pageNo: number, size: number) {
    return this._HttpClient.get(`${this.baseUrl}?category=${category}&status=${status}&owner=${owner}&title=${title}&pageNo=${pageNo}&size=${size}`);
  }

  filterSubmissionsInContest(contestId: string | number | null, userHandle: string, problemCode: string, result: string, language: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/${contestId}/submissions?userHandle=${userHandle}&problemCode=${problemCode}&result=${result}&language=${language}&size=${pageSize}&pageNo=${pageNo}`
    );
  }
}
