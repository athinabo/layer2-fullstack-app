---
name: architecture-expert
description: Expert guide for this fullstack e-commerce application's architecture, patterns, and development practices. Use when the user asks about how to add features, where code should go, how components communicate, security patterns, data flow, testing strategy, database schema, configuration, or any "how do I..." questions about building within this codebase. Also trigger when the user mentions Spring Boot layers, Angular routing, JWT authentication, order strategies, DTO patterns, or asks about the proper way to structure new features.
---

# Architecture Expert

Provide expert architectural guidance for this fullstack e-commerce application. The codebase uses Spring Boot 4.0.3 (backend), Angular 21 (frontend), and PostgreSQL 18, with established patterns for security, state management, and data flow.

## When to Use This Skill

Apply this skill when the user needs:
- Guidance on where new code should live (which layer, which module)
- Understanding of established patterns (DTO, Strategy, Repository)
- Help adding new features following existing conventions
- Explanation of how components communicate
- Security implementation guidance (JWT, roles, guards)
- Database schema and migration guidance
- Configuration and environment setup help
- Testing strategy for new code

## Core Architecture Principles

### Backend: Layered Architecture

The backend follows strict layer separation:

**Controller → Service → Repository → Database**

Each layer has specific responsibilities:

**Controller Layer** (`controller/`)
- Accept HTTP requests, return HTTP responses
- Map between DTOs and service layer
- Delegate all business logic to services
- Apply method-level security with `@PreAuthorize`

**Why this matters:** Controllers are thin orchestrators. If you find business logic in a controller, move it to the service layer.

**Service Layer** (`service/`)
- Implement all business rules
- Coordinate multiple repository operations
- Manage transaction boundaries
- Own the domain logic

**Why this matters:** Services contain the "how" of the application. Order processing, stock allocation, validation rules all live here.

**Repository Layer** (`repository/`)
- Spring Data JPA interfaces
- Provide data access abstractions
- Custom queries when needed

**Why this matters:** Repositories are purely data access. No business logic, no DTOs, only entities.

### Frontend: Feature-Based Architecture

The frontend organizes by feature, not by file type:

```
app/
├── clib/              - Shared reusable components
├── core/              - App-wide infrastructure
└── features/          - Feature modules (lazy-loaded)
    ├── auth/
    ├── cart/
    ├── orders/
    └── products/
```

**Why this organization:** Features are self-contained with their own routes, components, services, and types. This makes code discoverable and allows lazy loading for performance.

**Feature Structure:**
```
feature/
├── components/
│   ├── pages/         - Routed containers
│   └── views/         - Presentational components
├── services/          - Feature-specific data access
├── types/             - Feature-specific types
├── guards/            - Route protection (if needed)
└── feature.routes.ts  - Feature routing configuration
```

## Architectural Patterns

### DTO Pattern (Backend)

**Rule:** API endpoints exchange DTOs, never entities.

**Why:** DTOs control what data crosses the API boundary, validate input, and decouple external contracts from internal domain models.

**Implementation:**
1. Create request/response DTOs in `dto/`
2. Create mapper in `dto/mapper/` to convert entity ↔ DTO
3. Controllers accept request DTOs, return response DTOs
4. Services work with entities internally

**Example flow:**
```
Client sends LoginRequestDto
  → Controller receives LoginRequestDto
  → Service validates, works with User entity
  → Service returns User entity
  → Mapper converts User → AuthResponseDto
  → Controller returns AuthResponseDto to client
```

### Strategy Pattern (Backend)

Order fulfillment uses pluggable strategies in `service/strategy/`:

**Current strategies:**
- `SingleLocationStrategy` - Fulfill from one location when possible
- `MostAbundantStrategy` - Source from locations with most stock

**Why this pattern:** Business rules for order fulfillment may vary. The Strategy pattern lets us swap algorithms without changing OrderService.

**Adding a new strategy:**
1. Implement `OrderStrategy` interface
2. Add `@Component` annotation with a bean name
3. Register in `OrderStrategyConfig.selectStrategy()`
4. Add strategy name to `application.yml`

