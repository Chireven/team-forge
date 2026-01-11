---
trigger: always_on
---

# Security & Data Integrity Protocol

**ZERO-TRUST STORAGE POLICY:**
Under no circumstances shall sensitive data, credentials, secrets, or production configuration be saved, hardcoded, or commented into the project source code or directory structure.

1.  **Strict Environment Variable Usage:**
    * All credentials (API keys, DB connection strings, secrets, tokens) must be injected via Environment Variables (`process.env` in Node/React).
    * Development values must live in a local `.env` file that is **never** committed.
    * The assistant must verify that `.env` is included in the `.gitignore` file immediately upon project initialization.

2.  **No "Temporary" Hardcoding:**
    * Do not write "placeholder" secrets in code (e.g., `const API_KEY = "12345"`), even for debugging.
    * Use empty strings or throw errors if the environment variable is missing: 
        `const apiKey = process.env.API_KEY || throw new Error("API_KEY missing");`

3.  **Data Persistence Rules:**
    * The application should be stateless where possible.
    * Any file uploads or generated data should be directed to a temporary directory explicitly excluded from version control (e.g., `/tmp` or a git-ignored `/uploads` folder), or preferably sent directly to cloud storage (S3/Azure Blob).
    * No logs shall contain PII (Personally Identifiable Information) or authentication tokens.