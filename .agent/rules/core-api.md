---
trigger: always_on
---

## 📜 API Governance & Documentation Standards

### 1. The "OpenAPI" Mandate

1.  **Automatic Generation:** All Backend Controllers **must be decorated** with NestJS Swagger decorators (`@ApiOperation`, `@ApiResponse`, `@ApiProperty`).
2.  **Live Documentation:** The application must serve a live **Swagger UI** (at `/api/docs`) that aggregates the endpoints of the Shell and **all active Plugins**.
3.  **DTO Visibility:** All Request/Response DTOs must be exposed in the Swagger schema. Using `any` or raw objects in Controller signatures is prohibited because they hide the API contract from consumers.

### 2. Response Standardization

1.  **Standard Envelope:** All API responses (Success or Error) **must adhere to a strict JSON Envelope format**:
    ```json
    {
      "data": <Payload>,
      "meta": { "timestamp": "...", "traceId": "..." },
      "error": null
    }
    ```
2.  **Versioning:** Public API routes must be versioned (e.g., `/api/v1/resource`). Breaking changes require a version increment; overriding an existing version with breaking changes is prohibited.