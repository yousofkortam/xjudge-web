import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage, apiValidationErrors, toApiError } from './api-error';

describe('apiErrorMessage', () => {
  it('prefers the backend envelope message', () => {
    const err = new HttpErrorResponse({
      status: 401,
      error: { success: false, error: { code: 401, message: 'Username or password is incorrect' } },
    });
    expect(apiErrorMessage(err)).toBe('Username or password is incorrect');
  });

  it('falls back to a top-level message', () => {
    const err = new HttpErrorResponse({ status: 400, error: { message: 'Malformed JSON request body' } });
    expect(apiErrorMessage(err)).toBe('Malformed JSON request body');
  });

  it('explains an unreachable server rather than showing status 0', () => {
    expect(apiErrorMessage(new HttpErrorResponse({ status: 0 }))).toContain('Cannot reach');
  });

  it('maps bare status codes to readable text', () => {
    expect(apiErrorMessage(new HttpErrorResponse({ status: 403 }))).toContain("don't have permission");
    expect(apiErrorMessage(new HttpErrorResponse({ status: 404 }))).toContain('could not find');
    expect(apiErrorMessage(new HttpErrorResponse({ status: 409 }))).toContain('already exists');
  });

  it('handles an rxjs timeout', () => {
    expect(apiErrorMessage({ name: 'TimeoutError', message: 'Timeout has occurred' })).toContain('took too long');
  });

  it('never returns an empty string', () => {
    expect(apiErrorMessage(null).length).toBeGreaterThan(0);
    expect(apiErrorMessage(undefined).length).toBeGreaterThan(0);
    expect(apiErrorMessage({}).length).toBeGreaterThan(0);
  });

  it('ignores an HTML error page instead of dumping markup at the user', () => {
    const err = new HttpErrorResponse({ status: 500, error: '<!doctype html><html>...' });
    expect(apiErrorMessage(err)).not.toContain('<');
  });
});

describe('apiValidationErrors', () => {
  it('reads the nested validations map', () => {
    const err = new HttpErrorResponse({
      status: 400,
      error: { error: { validations: { userHandle: 'user handle is mandatory', userEmail: 'please enter valid email' } } },
    });
    expect(apiValidationErrors(err)).toEqual({
      userHandle: 'user handle is mandatory',
      userEmail: 'please enter valid email',
    });
  });

  it('reads a flat validations map', () => {
    const err = new HttpErrorResponse({ status: 400, error: { validations: { title: 'required' } } });
    expect(apiValidationErrors(err)).toEqual({ title: 'required' });
  });

  it('returns an empty object when there is nothing to report', () => {
    expect(apiValidationErrors(new HttpErrorResponse({ status: 500 }))).toEqual({});
    expect(apiValidationErrors(null)).toEqual({});
  });
});

describe('toApiError', () => {
  it('always produces a complete, renderable shape', () => {
    const result = toApiError(new HttpErrorResponse({ status: 422, error: { message: 'nope' } }));
    expect(result).toEqual({ status: 422, message: 'nope', validations: {} });
  });
});
