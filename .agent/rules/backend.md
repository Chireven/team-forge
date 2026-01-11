---
trigger: always_on
---

# Backend Guidelines: NestJS

When generating backend code for Team Forge, strict adherence to the following NestJS patterns is required:

1.  **Module Isolation:**
    * Every major feature must be its own `@Module`.
    * The `AppModule` (Shell) should only import feature modules; it should not contain business logic.

2.  **Explicit Contracts (DTOs):**
    * All data crossing module boundaries must be defined by strict DTOs (Data Transfer Objects) using `class-validator`.
    * Never pass raw database entities between the Shell and Plugins.

3.  **Communication Strategy:**
    * **Synchronous:** Use Services exported by modules *only* if tightly coupled.
    * **Asynchronous (Preferred):** Use NestJS Events (`EventEmitter2`) for cross-module triggers (e.g., "UserCreated" -> "InventoryProvisioned").

4.  **Configuration:**
    * Use `@nestjs/config` for all environment variables. Plugins must accept configuration from the Shell, not hardcode values.