---
trigger: always_on
---


## Logging and Observability Rules

### 1. Format and Structure

1.  **Structured Logging Mandate:** All application logs (client and server) **must use a JSON-based, structured format**. Plain text log messages are prohibited in production.
2.  **Mandatory Context Fields:** Every log entry **must include the following contextual identifiers**: `userId`, `sessionId`, and **`traceId`**.
3.  **Mandatory Metadata Fields:** Every log entry **must include the following mandatory context fields**: `timestamp`, `logLevel`, `serviceName`, and `component` (e.g., component name or function name).

### 2. Security and Data Hygiene

1.  **Security Data Scrubbing:** Logging of sensitive PII or secrets (e.g., passwords, API keys) **is strictly prohibited**. Data must be scrubbed, hashed, or tokenized before being written to the log store.
2.  **Log Level Discipline:** The use of `ERROR` and `FATAL` log levels **must be strictly reserved for unhandled exceptions or critical system failures**.
3.  **Client Error Handling:** Client-side error logging **must automatically include the user's current route** and any available browser or device metadata to aid in reproduction.

### 3. Log Storage and Retention

1.  **Centralized Storage:** All application logs **must be streamed to a single, centralized log aggregation system** for unified analysis and monitoring.
2.  **Retention Policy:** A clear **data retention policy must be enforced**. Logs containing user-specific data must be retained for no longer than **90 days**, while security and audit logs (containing no PII) may be retained as required by compliance standards.