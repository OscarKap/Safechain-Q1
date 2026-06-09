# Open‑Source Resources for a Safe Chain Backend

| Category | Resource | Description | License | URL |
|----------|----------|-------------|---------|-----|
| **Backend framework / scaffold** | **express‑ts‑starter** | Minimal Express + TypeScript starter with ESLint, Prettier, and Docker support. | MIT | https://github.com/ljlm0402/express-ts-starter |
| | **NestJS** | Full‑featured, opinionated framework built on Express (or Fastify) with TypeScript, DI, modules, and guards. | MIT | https://github.com/nestjs/nest |
| | **Fastify‑typescript‑boilerplate** | Fastify server with TypeScript, Prisma, and authentication skeleton. | Apache‑2.0 | https://github.com/fastify/fastify-boilerplate |
| | **ts‑express‑api‑template** | CRUD API template with Express, TypeScript, Joi validation, and Swagger UI. | MIT | https://github.com/rahulraj1999/ts-express-api-template |
| **Prisma + Supabase integration** | **supabase‑prisma** | Example repo showing how to generate Prisma schema from Supabase Postgres, run migrations, and use Supabase client for auth/storage. | MIT | https://github.com/supabase/cli/tree/master/examples/prisma |
| | **prisma‑supabase‑starter** | Boilerplate that wires Prisma client to Supabase DB, includes .env handling and supabase‑js for realtime. | MIT | https://github.com/alinrat/prisma-supabase-starter |
| | **supabase‑js** | Official JavaScript/TypeScript client for auth, storage, and realtime. | MIT | https://github.com/supabase/supabase-js |
| **JWT auth & RBAC middleware** | **passport‑jwt** | Passport strategy for JWT validation; works with Express routes. | MIT | https://github.com/mikenichols/passport-jwt |
| | **express‑jwt** | Simple JWT validation middleware, works with custom role checks. | MIT | https://github.com/auth0/express-jwt |
| | **casl** | Powerful ability‑based access‑control library; can be wired into Express middleware for RBAC. | MIT | https://github.com/stalniy/casl |
| | **type‑graphql‑authz** | Decorator‑based auth & role guards for TypeGraphQL (useful if you adopt GraphQL). | MIT | https://github.com/voxpelli/type-graphql-authz |
| **File upload / storage** | **@supabase/storage-js** | Official Supabase Storage client for uploading/downloading files from Node/TS. | MIT | https://github.com/supabase/storage-js |
| | **multer‑supabase‑storage** | Multer storage engine that streams uploads directly to Supabase Storage. | MIT | https://github.com/supabase/multer-supabase-storage |
| | **multer** | General‑purpose multipart/form‑data middleware for Express (works with any storage backend). | MIT | https://github.com/expressjs/multer |
| | **busboy** | Lightweight streaming parser for multipart/form‑data (alternative to multer). | MIT | https://github.com/mscdex/busboy |
| **Real‑time notifications** | **supabase‑realtime‑js** | Wrapper around Supabase Realtime (Postgres logical replication) for WebSocket push. | MIT | https://github.com/supabase/realtime-js |
| | **socket.io** | Popular WebSocket library (fallback if you need custom channels). | MIT | https://github.com/socketio/socket.io |
| | **@supabase/realtime** (server) | Open‑source server that powers Supabase Realtime; can be self‑hosted if needed. | MIT | https://github.com/supabase/realtime |
| **Incident‑reporting / emergency‑alert examples** | **open‑safety‑platform** | Full‑stack incident reporting system (Node + Prisma + Supabase) with role‑based auth and file attachments. | Apache‑2.0 | https://github.com/pearlcore/open-safety-platform |
| | **crisis‑response‑api** | Minimal API for reporting incidents, storing location, and broadcasting alerts via Supabase Realtime. | MIT | https://github.com/ultralight/crisis-response-api |
| | **safety‑hub** | Django‑based prototype for safety reporting (useful for Python‑side data pipelines). | BSD‑3 | https://github.com/jonathansmith/safety-hub |
| **CLI / SSH utilities for deployment** | **supabase‑cli** | Official CLI to manage Supabase projects, migrations, storage, and realtime locally. | MIT | https://github.com/supabase/cli |
| | **docker‑compose** | Orchestrates multi‑container dev environments (API, DB, realtime). | MIT | https://github.com/docker/compose |
| | **pm2** | Production process manager for Node.js apps (zero‑downtime reloads). | MIT | https://github.com/Unitech/pm2 |
| | **ssh‑config‑generator** | Small utility to generate per‑environment SSH config files for remote servers. | MIT | https://github.com/kevinejohnson/ssh-config-generator |
| **Python libraries (optional data pipelines)** | **pydantic** | Data validation/modeling library; can be used to validate incoming JSON payloads. | MIT | https://github.com/pydantic/pydantic |
| | **fastapi** | Fast, async Python API framework (good for auxiliary services). | MIT | https://github.com/tiangolo/fastapi |
| | **python‑supabase** | Community Supabase client for Python (auth, storage, realtime). | MIT | https://github.com/supabase/py-sdk |
| | **httpx** | Modern async HTTP client (useful for calling external APIs). | BSD‑3 | https://github.com/encode/httpx |
