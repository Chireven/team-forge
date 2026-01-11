---
trigger: always_on
---

## ⏳ Core Scheduler & Job Queue Rules

### 1. Centralized Job Orchestration

1.  **No Local Timers:** Plugins are **strictly prohibited** from using native timers like `setInterval`, `setTimeout` (for logic > 1s), or `node-cron` internally.
2.  **Registration Pattern:** Plugins must register their recurring tasks or background jobs with the **Core Scheduler Service** upon initialization.
    * *Requirement:* Plugins must provide a `JobDefinition` containing the `cronExpression`, `jobName`, and the `handler` reference.
3.  **Persistence Mandate:** The Scheduler must use a **persistent backing store** (e.g., Redis via BullMQ) to ensure jobs are not lost during server restarts or crashes.

### 2. Execution & Reliability

1.  **Concurrency Control:** The Core Scheduler is the sole authority on concurrency. It must limit how many heavy jobs run simultaneously to prevent event loop blocking.
2.  **Retry Policies:** All registered jobs **must define a Retry Strategy** (e.g., "Exponential Backoff", max 3 attempts). Jobs that fail permanently must be moved to a **Dead Letter Queue (DLQ)** for manual inspection.
3.  **Isolation:** Job execution must be wrapped in a `try/catch` block or Sandbox. A crashing job must not crash the entire Application Server.