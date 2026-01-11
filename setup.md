# Team Forge V2 - Setup Guide

## ✅ Confirmation: Rule Files Analyzed

I have analyzed and stored all **25 Rule Files** that govern the Team Forge V2 project:

### Core Architecture & Structure
- ✅ `architecture.md` - Shell & Plugin architecture
- ✅ `project-structure.md` - Authorized directory map
- ✅ `frontend.md` - React & Module Federation
- ✅ `backend.md` - NestJS modular architecture

### Security & Access Control
- ✅ `security.md` - Zero-trust storage policy
- ✅ `identity-and-access.md` - User identity & authentication
- ✅ `core-rbac.md` - Role-based access control

### Data Management
- ✅ `data-access.md` - Multi-database support
- ✅ `data-validation.md` - DTO validation & ACID
- ✅ `schema-healing.md` - Database drift detection

### Core Platform Services
- ✅ `core-api.md` - OpenAPI/Swagger documentation
- ✅ `core-eventhub.md` - Event bus pub/sub protocol
- ✅ `core-scheduler.md` - Centralized job orchestration
- ✅ `core-logging.md` - Structured JSON logging
- ✅ `core-notifications.md` - Toast/alert system

### UI/UX Standards
- ✅ `core-theme.md` - Token-based design system
- ✅ `core-ui.md` - Component library mandate

### Code Quality & Standards
- ✅ `coding-standards.md` - Prettier, 300-line rule, SRP
- ✅ `cicd.md` - Zero-tolerance quality gates
- ✅ `dependency-management.md` - LTS mandate, security
- ✅ `performance-efficiency.md` - Network budgets, BFF

### Plugin System
- ✅ `plugins-lifecycle.md` - Plugin manifest & packaging
- ✅ `plugins-dataproviders.md` - Data provider protocol

### Feature Systems
- ✅ `feature-flags.md` - Feature toggle architecture
- ✅ `localization.md` - i18n rules

---

## 🚀 Initial Setup Commands

### Prerequisites

Ensure you have the following installed:
- **Node.js**: LTS version (v20.x or later)
- **npm**: v10.x or later (comes with Node.js)
- **Git**: Latest version

Verify installations:
```powershell
node --version
npm --version
git --version
```

---

## Step 1: Initialize Nx Workspace (Integrated Monorepo)

### 1.1 Initialize Nx in Existing Git Project

Since you already have a git project set up in `d:\GitHub\team-forge`, we'll add Nx to the existing project using `nx init`:

```powershell
# Ensure you're in the project root
cd d:\GitHub\team-forge

# Initialize Nx in the existing project
npx nx@latest init
```

**What this does:**
- ✅ Adds Nx configuration files (`nx.json`, workspace configuration)
- ✅ Preserves your existing `.git` folder and all files
- ✅ Installs Nx as a dev dependency in your `package.json`
- ✅ Sets up caching and task pipeline configuration

> **Alternative:** If you prefer to create a fresh integrated monorepo structure, you can use:
> ```powershell
> npx create-nx-workspace@latest team-forge --pm=npm --nxCloud=skip --preset=ts
> ```
> Then manually copy your existing files (`.agent/rules/`, `setup.md`) into the new `team-forge` directory.

> **Note:** Make sure to commit or stash any uncommitted changes before running this command.

---

## Step 2: Install React and NestJS Capabilities

### 2.1 Install React Plugin

```powershell
# Add React capabilities to the workspace
npm install --save-dev @nx/react
```

### 2.2 Install NestJS Plugin

```powershell
# Add NestJS capabilities to the workspace
npm install --save-dev @nx/nest
```

### 2.3 Install Additional Required Plugins

```powershell
# Install web plugin for Module Federation support
npm install --save-dev @nx/web

# Install Node plugin for backend utilities
npm install --save-dev @nx/node

# Install webpack for bundling (required for Module Federation)
npm install --save-dev @nx/webpack

# Install Jest for testing
npm install --save-dev @nx/jest
```

