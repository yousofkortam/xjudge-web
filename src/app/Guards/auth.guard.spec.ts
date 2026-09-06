import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ProtectedAuthGuard } from './auth.guard';
import { AuthService } from '../ApiServices/auth.service';

describe('ProtectedAuthGuard', () => {
  let guard: ProtectedAuthGuard;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    guard = TestBed.inject(ProtectedAuthGuard);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => localStorage.clear());

  const state = (url: string) => ({ url } as RouterStateSnapshot);

  it('lets a signed-in user through', () => {
    auth.setSession(makeJwt('someone', Date.now() / 1000 + 3600));
    expect(guard.canActivate({} as any, state('/changePassword'))).toBe(true);
  });

  it('redirects a signed-out visitor to /login and remembers where they were going', () => {
    const result = guard.canActivate({} as any, state('/changePassword'));
    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
    expect(router.serializeUrl(tree)).toContain('returnUrl=%2FchangePassword');
  });

  it('returns a UrlTree rather than navigating, so no second navigation races the first', () => {
    const navigate = spyOn(router, 'navigate');
    guard.canActivate({} as any, state('/changePassword'));
    expect(navigate).not.toHaveBeenCalled();
  });
});

/** Builds a syntactically valid JWT with the given subject and expiry. */
export function makeJwt(sub: string, exp: number): string {
  const b64 = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64({ alg: 'HS256' })}.${b64({ sub, exp })}.signature`;
}
