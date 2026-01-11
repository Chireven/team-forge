---
trigger: always_on
---


## Event Hub (Publish/Subscribe) Rules

The Event Hub must be the authoritative source for all decoupled, asynchronous application state communication.

### 1. Architectural Core and Naming

1.  **Strict Naming Standard:** All event names **must strictly adhere to the `NOUN:VERB` convention** (e.g., `TASK:CREATED`, `USER:LOGGED_OUT`). Event names must be descriptive and placed in a centralized Event Registry (similar to the Permission Registry) for discoverability.
2.  **Mandatory Event Versioning:** Every event defined in the centralized registry **must include an explicit version number** (e.g., `1.0`). When a breaking change is made to an event's payload, the event name or version must be incremented (e.g., `USER:UPDATED_V2`). Listeners **must explicitly declare the event version they consume**.
3.  **Required Metadata:** The underlying `eventBus` **must automatically stamp** all emitted events with a UTC `timestamp` and metadata identifying the `source` (e.g., component path, API endpoint) before notifying subscribers.
4.  **Payload Design:** Event payloads must be **serializable JSON objects** and should only contain the minimum necessary data required for downstream listeners to act.

### 2. Emission and Subscription Discipline

1.  **UI Emission Standard:** All DOM-based event emissions **must exclusively use the declarative `data-emit-event` and `data-emit-payload` attributes**. Direct emission via inline DOM event handlers is prohibited.
2.  **Mandatory Cleanup (No Leaks):** Every subscription created via `eventBus.on(event, handler)` **must be paired with a corresponding cleanup function** that calls `eventBus.off(event, handler)` upon component unmount or service teardown.
3.  **Throttling/Debouncing Requirement:** The `eventBus` API **must expose built-in `throttle` and `debounce` emission utilities**. Any component emitting a high-frequency event (defined as more than 5 times per second) **must use these utilities** to rate-limit emissions.
4.  **Asynchronous Execution:** Listeners **must not block the main application thread** and should handle heavy processing, I/O, or non-essential visual effects (e.g., animations) using asynchronous mechanisms to preserve UI responsiveness.

### 3. Reliability, Isolation, and Observability

1.  **Isolated Failure:** The event bus mechanism **must ensure that a failure in one subscriber handler does not prevent the event from being delivered to other subscribers**. Listeners must isolate their logic within robust `try/catch` blocks.
2.  **Permission Gates:** Any listener that triggers sensitive or controlled effects (e.g., audio playback, user notifications) **must first validate the action against the RBAC system or an explicit feature gate**.
3.  **Event Tracing:** The Event Bus **must integrate with the application's global tracing mechanism** (e.g., OpenTelemetry, tracing headers). Every `emit` call must generate a new trace ID or span, and this ID **must be included in the event payload metadata**. All listeners must log the received event with this same trace ID for end-to-end debugging.
4.  **Gatekeeper Priority:** The Event Gatekeeper component **must be mounted globally** in the root layout to ensure that declarative emissions are active across the entire application before any other component mounts.