---

## Step 3: Create Required Configuration Files

> **Note:** The directory structure (`apps/`, `libs/`, `tools/`) will be created automatically by the Nx generators in Steps 4 and 5. **Do not manually create application or library directories** - this will cause "project already exists" errors.

### 3.1 Create .env File

```powershell
# Create .env file (NEVER COMMIT THIS)
New-Item -Path .env -ItemType File -Force
```

### 3.2 Create Documentation Directory

```powershell
# Create documentation directory (not managed by generators)
mkdir -Force documentation/plugins
```

> **Note:** The `.gitignore` file was created by `nx init` and should already include Nx-specific entries. We'll verify and update it in Step 10.

### 3.5 Configure Nx Named Inputs (Critical for Build)

The default `nx.json` created by `nx init` may miss the `namedInputs` section required by build targets.

1. Open `nx.json`
2. Ensure the `namedInputs` section exists before `targetDefaults`. If missing, add it:

```json
"namedInputs": {
  "default": ["{projectRoot}/**/*", "sharedGlobals"],
  "production": [
    "default",
    "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "!{projectRoot}/tsconfig.spec.json",
    "!{projectRoot}/jest.config.[jt]s",
    "!{projectRoot}/src/test-setup.[jt]s",
    "!{projectRoot}/test-setup.[jt]s"
  ],
  "sharedGlobals": []
},
"targetDefaults": {
  // ...
}
```

---

## Step 4: Generate Initial Applications

> **Important:** Nx generators require the `--name` flag for all arguments. Older syntax using positional arguments (e.g., `nx g @nx/react:host shell`) will fail with "Schema does not support positional arguments" error. Always use `--name=<value>` format.

### 4.1 Generate the Shell (React Host Application)

```powershell
# Generate the React Shell application with Module Federation
npx nx g @nx/react:host --name=shell --directory=apps/shell --style=css --bundler=webpack --e2eTestRunner=none --unitTestRunner=jest --skipFormat=false
```

