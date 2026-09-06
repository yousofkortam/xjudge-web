/**
 * Local development settings.
 *
 * `apiUrl` must match the port the Spring backend is actually bound to. The
 * backend reads it from `PORT` (see X-Judge/src/main/resources/env.properties,
 * which sets 9090; the built-in fallback in application.properties is 7070).
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9090',
};
