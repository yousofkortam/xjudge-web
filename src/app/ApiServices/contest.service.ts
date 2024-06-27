import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class ContestService {
 
  private dataSubject = new Subject<any>();
  data$ = this.dataSubject.asObservable();

  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(
    private _HttpClient: HttpClient,
    private groupService: GroupService) { }
    
      // Fetch data from API and notify subscribers
  // fetchData(apiUrl: string) {
  //   this._HttpClient.get(apiUrl, { headers: this.headers }).pipe(
  //     catchError(error => {
  //       console.error('Error fetching data:', error);
  //       return [];
  //     })
  //   ).subscribe(data => {
  //     this.dataSubject.next(data);
  //   });
  // }


  searchContestByTitle(title: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest/search?title=${title}&size=${pageSize}&pageNo=${pageNo}`, { headers: this.headers });
  }
  searchContestByOwner(owner: String, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest/search?title=${owner}&size=${pageSize}&pageNo=${pageNo}`, { headers: this.headers });
  }
  createContest(request: any):Observable<any> {
    return this._HttpClient.post(`http://localhost:7070/contest`, request, { headers: this.headers });
  }

  submitToContest(id: number , submitData : any):Observable<any> {
    return this._HttpClient.post(`http://localhost:7070/contest/${id}/submit`,submitData ,{ headers: this.headers });
  }
  
  getAllContests(pageSize: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest?size=${pageSize}`,{ headers: this.headers });
  }

  getAllContestProblems(id: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest?size=${id}/problems`,{ headers: this.headers });
  }

  getContstRank(id: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest/${id}/rank`,{ headers: this.headers });
  }

  getContestProblemByHashTag(contestId: number, hashTag: string): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/contest/${contestId}/problem/${hashTag}`,{ headers: this.headers });
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

  getGrouspqwned():Observable<any> {
    return this.groupService.getGroupsAwnedByUser();
  }

  filterContests(category: string, status: string, owner: string, title:string, pageNo: number, size: number) {
    return this._HttpClient.get(`http://localhost:7070/contest?category=${category}&status=${status}&owner=${owner}&title=${title}&pageNo=${pageNo}&size=${size}`,{ headers: this.headers });
  }

  filterSubmissionsInContest(contestId : number , userHandle: string, problemCode: string, result : string ,language: string, pageSize: number, pageNo: number): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/contest/${contestId}/submissions?userHandle=${userHandle}&problemCode=${problemCode}&result=${result}&language=${language}&size=${pageSize}&pageNo=${pageNo}`,
      { headers: this.headers }
    );
  }
}
