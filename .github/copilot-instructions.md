# Copilot Instructions for nest-scaffold

## Architecture Overview

Enterprise NestJS scaffold with DDD boundaries, JWT auth (roles/permissions), audit logging, Bull queues (Redis), circuit-breaker for outbound calls, standardized responses, and Prisma with soft-delete ("paranoid") semantics.

### Core Components

- **Prisma ORM** with soft delete support and paranoid filtering
- **JWT Authentication** with role/permission-based authorization
- **Bull Queue** system with Redis backend and web UI
- **Circuit Breaker** pattern for external API resilience
- **Audit Logging** for all user actions
- **Response Transformation** with standardized API format

## Module Structure Pattern

Each feature module follows this exact structure:

```
src/modules/[feature]/
├── [feature].module.ts
├── controllers/
│   ├── [feature].controller.ts
│   ├── filters/        # Prisma query filters (optional)
│   ├── requests/       # Input DTOs with validation
│   └── viewmodels/     # Output DTOs for serialization
├── services/
│   └── [feature].service.ts
└── interfaces/         # Domain contracts or enums (optional)
```

Note: Some modules may also include `strategy/` directories for domain-specific contracts and patterns.

## Path Aliases (Critical for Imports)

Use these specific aliases defined in `tsconfig.json`:

- `@modules/*` - Module imports across the application
- `@services/*` - Service layer classes from all modules
- `@requests/*` - Request DTOs and filters from all modules
- `@viewmodels/*` - Response DTOs and view models from all modules
- `@utils/*` - Shared utilities and decorators

## Authentication & Authorization

### Guards and Decorators Pattern

Use the actual decorators from your codebase:

```typescript
import { AuthenticatedUser, AuthenticatedAdmin } from '@utils/decorators/authenticate-user.decorator';
import { Permission } from '@utils/decorators/permission.decorator';
import { UserAccess } from '@utils/decorators/user-access.decorator';

@AuthenticatedUser()     // Requires JWT token (uses AuthGuard('auth'))
@AuthenticatedAdmin()    // Requires admin role (includes RoleGuard)
@Permission(['read_users']) // Requires specific permission
@UserAccess() user: User    // Injects current user if needed
```

Role hierarchy: User → Admin (permissions checked via `PermissionGuard`)

## Response Pattern

All endpoints use `@SerializeResponse()` with two types:

```typescript
// Single resource
@SerializeResponse({ vm: UserVm })

// Paginated collection
@SerializeResponse({ vm: UserVm, type: 'pagination', hasMessage: true })
```

Use `hasMessage: true` for show message on format

Output format: `{ status: true, message?: string, data: T, meta?: PaginationMeta }`

## Prisma Integration

### Extended Client Features

- **Soft Delete**: Automatic `deletedAt: null` filtering in relations
- **Paranoid Mode**: Use `ignoreParanoids` array to bypass soft delete filtering
- **Base Filter**: Extends `BaseFilter<WhereInput, FindManyArgs>` for query building

### Filter Pattern

```typescript
// In controller
@PrismaFilter() filter: Prisma.UserFindManyArgs,
@Query() query: FilterSearchUser

// In service using filter class (see audit-log example)
const auditLogFilter = new AuditLogFilter(filter, query);
return this.prisma.auditLog.findMany(auditLogFilter);
```

## Queue System

Uses Bull with Redis. Queues have dashboard at `/queues/ui`.

- Configure in `QueueModule`
- Access via `@InjectQueue('queue-name')`
- Monitor with Bull Board web UI

### Queue Structure Pattern

```
src/modules/queues/feature/
├── feature.module.ts
├── processors/                  # @Processor('[queue-name]')
├── services/                   # Queue processing services
└── interfaces/                 # Job data contracts or enums
```

### Usage Example

```typescript
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

constructor(@InjectQueue('emails') private readonly emails: Queue) {}

await this.emails.add('welcome', { userId }, { attempts: 3, backoff: 5000 });
```

## Circuit Breaker

For external API calls, use `SafeRequestService` from the circuit-breaker module:

```typescript
constructor(private readonly safeRequest: SafeRequestService) {}

async callExternalAPI() {
  return this.safeRequest.get('https://external-api.com/endpoint', {
    cbOptions: { timeout: 5000 }
  });
}
```

**Available Methods:** `get`, `post`, `put`, `patch`, `delete`

## Development Commands

```bash
# Database
npm run prisma:migrate-deploy  # Apply migrations
npm run prisma:generate-client # Generate Prisma client
npm run prisma:seed            # Seed database

# Development
npm run start:dev            # Watch mode
npm run start:debug          # Debug mode

# Testing
npm run test:e2e            # End-to-end tests

# Code Quality
npm run lint                # ESLint check and fix
npm run format              # Prettier formatting
```

## Code Generation

Use `templates/request.filter.mustache` for generating request filters. Replace:

- `FILTER_NAME` - Filter class name
- `MODELNAME` - Prisma model name
- `QUERY_REQUEST` - Query DTO interface

## Key Files to Reference

- `src/modules/prisma/services/prisma.service.ts` - Extended Prisma client
- `src/utils/decorators/` - All custom decorators
- `src/utils/interceptors/response/` - Response transformation
- `src/modules/auth/strategy/` - Auth guards and strategies
