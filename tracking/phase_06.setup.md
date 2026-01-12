# Phase 6: Operational Hardening Setup

This phase focused on reliability, observability, and error handling.

## 1. Dependencies Installed

### Backend (`api-gateway`)
```bash
npm install nestjs-pino pino-http class-validator class-transformer
npm install -D pino-pretty
```

### Frontend (`shell`)
```bash
npm install @tanstack/react-query
```

## 2. Configuration Changes

### Backend
1.  **Logging**: Switched from NestJS default logger to `nestjs-pino`.
    -   **Dev**: Prettified logs.
    -   **Prod**: Single-line JSON with `traceId`.
2.  **Validation**: Enabled Global `ValidationPipe`.
    -   `whitelist: true`: Strips unknown properties.
    -   `forbidNonWhitelisted: true`: Throws 400 if unknown properties exist.
3.  **Interceptors**:
    -   `AllExceptionsFilter`: Catches ALL errors and returns `{ error: { code, message }, meta: ... }`.
    -   `TransformInterceptor`: Wraps ALL successes in `{ data: ..., meta: ... }`.
    -   **Location**: Moved to `apps/api-gateway/src/app/common` to avoid shared library circular deps.

### Frontend
1.  **Axios**:
    -   Added global interceptor in `AuthLoader`.
    -   Automatically redirects to `/login` on `401 Unauthorized`.
2.  **TanStack Query**:
    -   Configured global `QueryClient`.
    -   Disabled retries on 4xx errors (Client Errors).

## 3. Verification
Run the following curl command to test the Validation Pipe and Error Envelope:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"bad-email\", \"password\": \"123\"}"
```