**Options Explained:**
- `host`: Creates a Module Federation host application
- `--name=shell`: Names the application "shell"
- `--directory=apps/shell`: Places the app in the correct location
- `--style=css`: Uses standard CSS (we'll manage theming separately)
- `--bundler=webpack`: Required for Module Federation
- `--e2eTestRunner=none`: We'll configure E2E later
- `--unitTestRunner=jest`: Uses Jest for unit testing

### 4.2 Generate the API Gateway (NestJS Application)

```powershell
# Generate the NestJS API Gateway
npx nx g @nx/nest:application --name=api-gateway --directory=apps/api-gateway --frontendProject=shell --skipFormat=false
```

**Options Explained:**
- `--name=api-gateway`: Names the application "api-gateway"
- `--directory=apps/api-gateway`: Places the app in the correct location
- `--frontendProject=shell`: Links the backend to the Shell frontend
- `--skipFormat=false`: Ensures code is formatted with Prettier

---

## Step 5: Generate Shared Libraries

### 5.1 Generate Shared UI Library

```powershell
# Generate the shared UI component library
npx nx g @nx/react:library --name=ui --directory=libs/shared/ui --style=css --unitTestRunner=jest --bundler=vite --component=false --skipFormat=false
```

### 5.2 Generate Auth Client Library (React)

```powershell
# Generate the auth client library for React
npx nx g @nx/react:library --name=auth-client --directory=libs/shared/auth-client --style=css --unitTestRunner=jest --bundler=vite --component=false --skipFormat=false
```

### 5.3 Generate Auth Server Library (NestJS)

```powershell
# Generate the auth server library for NestJS
npx nx g @nx/nest:library --name=auth-server --directory=libs/shared/auth-server --unitTestRunner=jest --skipFormat=false
```

### 5.4 Generate Utils Library (Shared TypeScript)

```powershell
# Generate the shared utils library
npx nx g @nx/js:library --name=utils --directory=libs/shared/utils --unitTestRunner=jest --bundler=tsc --skipFormat=false
```

### 5.5 Generate Data Access Library (Shared TypeScript)

```powershell
# Generate the data access library
npx nx g @nx/js:library --name=data-access --directory=libs/shared/data-access --unitTestRunner=jest --bundler=tsc --skipFormat=false
```

---

## Step 6: Install Core Dependencies

### 6.1 Install TypeORM and Database Dependencies

```powershell
# Install TypeORM and MS SQL driver
npm install typeorm mssql

# Install pg for PostgreSQL support (multi-database)
npm install pg

# Install reflection metadata (required by TypeORM)
npm install reflect-metadata
```

### 6.2 Install NestJS Configuration and Validation

```powershell
# Install config module
npm install @nestjs/config

# Install class-validator and class-transformer for DTOs
npm install class-validator class-transformer
```

### 6.3 Install Event Bus (NestJS EventEmitter)

```powershell
# Install event emitter for the Event Hub
npm install @nestjs/event-emitter
```

### 6.4 Install BullMQ for Job Scheduling

```powershell
# Install BullMQ and NestJS Bull integration
npm install @nestjs/bull bullmq ioredis
```

### 6.5 Install Swagger/OpenAPI

```powershell
# Install Swagger for API documentation
npm install @nestjs/swagger swagger-ui-express
```

### 6.6 Install Frontend Dependencies

```powershell
# Install React Router for navigation
npm install react-router-dom

# Install TanStack Query for server state management
npm install @tanstack/react-query

# Install date-fns or similar for date utilities
npm install date-fns
```

### 6.7 Security Audit and Vulnerability Fixes (MANDATORY)

> **Critical:** Per **Rule 13 (dependency-management.md)**, the build must fail if any High or Critical severity vulnerabilities are detected. This step is mandatory before proceeding.

```powershell
# Run security audit to identify vulnerabilities
npm audit

# Review the output for HIGH or CRITICAL vulnerabilities
# If any are found, attempt automatic fixes
npm audit fix

# If automatic fix doesn't resolve all issues, try force update
# WARNING: This may introduce breaking changes - review carefully
npm audit fix --force

# Verify all HIGH/CRITICAL vulnerabilities are resolved
npm audit --audit-level=high
```

**Expected Results:**
- ✅ `found 0 vulnerabilities` - **PROCEED**
- ❌ `X high severity vulnerabilities` - **MUST FIX before continuing**
- ⚠️ Low/Moderate vulnerabilities - Acceptable for now, but should be tracked

**If vulnerabilities persist after `npm audit fix --force`:**
1. Review the audit output for specific package names
2. Check if updates are available: `npm outdated`
3. Manually update problematic packages: `npm update <package-name>`
4. If no fix exists, document the vulnerability and mitigation plan
5. Consider alternative packages if the vulnerability is in a direct dependency

> **Note:** This audit ensures we start with a secure dependency tree. CI/CD will enforce the same check on every build (Rule 7: cicd.md).

---

## Step 7: Configure TypeScript Strict Mode

### 7.1 Update Root tsconfig.json

Edit `tsconfig.base.json` (or `tsconfig.json`) to enable strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

---

## Step 8: Configure Linting (Zero-Tolerance)

### 8.1 Configure ESLint to Treat Warnings as Errors

Create or update `.eslintrc.json` in the root:

```json
{
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nx"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### 8.2 Add Lint Script with Max Warnings

Update `package.json` to add strict linting:

```json
{
  "scripts": {
    "lint:strict": "nx affected:lint --max-warnings=0"
  }
}
```

---

## Step 9: Configure Prettier

### 9.1 Install Prettier

```powershell
npm install --save-dev prettier
```

### 9.2 Create .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## Step 10: Verify and Update .gitignore

### 10.1 Verify .gitignore

The `nx init` command created a `.gitignore` file with Nx-specific entries:

```
.nx/cache
.nx/workspace-data
```

You should update `.gitignore` to include additional Team Forge-specific entries:

```powershell
# Add additional entries to .gitignore
Add-Content -Path .gitignore -Value @"

# Environment Variables (CRITICAL - NEVER COMMIT)
.env
.env.local
.env.*.local

# Dependencies
node_modules

# Build outputs
dist
tmp
.cache

# IDEs
.vscode
.idea

# OS Files
.DS_Store
Thumbs.db
"@
```

### 10.2 Commit Initial Setup

Since git is already initialized for this project:

```powershell
git add .
git commit -m "chore: initial Team Forge V2 setup with Nx, React, and NestJS"
```

---

## Step 11: Verify Installation

### 11.1 Check Nx Graph

```powershell
# Generate and view the dependency graph
npx nx graph
```

This will open a browser showing the project structure and dependencies.

### 11.2 Run Linting

```powershell
# Lint all projects
npx nx run-many --target=lint --all
```

### 11.3 Run Tests

```powershell
# Test all projects
npx nx run-many --target=test --all
```

### 11.4 Build Applications

```powershell
# Build the Shell
npx nx build shell

# Build the API Gateway
npx nx build api-gateway
```

---

## 📁 Final Directory Structure

After completing these steps, your directory structure should match the **project-structure.md** specification:

```
team-forge/
├── .gitignore              ✅ Includes .env, /dist, /tmp
├── .env                    ✅ Local secrets only (NEVER COMMIT)
├── nx.json                 ✅ Workspace configuration
├── package.json            ✅ Root dependencies
├── tsconfig.base.json      ✅ TypeScript configuration (strict mode)
├── .eslintrc.json          ✅ ESLint configuration (max-warnings=0)
├── .prettierrc             ✅ Prettier configuration
│
├── apps/                   ✅ DEPLOYABLE APPLICATIONS
│   ├── shell/              ✅ [Frontend] React Host (Module Federation)
│   │   └── src/
│   ├── api-gateway/        ✅ [Backend] NestJS Entry Point
│   │   └── src/
│   └── plugins/            ✅ Remote Modules (Business Logic)
│
├── libs/                   ✅ SHARED LIBRARIES
│   └── shared/
│       ├── ui/             ✅ UI Components (Buttons, Cards)
│       ├── auth-client/    ✅ React Auth Context/Hooks
│       ├── auth-server/    ✅ NestJS Auth Guards
│       ├── utils/          ✅ Shared Helpers (Validators, Formatters)
│       └── data-access/    ✅ TypeORM Entities, DTOs
│
├── tools/                  ✅ DEVOPS & SCRIPTS
│
└── documentation/          ✅ PROJECT DOCUMENTATION
    └── plugins/
```

---

## 🎯 Next Steps

1. **Configure Module Federation**: Set up the Shell as a Module Federation host
2. **Create First Plugin**: Generate an example plugin (e.g., `user-admin`)
3. **Setup TypeORM**: Configure database connection in API Gateway
4. **Implement Auth**: Set up authentication guards and context
5. **Create Event Bus**: Implement the Event Hub service
6. **Setup RBAC**: Implement the Permission Registry
7. **Configure CI/CD**: Set up GitHub Actions with Nx affected commands

---

## 📚 Reference

- **Nx Documentation**: https://nx.dev
- **NestJS Documentation**: https://docs.nestjs.com
- **React Documentation**: https://react.dev
- **TypeORM Documentation**: https://typeorm.io
- **Module Federation**: https://webpack.js.org/concepts/module-federation

---

## ⚠️ Critical Reminders

- **NEVER commit `.env`** - It's in `.gitignore` for a reason
- **Always use `strict: true`** in TypeScript configuration
- **Lint with `--max-warnings=0`** - Zero tolerance for warnings
- **Use LTS versions** - Node.js LTS, stable framework versions only
- **Follow the 300-line rule** - No file should exceed 300 lines of code

---

**Status**: ✅ **All 25 Rule Files Acknowledged and Setup Guide Complete**
