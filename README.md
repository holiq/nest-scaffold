# 🏗️ NestJS Enterprise Scaffold

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <strong>Enterprise-grade NestJS scaffold with Domain-Driven Design boundaries, comprehensive authentication, queue management, and production-ready features.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#development">Development</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## ✨ Features

### 🔐 **Authentication & Authorization**

- **JWT Authentication** with refresh token support
- **Role-based Access Control (RBAC)** with granular permissions
- **Admin/User role hierarchy** with guard-based protection
- **Secure password hashing** with bcrypt

### 🗄️ **Database & ORM**

- **Prisma ORM** with PostgreSQL support
- **Soft delete (paranoid)** semantics across all models
- **Database migrations** and seeding
- **UUID primary keys** with crypto generation

### 🚀 **Queue Management**

- **Bull Queue** system with Redis backend
- **Bull Board UI** for queue monitoring at `/queues/ui`
- **Background job processing** with retry logic
- **Cron job integration** for scheduled tasks

### 🛡️ **Resilience & Monitoring**

- **Circuit Breaker** pattern for external API calls
- **Audit logging** for all user actions
- **Error handling** with custom exception filters
- **Request/Response standardization**

### 🏗️ **Architecture & Code Quality**

- **Domain-Driven Design** boundaries
- **Modular architecture** with clear separation of concerns
- **TypeScript** with strict type checking
- **ESLint + Prettier** for code formatting
- **Swagger API documentation** with OpenAPI

### 📊 **Additional Features**

- **File upload** capabilities
- **Response transformation** with ViewModels
- **Request validation** with class-validator
- **Environment configuration** management
- **NewRelic** integration for APM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server (for queue management)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nest-scaffold
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Configure your database, Redis, and other environment variables
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   npm run prisma:generate-client

   # Run migrations
   npm run prisma:migrate-deploy

   # Seed the database
   npm run prisma:seed
   ```

5. **Start the application**

   ```bash
   # Development mode with auto-reload
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

### 🎯 Access Points

- **API Documentation**: `http://localhost:3000/api` (Swagger UI)
- **Queue Dashboard**: `http://localhost:3000/queues/ui` (Bull Board)
- **Health Check**: `http://localhost:3000/health`

---

## 🏛️ Architecture

### Module Structure

Each feature module follows a consistent Domain-Driven Design pattern:

```
src/modules/[feature]/
├── [feature].module.ts          # Module registration
├── controllers/
│   ├── [feature].controller.ts  # HTTP endpoints
│   ├── requests/               # Input DTOs with validation
│   ├── viewmodels/             # Output DTOs for serialization
│   └── filters/                # Prisma query filters
├── services/
│   └── [feature].service.ts    # Business logic
└── interfaces/                 # Domain contracts and enums
```

### Core Modules

- **🔐 Auth Module**: JWT authentication, login/logout, token management
- **👥 User Module**: User management with RBAC
- **🛡️ Role Module**: Role and permission management
- **📋 Permission Module**: Granular permission control
- **📊 Audit Log Module**: Request/response logging and tracking
- **⚡ Queue Modules**: Background job processing (token cleanup, etc.)
- **🔧 Common Modules**: Circuit breaker, file upload, configuration

### Design Patterns

#### Authentication & Authorization

```typescript
@AuthenticatedUser()           // Requires valid JWT token
@AuthenticatedAdmin()          // Requires admin role
@Permission(['read_users'])    // Requires specific permission
@UserAccess() user: User       // Injects current user
```

#### Response Standardization

```typescript
@SerializeResponse({ vm: UserVm })                        // Single resource
@SerializeResponse({ vm: UserVm, type: 'pagination' })    // Paginated list
@SerializeResponse({ vm: Object, hasMessage: true })      // Success message
```

#### Queue Management

```typescript
// Add job to queue
await this.queueService.addJob({ userId: '123', action: 'cleanup' });

// Process jobs with Bull
@Processor({ name: 'user-cleanup-queue' })
export class UserCleanupProcessor {
  @Process({ name: 'cleanup-job' })
  async handleCleanup(job: Job<ICleanupJob>) {
    // Job processing logic
  }
}
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev              # Start with auto-reload
npm run start:debug            # Start with debugging enabled

# Database
npm run prisma:migrate-deploy  # Apply migrations
npm run prisma:generate-client # Generate Prisma client
npm run prisma:seed           # Seed database with initial data

# Code Quality
npm run lint                  # ESLint check and fix
npm run format               # Prettier code formatting

# Testing
npm run test                 # Unit tests
npm run test:e2e            # End-to-end tests
npm run test:cov            # Test coverage report
```

