import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environment/environment';
@Injectable({
  providedIn: 'root'
})

export class GroupService {

  baseUrl: string = environment.apiUrl + '/group';

  headers: any;

  constructor(private _HttpClient: HttpClient) {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      this.headers = new HttpHeaders();
    }
  }

  isAuthenticated() {
    return localStorage.getItem('userToken') ? true : false;
  }

  getSpecificGroup(GroupId: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${GroupId}`, { headers: this.headers }
    );
  };

  deleteSpecificGroup(GroupId: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${GroupId}`, { headers: this.headers }
    );
  };

  createGroup(groupData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}`, groupData, { headers: this.headers });
  }

  updateGroup(groupId: number, groupData: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${groupId}`, groupData, { headers: this.headers });
  }

  getGroupsByUserHandle(pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/userHandle?pageNo=${pageNo}&size=${size}`, { headers: this.headers });
  }

  getAllGroups(pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/public?pageNo=${pageNo}&size=${size}`, { headers: this.headers });
  }

  getGroupsAwnedByUser(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/owned`, { headers: this.headers }
    );
  }

  getGroupMembers(groupId: number, pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${groupId}/members?pageNo=${pageNo}&size=${size}`, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getGroupContests(groupId: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${groupId}/contests`, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  joinGroup(groupId: number): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/${groupId}/join`, null, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  leaveGroup(groupId: number): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/${groupId}/leave`, null, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  inviteUser(request: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/invite`, request, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  searchGroupByName(name: string, pageNo: number = 0, size: number = 25): Observable<any> {
    const params = {
      name,
      pageNo: pageNo.toString(),
      size: size.toString()
    };
    return this._HttpClient.get(`${this.baseUrl}/search`, { headers: this.headers, params }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

}