import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userUrl = environment.apiUrl + '/user';
  private readonly groupUrl = environment.apiUrl + '/group';

  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService) {}

  isAuthenticated(): boolean {
    return this._AuthService.isLogin();
  }

  getUserDetails(handle: string): Observable<any> {
    return this._HttpClient.get(`${this.userUrl}/${encodeURIComponent(handle)}`);
  }

  updateUser(data: any): Observable<any> {
    return this._HttpClient.put(`${this.userUrl}`, data);
  }

  updateProfilePicture(file: FormData): Observable<any> {
    return this._HttpClient.put(`${this.userUrl}/profile-picture`, file);
  }

  getUserInvitations(): Observable<any> {
    return this._HttpClient.get(`${this.userUrl}/invitations`);
  }

  acceptInvitation(invitationId: number): Observable<any> {
    return this._HttpClient.post(`${this.groupUrl}/accept-invitation/${invitationId}`, {});
  }

  declineInvitation(invitationId: number): Observable<any> {
    return this._HttpClient.post(`${this.groupUrl}/decline-invitation/${invitationId}`, {});
  }
}
