import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';

export interface SessionUser {
  /** JWT subject — the user handle. */
  sub: string;
  /** Expiry, seconds since epoch. */
  exp?: number;
  iat?: number;
  [claim: string]: unknown;
}

const TOKEN_KEY = 'userToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl: string = environment.apiUrl + '/auth';

  /**
   * Current session, or null when signed out. Read it with the `async` pipe or
   * `userData.value`; it never emits a half-decoded token.
   */
  readonly userData = new BehaviorSubject<SessionUser | null>(null);

  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router) {
    // Restoring a session must never be able to abort bootstrap: a token left
    // behind by an older build (or a failed login that stored "undefined") is
    // discarded rather than thrown, otherwise every root-injected consumer of
    // this service takes the exception down with it and the app renders nothing.
    this.restoreSession();
  }

  // --- session state -------------------------------------------------------

  getUserToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return isWellFormedJwt(token) ? token : null;
  }

  isLogin(): boolean {
    return this.userData.value !== null;
  }

  getUserHandle(): string {
    return this.userData.value?.sub ?? '';
  }

  /** Stores a freshly issued token and publishes the decoded session. */
  setSession(token: unknown): boolean {
    if (!isWellFormedJwt(token)) {
      this.clearSession();
      return false;
    }
    const claims = safeDecode(token);
    if (!claims || isExpired(claims)) {
      this.clearSession();
      return false;
    }
    localStorage.setItem(TOKEN_KEY, token);
    this.userData.next(claims);
    return true;
  }

  /** Drops local session state without navigating. Safe to call at any time. */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    if (this.userData.value !== null) this.userData.next(null);
  }

  logOut(): void {
    this.clearSession();
    void this._Router.navigate(['/login']);
  }

  /**
   * Re-reads the stored token. Returns the decoded session, or null when there
   * is no usable token — expired and malformed tokens are cleared on the way out.
   */
  private restoreSession(): SessionUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!isWellFormedJwt(token)) {
      // Covers null, "undefined", "null", and opaque/legacy values.
      if (token !== null) localStorage.removeItem(TOKEN_KEY);
      if (this.userData.value !== null) this.userData.next(null);
      return null;
    }
    const claims = safeDecode(token);
    if (!claims || isExpired(claims)) {
      this.clearSession();
      return null;
    }
    if (this.userData.value?.sub !== claims.sub) this.userData.next(claims);
    return claims;
  }

  /** Kept for callers that want to force a re-read after writing the token. */
  decodeUserData(): SessionUser | null {
    return this.restoreSession();
  }

  // --- endpoints -----------------------------------------------------------

  register(userData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/register`, userData);
  }

  login(userData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/login`, userData);
  }

  forgetPassword(requestBody: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/forget-password`, requestBody);
  }

  resetPassword(requestBody: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/reset-password`, requestBody);
  }

  changePassword(userData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/change-password`, userData);
  }
}

// --- token helpers ---------------------------------------------------------

/** True only for a three-segment, non-empty JWT. */
function isWellFormedJwt(token: unknown): token is string {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
}

/** jwt-decode throws on anything it dislikes; callers here want null instead. */
function safeDecode(token: string): SessionUser | null {
  try {
    const claims = jwtDecode<SessionUser>(token);
    return claims && typeof claims === 'object' && typeof claims.sub === 'string' ? claims : null;
  } catch {
    return null;
  }
}

function isExpired(claims: SessionUser): boolean {
  return typeof claims.exp === 'number' && claims.exp * 1000 <= Date.now();
}
