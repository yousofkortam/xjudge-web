import { Injectable, isDevMode } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environment/environment';
import { apiErrorMessage, apiValidationErrors } from '../api-error';

/** Requests that take longer than this are treated as failed rather than hanging forever. */
const REQUEST_TIMEOUT_MS = 120_000;

/**
 * Single place where every backend call gets its auth header, has the Spring
 * `Response` envelope unwrapped, and has its failure turned into a predictable
 * shape. Registered in AppModule.
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Leave asset requests and third-party calls untouched.
    if (!isApiRequest(request.url)) return next.handle(request);

    // Read the token per request: services are root singletons created before
    // the user signs in, so a header captured at construction time is stale.
    const token = this.auth.getUserToken();
    let headers = request.headers.delete('Authorization');
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return next.handle(request.clone({ headers })).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      map(event => {
        // Controllers return `{success, message, data, error}` for most routes
        // but raw `Page<T>` / primitives for others. Unwrap only the envelope.
        if (event instanceof HttpResponse && isEnvelope(event.body)) {
          return event.clone({ body: event.body.data });
        }
        return event;
      }),
      catchError((error: unknown) => {
        const status = (error as HttpErrorResponse)?.status ?? 0;

        // Only sign out when the token we actually sent was rejected, and only
        // if it is still the current one — a slow 401 must not clobber a session
        // established while the request was in flight.
        if (status === 401 && token && this.auth.getUserToken() === token) {
          this.auth.clearSession();
          if (!this.router.url.startsWith('/login')) {
            void this.router.navigate(['/login'], {
              queryParams: { returnUrl: this.router.url, session: 'expired' },
            });
          }
        }

        if (isDevMode()) {
          console.debug('[XJudge API]', request.method, request.url.split('?')[0], '→', status || (error as any)?.name);
        }

        const body = (error as HttpErrorResponse)?.error;
        return throwError(() => new HttpErrorResponse({
          status,
          statusText: (error as HttpErrorResponse)?.statusText ?? 'Request failed',
          url: (error as HttpErrorResponse)?.url ?? request.url,
          error: {
            ...(body && typeof body === 'object' && !Array.isArray(body) ? body : {}),
            message: apiErrorMessage(error),
            validations: apiValidationErrors(error),
          },
        }));
      })
    );
  }
}

/**
 * `apiUrl` is an absolute origin in development and empty (same-origin) in
 * production, so both forms have to be recognised — without swallowing the
 * asset requests that share the origin in the same-origin case.
 */
function isApiRequest(url: string): boolean {
  if (environment.apiUrl) return url.startsWith(environment.apiUrl);
  return url.startsWith('/') && !url.startsWith('/assets/');
}

function isEnvelope(body: unknown): body is { success: boolean; data: unknown } {
  return (
    typeof body === 'object' && body !== null &&
    'success' in body && (body as any).success === true &&
    'data' in body
  );
}
