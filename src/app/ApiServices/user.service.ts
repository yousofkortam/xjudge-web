import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = environment.apiUrl + '/user';

  headers: any;
  constructor(private _HttpClient: HttpClient) {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      this.headers = new HttpHeaders();
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('userToken') != null;
  }

  getUserDetails(handle: string, email: string): Observable<any> {
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

  getUserInvitations(): Observable<any> {
    return this._HttpClient.get(
      `http://localhost:7070/user/invitations`,
      { headers: this.headers }
    );
  }

  acceptInvitation(invitationId: number): Observable<any> {
    return this._HttpClient.post(
      `http://localhost:7070/group/accept-invitation/${invitationId}`,
      {},
      { headers: this.headers }
    );
  }

  declineInvitation(invitationId: number): Observable<any> {
    return this._HttpClient.post(
      `http://localhost:7070/group/decline-invitation/${invitationId}`,
      {},
      { headers: this.headers }
    );
  }

}
