import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})

export class GroupService {

  baseUrl: string = environment.apiUrl + '/group';

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) {}

  isAuthenticated() {
    return this._AuthService.isLogin();
  }

  getSpecificGroup(GroupId: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${GroupId}`
    );
  };

  deleteSpecificGroup(GroupId: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${GroupId}`
    );
  };

  createGroup(groupData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}`, groupData);
  }

  updateGroup(groupId: number, groupData: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${groupId}`, groupData);
  }

  getGroupsByUserHandle(pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/userHandle?pageNo=${pageNo}&size=${size}`);
  }

  getAllGroups(pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/public?pageNo=${pageNo}&size=${size}`);
  }

  getGroupsAwnedByUser(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/owned`
    );
  }

  getGroupMembers(groupId: number, pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${groupId}/members?pageNo=${pageNo}&size=${size}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getGroupContests(groupId: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${groupId}/contests`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  joinGroup(groupId: number): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/${groupId}/join`, null).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  leaveGroup(groupId: number): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/${groupId}/leave`, null).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  inviteUser(request: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/invite`, request).pipe(
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
    return this._HttpClient.get(`${this.baseUrl}/search`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

}