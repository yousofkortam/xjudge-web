import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ApiInterceptor } from './api.interceptor';
import { AuthService } from './auth.service';
import { environment } from '../environment/environment';

function makeJwt(sub: string, exp: number): string {
  const b64 = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64({ alg: 'HS256' })}.${b64({ sub, exp })}.signature`;
}
const validToken = () => makeJwt('kortam', Date.now() / 1000 + 3600);

describe('ApiInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    backend.verify();
    localStorage.clear();
  });

  it('unwraps the {success, data} envelope the Spring controllers return', () => {
    let body: any;
    http.get(`${environment.apiUrl}/problem`).subscribe(res => (body = res));
    backend.expectOne(`${environment.apiUrl}/problem`)
      .flush({ success: true, message: null, data: { content: [1, 2], totalElements: 2 }, error: null });
    expect(body).toEqual({ content: [1, 2], totalElements: 2 });
  });

  it('passes through a raw body that is not an envelope', () => {
    let body: any;
    http.get(`${environment.apiUrl}/online-judge`).subscribe(res => (body = res));
    backend.expectOne(`${environment.apiUrl}/online-judge`).flush(['codeforces', 'atcoder']);
    expect(body).toEqual(['codeforces', 'atcoder']);
  });

  it('does not unwrap a failed envelope', () => {
    let body: any;
    http.get(`${environment.apiUrl}/thing`).subscribe(res => (body = res));
    backend.expectOne(`${environment.apiUrl}/thing`).flush({ success: false, data: null });
    expect(body).toEqual({ success: false, data: null });
  });

  it('attaches the current token, not one captured at construction time', () => {
    // Services are root singletons built before sign-in; this is why the old
    // per-service `headers` field always sent an empty Authorization header.
    http.get(`${environment.apiUrl}/problem`).subscribe();
    expect(backend.expectOne(`${environment.apiUrl}/problem`).request.headers.has('Authorization')).toBe(false);

    const token = validToken();
    auth.setSession(token);

    http.get(`${environment.apiUrl}/problem`).subscribe();
    expect(backend.expectOne(`${environment.apiUrl}/problem`).request.headers.get('Authorization'))
      .toBe(`Bearer ${token}`);
  });

  it('leaves non-API requests untouched', () => {
    http.get('/assets/images/logo.jpg', { responseType: 'text' }).subscribe();
    const req = backend.expectOne('/assets/images/logo.jpg');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush('');
  });

  it('normalizes an error body into a message plus validations', () => {
    let error!: HttpErrorResponse;
    http.post(`${environment.apiUrl}/auth/login`, {}).subscribe({ error: e => (error = e) });
    backend.expectOne(`${environment.apiUrl}/auth/login`).flush(
      { success: false, error: { code: 401, message: 'Username or password is incorrect', validations: { userHandle: 'required' } } },
      { status: 401, statusText: 'Unauthorized' });

    expect(error.error.message).toBe('Username or password is incorrect');
    expect(error.error.validations).toEqual({ userHandle: 'required' });
  });

  it('supplies a readable message when the server sends no body', () => {
    let error!: HttpErrorResponse;
    http.get(`${environment.apiUrl}/problem`).subscribe({ error: e => (error = e) });
    backend.expectOne(`${environment.apiUrl}/problem`).flush(null, { status: 500, statusText: 'Server Error' });
    expect(error.error.message).toContain('server ran into a problem');
  });

  it('clears the session and redirects when a request made WITH a token is refused', () => {
    const navigate = spyOn(router, 'navigate');
    auth.setSession(validToken());

    http.get(`${environment.apiUrl}/problem`).subscribe({ error: () => {} });
    backend.expectOne(`${environment.apiUrl}/problem`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(auth.isLogin()).toBe(false);
    expect(navigate).toHaveBeenCalled();
    expect(navigate.calls.mostRecent().args[0]).toEqual(['/login']);
  });

  it('does not redirect a signed-out visitor whose request was refused', () => {
    // Endpoints such as /problem require a session; a visitor browsing without
    // one should see an inline prompt, not be bounced into a redirect.
    const navigate = spyOn(router, 'navigate');
    http.get(`${environment.apiUrl}/problem`).subscribe({ error: () => {} });
    backend.expectOne(`${environment.apiUrl}/problem`).flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(navigate).not.toHaveBeenCalled();
  });
});
