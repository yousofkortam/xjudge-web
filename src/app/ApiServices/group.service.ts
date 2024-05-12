import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class GroupService {
  
headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
constructor(private _HttpClient: HttpClient) { }
  
  

  getSpecificGroup(GroupId: number): Observable<any> {
    return this._HttpClient.get( `http://localhost:7070/group/${GroupId}`, { headers: this.headers }
    );
  };

  deleteSpecificGroup(GroupId: number): Observable<any> {
    return this._HttpClient.delete( `http://localhost:7070/group/${GroupId}`, { headers: this.headers }
    );
  };

  createGroup(groupData: any): Observable<any> {
    return this._HttpClient.post('http://localhost:7070/group', groupData, { headers: this.headers });
  }


  getGroupsByUserHandle(pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/group/userHandle?pageNo=${pageNo}&size=${size}`, { headers: this.headers });
  }
  
  getAllGroups(pageNo: number, size: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7070/group/public?pageNo=${pageNo}&size=${size}`, { headers: this.headers });
  }


  getGroupsAwnedByUser(): Observable<any> {
    return this._HttpClient.get( `http://localhost:7070/group/owned`, { headers: this.headers }
    );
  }

}
