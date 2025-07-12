# Long-Term Fix Protocols (2025-07-11)

## 1. No Short-Term Fixes
- Every fix must address the root cause, not just the symptom.
- No quick hacks or band-aids that will break with future updates.

## 2. Holistic System Thinking
- Always consider the full stack: backend, frontend, build system, deployment, and developer experience.
- Check all dependencies, module systems, and cross-module imports/exports.

## 3. PRD, TaskMaster, and Dev Guidelines Compliance
- Every change must be referenced against the PRD, TaskMaster, and development history.
- If a fix would violate a guideline or create future tech debt, escalate for discussion.

## 4. TypeScript/Node.js Module Consistency
- The backend must use a single, consistent module system (ESM or CommonJS) across all files and build outputs.
- All imports/exports must match the build output and runtime environment.
- The build process must always output to the correct directory and format for production.

## 5. Environment Variables and Secrets
- All required secrets (e.g., Supabase keys) must be loaded from a secure `.env.local` or environment, never hardcoded.
- Startup should fail with a clear error if a required secret is missing.

## 6. Testing and Verification
- After every fix, verify all critical flows: server start, API endpoints, authentication, and database operations.
- Document the root cause, the fix, and why it will not break in the future.

--- 