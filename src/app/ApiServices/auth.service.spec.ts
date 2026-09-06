import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../environment/environment';

function makeJwt(sub: string, exp: number): string {
  const b64 = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64({ alg: 'HS256' })}.${b64({ sub, exp })}.signature`;
}

const future = () => Date.now() / 1000 + 3600;
const past = () => Date.now() / 1000 - 3600;

describe('AuthService', () => {
  const build = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    return TestBed.inject(AuthService);
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  describe('restoring a session at construction', () => {
    // This is the regression that used to blank the whole application: the
    // constructor threw out of the DI factory, so no component ever rendered.
    const badTokens = ['undefined', 'null', '', 'not-a-jwt', 'eyJhbGciOiJIUzI1NiJ9', '{}'];

    badTokens.forEach(token => {
      it(`does not throw for a stored token of ${JSON.stringify(token)}`, () => {
        localStorage.setItem('userToken', token);
        let service!: AuthService;
        expect(() => { service = build(); }).not.toThrow();
        expect(service.isLogin()).toBe(false);
      });

      it(`clears the unusable token ${JSON.stringify(token)} instead of keeping it`, () => {
        localStorage.setItem('userToken', token);
        build();
        expect(localStorage.getItem('userToken')).toBeNull();
      });
    });

    it('restores a valid, unexpired token', () => {
      localStorage.setItem('userToken', makeJwt('kortam', future()));
      const service = build();
      expect(service.isLogin()).toBe(true);
      expect(service.getUserHandle()).toBe('kortam');
    });

    it('discards an expired token', () => {
      localStorage.setItem('userToken', makeJwt('kortam', past()));
      const service = build();
      expect(service.isLogin()).toBe(false);
      expect(localStorage.getItem('userToken')).toBeNull();
    });
  });

  describe('setSession', () => {
    it('rejects a non-JWT value rather than storing it', () => {
      const service = build();
      // `undefined` is what the login page used to write when it read the token
      // off the envelope instead of its `data` payload.
      expect(service.setSession(undefined)).toBe(false);
      expect(localStorage.getItem('userToken')).toBeNull();
      expect(service.isLogin()).toBe(false);
    });

    it('rejects an already-expired token', () => {
      const service = build();
      expect(service.setSession(makeJwt('kortam', past()))).toBe(false);
      expect(service.isLogin()).toBe(false);
    });

    it('stores a valid token and publishes the session', () => {
      const service = build();
      const seen: (string | null)[] = [];
      service.userData.subscribe(s => seen.push(s?.sub ?? null));

      expect(service.setSession(makeJwt('kortam', future()))).toBe(true);
      expect(service.getUserHandle()).toBe('kortam');
      expect(seen).toEqual([null, 'kortam']);
    });
  });

  it('getUserToken only returns well-formed tokens', () => {
    const service = build();
    localStorage.setItem('userToken', 'undefined');
    expect(service.getUserToken()).toBeNull();

    const token = makeJwt('kortam', future());
    localStorage.setItem('userToken', token);
    expect(service.getUserToken()).toBe(token);
  });

  it('posts login to the configured API base URL', () => {
    const service = build();
    const http = TestBed.inject(HttpTestingController);
    service.login({ userHandle: 'a', userPassword: 'b' }).subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({});
    http.verify();
  });
});