### Signal-Based State (Frontend)

**Pattern:** Services use Angular signals for reactive state management.

**Why:** Signals provide fine-grained reactivity without Zone.js overhead. They make data flow explicit and enable computed values.

**Implementation:**
```typescript
// Writable signal for state
private itemsSignal = signal<Item[]>([]);

// Public readonly accessor
public items = this.itemsSignal.asReadonly();

// Computed derived values
public total = computed(() => 
  this.itemsSignal().reduce((sum, item) => sum + item.price, 0)
);

// Update state
addItem(item: Item) {
  this.itemsSignal.update(items => [...items, item]);
}
```

## Security Architecture

### JWT Authentication Flow

**Backend:**
1. User credentials arrive at `AuthController.login()`
2. `AuthService` validates against database via `UserRepository`
3. `JwtService` generates signed token with username + roles
4. Token returned to client in `AuthResponseDto`

**Frontend:**
1. `AuthService.login()` calls `/api/auth/login`
2. Store token in localStorage
3. `AuthTokenInterceptor` attaches token to all subsequent requests
4. Token validated by `JwtAuthFilter` on backend

**Token structure:** JWT contains username and roles as claims, signed with HMAC-SHA256.

### Authorization Patterns

**Backend role enforcement:**
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/products")
public ResponseEntity<ProductResponseDto> createProduct(@RequestBody ProductRequestDto dto) {
  // Only ADMIN users reach here
}
```

**Frontend role enforcement:**
```html
<button *hasRole="['ADMIN']">Delete Product</button>
```

**Available roles:** `ADMIN`, `CUSTOMER`

**Why separate enforcement:** Backend is authoritative (security boundary), frontend improves UX (hides unavailable actions).

## Data Flow Patterns

### Adding a Product (Customer → Admin Flow)

**Frontend:**
1. Admin navigates to `/products/create`
2. `ProductCreatePageComponent` displays `ProductFormComponent`
3. User submits → `ProductService.createProduct(dto)`
4. Service HTTP POST to `/api/products`

**Backend:**
1. `ProductController.createProduct()` receives `ProductRequestDto`
2. `@PreAuthorize` checks ADMIN role
3. Controller delegates to `ProductService.createProduct()`
4. Service converts DTO → `Product` entity
5. Service saves via `ProductRepository`
6. Service returns saved entity
7. Mapper converts entity → `ProductResponseDto`
8. Controller returns DTO to client

**Frontend completion:**
1. Navigate to product detail page
2. Show success notification

### Placing an Order (Customer Flow with Stock Allocation)

**Frontend:**
1. User in `/cart` clicks "Place Order"
2. `OrdersService.createOrder()` sends cart items to `/api/orders`

**Backend:**
1. `OrderController.createOrder()` receives `OrderRequestDto`
2. Controller delegates to `OrderService.createOrder()`
3. Service validates products exist via `ProductRepository`
4. Service selects strategy (SINGLE_LOCATION or MOST_ABUNDANT)
5. Strategy allocates stock across locations via `StockRepository`
6. Service creates `Order` entity
7. Service creates `OrderDetail` entities (line items)
8. Service decrements `Stock` quantities atomically (transaction)
9. Service returns order confirmation

**Frontend completion:**
1. Clear cart from localStorage
2. Navigate to `/orders/{id}`
3. Show success notification

**Failure handling:** Insufficient stock throws `OrderNotProcessableException`, caught by `GlobalExceptionHandler`, returned as error response.

## Database Schema

**Schema:** `onlineshop`

**Core tables:**
- `users` - Authentication and profiles
- `products` - Catalog items
- `product_categories` - Product categories
- `locations` - Fulfillment centers
- `stock` - Inventory per product per location (composite key)
- `orders` - Customer purchases
- `order_details` - Line items (composite key)

**Key relationships:**
- User → Orders (1:many)
- Product → Category (many:1)
- Product → Stock → Location (many:many via stock table)
- Order → OrderDetails → Product (1:many → many:1)

**Migrations:** Flyway manages versioned SQL in `onlineshopapi/src/main/resources/db/migration/`

**Adding a migration:**
1. Create `V{version}__{description}.sql`
2. Write idempotent SQL (use `IF NOT EXISTS` where applicable)
3. Flyway runs automatically on startup

## Configuration

### Backend Environment Configuration

**Profiles:**
- `application.yml` - Base configuration
- `application-local.yml` - Local development overrides
- `application-prod.yml` - Production overrides (not in repo)

**Key properties:**
- `server.servlet.context-path: /api` - API base path
- `app.jwt.secret` - JWT signing key (environment variable in production)
- `app.order-strategy` - Order fulfillment strategy selection
- `app.cors.allowed-origins` - CORS whitelist

**Local development:** Use `-Dspring-boot.run.profiles=local` to activate local profile.

### Frontend Environment Configuration

**Build configurations:**
- `development` - Real API, hot reload
- `mock` - MSW mocks, no backend needed
- `production` - Optimized bundle

**Environment files:** `src/environments/environment.{target}.ts`

**File replacement:** `angular.json` swaps environment files at build time.

## Adding New Features

### Backend Feature Addition

**Checklist:**
1. **Model** - Create entity in `model/`, add JPA annotations
2. **Repository** - Create Spring Data JPA interface in `repository/`
3. **DTOs** - Create request/response DTOs in `dto/`
4. **Mapper** - Create mapper in `dto/mapper/` for entity ↔ DTO conversion
5. **Service** - Implement business logic in `service/`
6. **Controller** - Create REST endpoints in `controller/`, apply security
7. **Migration** - Add Flyway migration in `db/migration/`
8. **Tests** - Write unit tests for service, integration tests for controller

**Example: Adding a "Wishlist" feature**

1. Create `Wishlist` entity (many-to-one with User)
2. Create `WishlistRepository` extends `JpaRepository<Wishlist, Long>`
3. Create `WishlistDto` and `WishlistMapper`
4. Create `WishlistService` with `addToWishlist()`, `removeFromWishlist()`
5. Create `WishlistController` with GET/POST/DELETE endpoints
6. Create `V3__Add_Wishlist_Table.sql` migration
7. Write `WishlistServiceTest` and `WishlistControllerTest`

### Frontend Feature Addition

**Checklist:**
1. **Feature module** - Create directory in `features/`
2. **Types** - Define DTOs in `core/types/dtos/` (shared) or feature `types/` (feature-specific)
3. **Service** - Create data service with HTTP calls
4. **Components** - Create page (routed) and view (presentational) components
5. **Routes** - Define in `{feature}.routes.ts`
6. **Integration** - Add lazy route to `app.routes.ts`
7. **Navigation** - Add constants to `core/config/constants/navigation.constants.ts`
8. **Tests** - Write component and service tests

**Example: Adding a "Wishlist" feature**

1. Create `features/wishlist/` directory
2. Define `WishlistItemDto` in `core/types/dtos/wishlist.dto.ts`
3. Create `WishlistService` with `getWishlist()`, `addItem()`, `removeItem()`
4. Create `WishlistOverviewPageComponent` (page)
5. Create `WishlistItemCardComponent` (view)
6. Define routes in `wishlist.routes.ts`
7. Add lazy route to `app.routes.ts`: `{ path: 'wishlist', loadChildren: () => import('./features/wishlist/wishlist.routes') }`
8. Add `Wishlist: { root: 'wishlist', features: {} }` to navigation constants

## Testing Strategy

### Backend Testing

**Unit tests** (`src/test/java/.../unit/`)
- Test business logic in isolation
- Mock dependencies
- Focus on service layer and strategies
- Example: `SingleLocationStrategyTest`

**Integration tests** (`src/test/java/.../integration/`)
- Test full layer stack with real database
- Use `@SpringBootTest` and test database
- Example: `OrderServiceTest`

**Controller tests**
- Test HTTP layer with `@WebMvcTest`
- Mock service layer
- Verify request/response mapping
- Example: `ProductControllerTest`

**Run tests:** `mvn test`

### Frontend Testing

**Component tests**
- Test component behavior and rendering
- Use Angular Testing Library
- Mock services and dependencies
- Example: `ProductCatalogPageComponent.spec.ts`

**Service tests**
- Test HTTP interactions with `HttpClientTestingModule`
- Verify request construction and response handling
- Example: `ProductService.spec.ts`

**Guard tests**
- Test route protection logic
- Mock `AuthService` and `Router`
- Example: `authGuard.spec.ts`

**Run tests:** `npm test`

## Common Development Tasks

### How to add a new API endpoint

1. Define request/response DTOs
2. Add method to service layer
3. Add controller endpoint with appropriate `@PreAuthorize`
4. Add integration test

### How to add a new page/route

1. Create page component in `features/{feature}/components/pages/`
2. Add route to `{feature}.routes.ts`
3. Apply appropriate guards (`authGuard`, `rolesGuard`)
4. Update navigation constants

### How to protect a route by role

**Backend:**
```java
@PreAuthorize("hasRole('ADMIN')")
```

**Frontend:**
```typescript
{
  path: 'admin-only',
  component: AdminComponent,
  canActivate: [authGuard, rolesGuard],
  data: { roles: ['ADMIN'] }
}
```

### How to persist state in frontend

**For authenticated user data:** Use signals in `AuthService`

**For shopping cart:** Use signals + localStorage with `effect()` for persistence

**For temporary UI state:** Use component-level signals

### How to add a new database table

1. Create entity class in `model/`
2. Create repository in `repository/`
3. Create migration in `db/migration/V{next}__Description.sql`
4. Restart backend to run migration

### How to change order processing logic

1. Modify existing strategy in `service/strategy/`, OR
2. Create new strategy implementing `OrderStrategy`, OR
3. Add logic to `OrderService` if strategy-agnostic

## Anti-Patterns to Avoid

**Backend:**
- ❌ Business logic in controllers → ✅ Put in services
- ❌ Controllers returning entities → ✅ Return DTOs
- ❌ Repositories working with DTOs → ✅ Use entities only
- ❌ Hardcoded secrets → ✅ Use environment variables

**Frontend:**
- ❌ Business logic in components → ✅ Put in services
- ❌ Direct localStorage access in components → ✅ Encapsulate in services
- ❌ Mixing authenticated and guest routes → ✅ Use guards consistently
- ❌ `import { environment }` outside core/ → ✅ Inject via providers

## Codebase Navigation

**Finding backend code:**
- Controllers: `onlineshopapi/src/main/java/msg/onlineshopapi/controller/`
- Services: `onlineshopapi/src/main/java/msg/onlineshopapi/service/`
- Entities: `onlineshopapi/src/main/java/msg/onlineshopapi/model/`
- Security: `onlineshopapi/src/main/java/msg/onlineshopapi/security/`

**Finding frontend code:**
- Routing: `onlineshopui/src/app/app.routes.ts` and `features/{feature}/{feature}.routes.ts`
- Services: `onlineshopui/src/app/features/{feature}/services/`
- Components: `onlineshopui/src/app/features/{feature}/components/`
- Types: `onlineshopui/src/app/core/types/`

**Finding configuration:**
- Backend config: `onlineshopapi/src/main/resources/application*.yml`
- Frontend config: `onlineshopui/src/environments/`
- Database schema: `onlineshopapi/src/main/resources/db/migration/`

## Reference Documentation

For deeper architectural details, consult `docs/ARCHITECTURE.md` which contains:
- Complete data model with all entity relationships
- Detailed API endpoint listing with request/response formats
- Full environment variable reference
- Deployment configuration
- Extension points for adding roles, strategies, and features

**When to read ARCHITECTURE.md:**
- User asks for complete API documentation
- User needs detailed database schema with all fields
- User asks about deployment or production configuration
- User asks about all available configuration options

**How to use this skill:**
Apply these patterns and principles when guiding the user. Reference specific file paths, explain the "why" behind decisions, and help them maintain consistency with existing code. When the user wants to add features, walk them through the checklist. When they're confused about structure, explain the layer or module organization. Always ground advice in this codebase's actual patterns.
