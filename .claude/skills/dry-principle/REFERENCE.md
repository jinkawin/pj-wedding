# DRY Principle — Reference Examples

Detailed before/after code examples for the DRY principle. This file is NOT auto-loaded into agent context. Read it only when you need concrete examples.

---

## 1. Helper Functions

**Problem:** The same check or operation is repeated across multiple methods.

**Before (WET):**
```typescript
class UserService {
  deleteUser(user: User): void {
    if (user.isAdmin) {
      console.log('Admin user cannot be deleted');
    } else {
      console.log('User deleted');
    }
  }

  updateUser(user: User): void {
    if (user.isAdmin) {
      console.log('Updating admin user');
    } else {
      console.log('Updating regular user');
    }
  }
}
```

**After (DRY):**
```typescript
interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

function isAdmin(user: User): boolean {
  return user.isAdmin;
}

class UserService {
  deleteUser(user: User): void {
    if (isAdmin(user)) {
      console.log('Admin user cannot be deleted');
    } else {
      console.log('User deleted');
    }
  }

  updateUser(user: User): void {
    if (isAdmin(user)) {
      console.log('Updating admin user');
    } else {
      console.log('Updating regular user');
    }
  }
}
```

**Why:** If the definition of "admin" changes (e.g. checking a role enum instead of a boolean), update `isAdmin()` in one place only.

---

## 2. Constants and Configurations

**Problem:** A string, number, or config value is hardcoded in multiple methods.

**Before (WET):**
```typescript
class ProductService {
  getProductDescription(id: number): string {
    return `Product ID: ${id}, Description of product`;
  }

  getProductCategory(id: number): string {
    return `Product ID: ${id}, Category of product`;
  }
}
```

**After (DRY):**
```typescript
const ENTITY_NAME = 'product';

class ProductService {
  getProductDescription(id: number): string {
    return `Product ID: ${id}, Description of ${ENTITY_NAME}`;
  }

  getProductCategory(id: number): string {
    return `Product ID: ${id}, Category of ${ENTITY_NAME}`;
  }
}
```

---

## 3. Options Objects

**Problem:** Functions with many positional parameters are hard to read and easy to misorder.

**Before (WET):**
```typescript
function createVehicle(
  type: string,
  color: string,
  wheels: number,
  fuel: string,
  power: number
): string {
  return `Created a ${type}, color: ${color}, with ${wheels} wheels, fuel: ${fuel}, power: ${power}hp.`;
}

const v = createVehicle('car', 'blue', 4, 'gas', 100); // easy to mix up order
```

**After (DRY):**
```typescript
interface VehicleOptions {
  type: string;
  color: string;
  wheels: number;
  fuel: string;
  power: number;
}

function createVehicle(options: VehicleOptions): string {
  return `Created a ${options.type}, color: ${options.color}, with ${options.wheels} wheels, fuel: ${options.fuel}, power: ${options.power}hp.`;
}

const v = createVehicle({ type: 'car', color: 'blue', wheels: 4, fuel: 'gas', power: 100 });
```

---

## 4. Inheritance and Generics

**Problem:** Two or more services implement nearly identical CRUD operations.

**Before (WET):**
```typescript
interface Product { id: number; name: string; }
interface Feedback { id: number; content: string; }

class ProductService {
  createProduct(product: Product): void { /* ... */ }
  readProduct(id: number): Product { return { id, name: 'Sample' }; }
}

class FeedbackService {
  createFeedback(feedback: Feedback): void { /* ... */ }
  readFeedback(id: number): Feedback { return { id, content: 'Sample' }; }
}
```

**After (DRY):**
```typescript
interface Identifiable {
  id: number;
}

class CRUDService<T extends Identifiable> {
  create(entity: T): void { /* Generic implementation */ }
  read(id: number): T { return { id } as T; }
  update(entity: T): void { /* Generic implementation */ }
  delete(id: number): void { /* Generic implementation */ }
}

class ProductService extends CRUDService<Product> {
  // Product-specific logic only
}

class FeedbackService extends CRUDService<Feedback> {
  // Feedback-specific logic only
}
```

---

## 5. Shared Modules

**Problem:** Same utility duplicated on client and server.

**Before (WET):**
```typescript
// client.ts
function passwordIsValid(password: string): boolean {
  return password.length >= 6;
}

// server.ts
function passwordIsValid(password: string): boolean {
  return password.length >= 6;
}
```

**After (DRY):**
```typescript
// shared/validation.ts
export function passwordIsValid(password: string): boolean {
  return password.length >= 6;
}

// client.ts & server.ts
import { passwordIsValid } from './shared/validation';
```

---

## Syntax vs Knowledge Duplication

| Type | Description | DRY Violation? |
|---|---|---|
| **Syntax duplication** | Same code structure (e.g. a `for` loop) in multiple places serving different purposes | ❌ No |
| **Knowledge duplication** | Same business rule or domain logic encoded in multiple places | ✅ Yes |

**Knowledge duplication — must fix:**
```typescript
// BAD: same business rule in two places
function validateUserForDiscount(user: User): boolean {
  return user.age > 18 && user.hasLoyaltyCard && user.purchaseHistory.length > 5;
}

function validateUserForPremium(user: User): boolean {
  return user.age > 18 && user.hasLoyaltyCard && user.purchaseHistory.length > 5;
}

// GOOD: centralized rule
function isEligibleForSpecialServices(user: User): boolean {
  return user.age > 18 && user.hasLoyaltyCard && user.purchaseHistory.length > 5;
}
```

---

## Sources

- GeeksforGeeks — *DRY Principle in Software Development*: https://www.geeksforgeeks.org/software-engineering/dont-repeat-yourselfdry-in-software-development/
- Kyiv Tech / Medium — *Advanced Guide on DRY and WET Principles in TypeScript*: https://kyiv-tech.medium.com/advanced-guide-on-dry-and-wet-principles-in-typescript-a9cc82eb3d64
