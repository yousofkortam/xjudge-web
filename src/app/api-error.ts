import { HttpErrorResponse } from '@angular/common/http';

/**
 * Normalized shape the whole app can rely on, regardless of which of the
 * backend's error envelopes produced it.
 *
 * The Spring backend answers failures with
 *   { success: false, message: null, data: null,
 *     error: { code, message, timeStamp, desc, validations: { field: msg } } }
 * but Spring Security's `sendError(401)` and Boot's default handler answer with
 *   { timestamp, status, error, path }
 * and a dead/unreachable server produces no body at all.
 */
export interface ApiError {
  /** HTTP status, or 0 when the request never reached the server. */
  status: number;
  /** Message safe to show a user. Never empty. */
  message: string;
  /** Field-level validation failures, keyed by form control name. */
  validations: Record<string, string>;
}

const STATUS_MESSAGES: Record<number, string> = {
  0: 'Cannot reach the X-Judge server. Check that the backend is running and try again.',
  400: 'The request was rejected. Please check the values you entered.',
  401: 'Your session has expired. Please sign in again.',
  403: "You don't have permission to do that.",
  404: 'We could not find what you were looking for.',
  409: 'That conflicts with something that already exists.',
  422: 'Some of the submitted values are not valid.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'The server ran into a problem. Please try again shortly.',
  502: 'The server is temporarily unavailable. Please try again shortly.',
  503: 'The server is temporarily unavailable. Please try again shortly.',
  504: 'The server took too long to respond. Please try again.',
};

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

/** Pulls the most specific human-readable message available out of an error. */
export function apiErrorMessage(error: unknown): string {
  if (typeof error === 'string' && error.trim()) return error.trim();

  // rxjs `timeout()` rejects with a TimeoutError rather than an HTTP response.
  if (isRecord(error) && error['name'] === 'TimeoutError') {
    return 'The server took too long to respond. Please try again.';
  }

  if (error instanceof HttpErrorResponse || (isRecord(error) && 'status' in error)) {
    const status: number = Number((error as any).status) || 0;
    const body = (error as any).error;

    if (typeof body === 'string' && body.trim() && !body.trim().startsWith('<')) {
      return body.trim();
    }
    if (isRecord(body)) {
      const nested = isRecord(body['error']) ? body['error'] : null;
      const candidate =
        (nested && typeof nested['message'] === 'string' && nested['message']) ||
        (typeof body['message'] === 'string' && body['message']) ||
        (typeof body['detail'] === 'string' && body['detail']) ||
        // Boot's default body puts the reason phrase in `error`.
        (typeof body['error'] === 'string' && body['error']);
      if (candidate && candidate.trim()) return candidate.trim();
    }
    return STATUS_MESSAGES[status] ?? `Request failed with status ${status || 'unknown'}.`;
  }

  if (isRecord(error) && typeof error['message'] === 'string' && error['message'].trim()) {
    return error['message'].trim();
  }
  return 'Something went wrong. Please try again.';
}

/** Extracts per-field validation messages so forms can highlight the right input. */
export function apiValidationErrors(error: unknown): Record<string, string> {
  const body = isRecord(error) ? (error as any).error : null;
  if (!isRecord(body)) return {};
  const nested = isRecord(body['error']) ? body['error'] : null;
  const raw = (nested && nested['validations']) ?? body['validations'];
  if (!isRecord(raw)) return {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(raw)) {
    const value = (raw as Record<string, unknown>)[key];
    if (typeof value === 'string' && value) out[key] = value;
  }
  return out;
}

/** Convenience wrapper used by components that just want to render an error block. */
export function toApiError(error: unknown): ApiError {
  return {
    status: isRecord(error) ? Number((error as any).status) || 0 : 0,
    message: apiErrorMessage(error),
    validations: apiValidationErrors(error),
  };
}
