import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = environment.apiUrl + '/user';

  headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  constructor(private _HttpClient: HttpClient) { }

  getUserDetails(handle: string, email:string): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}/${handle}`,
      { headers: this.headers }
    );
  }

  updateUser(data: any) {
    return this._HttpClient.put(
      `${this.baseUrl}`,
      data,
      { headers: this.headers }
    );
  }
  
}
