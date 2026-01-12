# PHASE 6: OPERATIONAL HARDENING (LOGS, VALIDATION, ERRORS)
# ACT AS: Senior Solutions Architect.

The "Happy Path" is built. Now we must implement the "Sad Path" handling and Observability.
Refer to Rules 10 (Validation), 15 (Logging), and 23 (API Contracts).

# 1. BACKEND HARDENING (NestJS)

A. STRUCTURED LOGGING (Rule 15)
   - Install `nestjs-pino` and `pino-http`.
   - Replace the default NestJS Logger with Pino.
   - **Configuration:**
     - In Dev: Pretty print (for readability).
     - In Prod: Single-line JSON (for ingestion).
     - **Context:** Every log must automatically include the `traceId` (from request headers).

B. GLOBAL VALIDATION (Rule 10)
   - Enable the global `ValidationPipe` in `main.ts`.
   - **Settings:** `whitelist: true` (Strip unknown properties), `forbidNonWhitelisted: true` (Throw error on extra props).
   - **Transformation:** `transform: true` (Auto-convert types, e.g., string "123" -> number 123).

C. GLOBAL EXCEPTION FILTER (Rule 23)
   - Create an `AllExceptionsFilter` that catches EVERYTHING (HttpException, TypeORM errors, Crashes).
   - **Output:** It must strictly return the Standard Envelope:
     ```json
     {
       "data": null,
       "meta": { "timestamp": "...", "traceId": "..." },
       "error": { "code": "...", "message": "..." }
     }
     ```

D. RESPONSE INTERCEPTOR
   - Create a `TransformInterceptor` to wrap all SUCCESSFUL responses in the same envelope:
     ```json
     {
       "data": <TheControllerResult>,
       "meta": { "timestamp": "...", "traceId": "..." },
       "error": null
     }
     ```

# 2. FRONTEND ROBUSTNESS (React Shell)

A. AXIOS INTERCEPTOR
   - Update the HTTP Client in `libs/shared/utils`.
   - **Response Interceptor:**
     - Check for `401 Unauthorized` responses.
     - Action: Clear local storage and forcibly redirect to `/login`.
     - **Toast Integration:** Use the `ToastService` (Phase 4) to show "Session Expired."

B. QUERY CLIENT DEFAULTS
   - Configure `TanStack Query` (Rule 17) in the Shell.
   - **Retry Policy:** Do NOT retry on 400/401/403 errors (they won't fix themselves).
   - **Refetch:** Disable `refetchOnWindowFocus` for development sanity.

# 3. EXECUTION STEPS

Generate the code to:
1.  Install Pino and configure the LoggerModule in `app.module.ts`.
2.  Implement the `AllExceptionsFilter` and `TransformInterceptor`.
3.  Register the Global Pipes and Filters in `main.ts`.
4.  Update the Frontend Axios instance with the 401 Interceptor.
5.  **Verification:** Provide a `curl` command to send a BAD request (invalid JSON) to the User API, demonstrating the new Validation Pipe and JSON Error format.