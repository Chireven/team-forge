---
trigger: always_on
---

# PROJECT STRUCTURE MAP
# This file defines the ONLY authorized locations for code.
# Do not create folders or files outside of this schema without explicit permission.

/team-forge-monorepo
├── .gitignore             # MUST include: .env, /dist, /tmp
├── .env                   # STRICT: Local secrets only. NEVER COMMIT.
├── nx.json                # Workspace configuration
├── package.json           # Root dependencies
├── /apps                  # DEPLOYABLE APPLICATIONS ONLY
│   ├── /shell             # [Frontend] The Host/Container App
│   │   ├── src/           # Setup code only (Routing, Auth Config)
│   │   └── ...
│   │
│   ├── /api-gateway       # [Backend] The NestJS Entry Point
│   │   ├── src/           # Controller/Routing logic only
│   │   └── ...
│   │
│   └── /plugins           # THE "REMOTE" MODULES (Business Logic)
│       ├── /user-admin    # Example Plugin Structure
│       │   ├── web/       # React Remote (Views & Components)
│       │   └── api/       # NestJS Module (Services & DTOs)
│       │
│       └── /[plugin-name] # Pattern for all future plugins
│           ├── web/
│           └── api/
│
├── /libs                  # SHARED LIBRARIES (Re-usable Code)
│   ├── /shared
│   │   ├── /ui            # STRICT: All UI components (Buttons, Cards) go here
│   │   ├── /auth-client   # Shared React Auth Context/Hooks
│   │   ├── /auth-server   # Shared NestJS Auth Guards
│   │   └── /utils         # Shared Helpers (Validators, Formatters)
│
└── /tools                 # DEVOPS & SCRIPTS