### Code Generation

Use the provided Mustache template for generating consistent request filters:

```bash
# Located at: templates/request.filter.mustache
# Replace: FILTER_NAME, MODELNAME, QUERY_REQUEST
```

### Naming Conventions

#### Files & Classes

- **Modules**: `feature.module.ts` → `FeatureModule`
- **Controllers**: `feature.controller.ts` → `FeatureController`
- **Services**: `feature.service.ts` → `FeatureService`
- **DTOs**: `feature.request.ts` → `CreateFeatureRequest`, `UpdateFeatureRequest`
- **ViewModels**: `feature.viewmodel.ts` → `FeatureVm`

#### API Endpoints

- **Tags**: `(Feature) Feature Management` for CRUD
- **Operations**: "Get all features", "Create a new feature", etc.
- **Permissions**: `action_resources` (e.g., `create_users`, `read_roles`)

### Database Best Practices

#### Soft Delete Support

All models include automatic soft delete with `deletedAt` filtering:

```typescript
// Automatically filters out soft-deleted records
const users = await this.prisma.user.findMany();

// Include soft-deleted records
const allUsers = await this.prisma.user.findMany({
  ignoreParanoids: ['user'],
});
```

#### Query Filtering

```typescript
// Simple filtering
const users = await this.prisma.user.findMany({
  where: { email: query.email },
  include: { roles: true },
});

// Complex filtering with filter classes
const userFilter = new UserFilter(filter, query);
const users = await this.prisma.user.findMany(userFilter);
```

---

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**

   - Set `NODE_ENV=production`
   - Configure production database URL
   - Set secure JWT secrets
   - Configure Redis connection

2. **Database**

   ```bash
   npm run prisma:migrate-deploy
   npm run prisma:seed
   ```

3. **Build Application**
   ```bash
   npm run build
   npm run start:prod
   ```

### Docker Support

```dockerfile
# Example Dockerfile structure
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nestscaffold"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Redis (for queues)
REDIS_HOST="localhost"
REDIS_PORT="6379"

# Queue Settings
NUMBER_OF_RUN_QUEUE="10"

# Monitoring
NEWRELIC_LICENSE_KEY="your-newrelic-key"
```

---

## 📚 API Documentation

### Authentication Endpoints

```typescript
POST /auth/login              # User login
POST /auth/logout            # Logout current session
POST /auth/logout-all        # Logout from all devices
POST /auth/refresh-token     # Refresh JWT token
```

### User Management

```typescript
GET    /users               # List all users (admin)
POST   /users               # Create user (admin)
GET    /users/:id           # Get user details (admin)
PATCH  /users/:id           # Update user (admin)
DELETE /users/:id           # Soft delete user (admin)
GET    /users/profile       # Get current user profile
PATCH  /users/profile       # Update current user profile
```

### Role & Permission Management

```typescript
GET    /roles               # List roles (admin)
POST   /roles               # Create role (admin)
GET    /permissions         # List permissions (admin)
POST   /permissions         # Create permission (admin)
```

### Response Format

All API responses follow a standardized format:

```json
{
  "status": true,
  "message": "Operation successful",
  "data": {
    /* resource data */
  },
  "meta": {
    /* pagination metadata for lists */
  }
}
```

---

## 🔧 Customization

### Adding New Modules

1. **Generate module structure**:

   ```bash
   mkdir -p src/modules/feature/{controllers,services}
   mkdir -p src/modules/feature/controllers/{requests,viewmodels,filters}
   ```

2. **Follow the established patterns**:

   - Use consistent naming conventions
   - Implement proper authentication/authorization
   - Add Swagger documentation
   - Create appropriate DTOs and ViewModels

3. **Register in `app.module.ts`**:
   ```typescript
   imports: [
     // ... existing modules
     FeatureModule,
   ],
   ```

### Queue Integration

1. **Create queue module structure**:

   ```
   src/modules/queues/feature/
   ├── feature.module.ts
   ├── feature.const.ts
   ├── processors/job.processor.ts
   ├── services/job.service.ts
   └── interfaces/job.interface.ts
   ```

2. **Register with Bull Board** for monitoring
3. **Implement job processing logic**
4. **Add cron jobs** for scheduled processing

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the coding standards**: Run `npm run lint` and `npm run format`
4. **Write tests** for new functionality
5. **Commit changes**: `git commit -m 'feat: add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- Follow the established module patterns
- Use TypeScript strict mode
- Write comprehensive tests
- Document new APIs with Swagger
- Follow semantic commit conventions

---

## 📄 License

This project is [MIT licensed](LICENSE).
