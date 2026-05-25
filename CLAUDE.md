# CLAUDE.md — Red CuyoPsi · React Native Project Guidelines

> This file instructs Claude Code on how to work within this codebase.
> Read it fully before making any changes. Follow every section strictly.

---

## 🧠 Core Principles

1. **Reuse before creating** — always search for an existing component, hook, or utility before writing a new one.
2. **One responsibility per file** — Views render, Controllers decide, Models own data. Never mix layers.
3. **Readable over clever** — prefer explicit, self-documenting code. Avoid one-liners that sacrifice clarity.
4. **Token efficiency** — keep responses focused. When modifying code, show only the changed sections with clear `// ... rest unchanged` markers.
5. **Ask before assuming** — if requirements are ambiguous, ask one clarifying question before writing code.
6. **MVC always** — every feature must map cleanly to a Model, a View, and a Controller. If a file's role is ambiguous, it's in the wrong place.

---

## 🏛️ Architecture — Model / View / Controller

This project enforces MVC at every level. Before writing any file, identify which layer it belongs to.

```
┌─────────────────────────────────────────────────────┐
│  VIEW          │  CONTROLLER       │  MODEL          │
│  What renders  │  What decides     │  What persists  │
│────────────────│───────────────────│─────────────────│
│  *.tsx Screen  │  useScreenHook.ts │  service/*.ts   │
│  components/   │  hooks/           │  store/         │
│  ui/           │  (business logic) │  types/         │
│                │                   │  utils/         │
└─────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 🟦 Model — `src/services/`, `src/store/`, `src/types/`, `src/utils/`

- Owns all data: fetching, caching, transforming, persisting.
- Has **zero knowledge** of React or UI — no imports from `react-native`.
- Services are plain async functions. Store slices hold and mutate state. Utils are pure functions.
- Types and interfaces live here and are imported upward, never downward.

```ts
// ✅ Model — services/cartService.ts
export async function addItemToCart(
  userId: string,
  item: CartItem,
): Promise<Cart> {
  const response = await api.post(`/cart/${userId}/items`, item);
  return response.data;
}
```

#### 🟨 Controller — `src/hooks/`, `src/features/[feature]/hooks/`

- The bridge between Model and View.
- Calls services, reads/writes the store, owns business logic and side effects.
- Returns only what the View needs — never exposes raw service objects or store internals.
- One controller hook per screen or major feature (`useCheckoutScreen`, `useProductList`).

```ts
// ✅ Controller — hooks/useCheckoutScreen.ts
export function useCheckoutScreen() {
  const cart = useCartStore((s) => s.cart);
  const { mutate: placeOrder, isLoading } = useMutation(placeOrderService);

  function handleConfirm() {
    placeOrder(cart);
  }

  return { cart, isLoading, handleConfirm };
}
```

#### 🟩 View — `src/components/`, `src/features/[feature]/screens/`, `src/features/[feature]/components/`

- Renders UI. Calls the controller hook. Nothing else.
- No `fetch`, no `axios`, no store reads, no business logic.
- All handlers come from the controller hook (`onPress={handleConfirm}`).
- Screen components must be **thin**: import one controller hook, spread its return values, render.

```tsx
// ✅ View — features/checkout/screens/CheckoutScreen.tsx
export function CheckoutScreen() {
  const { cart, isLoading, handleConfirm } = useCheckoutScreen(); // ← only hook call

  return (
    <View style={styles.container}>
      <CartSummary items={cart.items} />
      <Button
        label="Confirm Order"
        onPress={handleConfirm}
        loading={isLoading}
      />
    </View>
  );
}
```

### MVC Rules (strictly enforced)

- **Views never import services** — if a screen needs data, it gets it from a controller hook.
- **Controllers never import components** — hooks are UI-agnostic.
- **Models never import hooks or components** — services and utils have no React dependency.
- **One controller hook per screen** — do not call multiple unrelated hooks directly in a screen; compose them inside a single controller hook.
- **Data flows in one direction**: Model → Controller → View. Never sideways or backwards.

### MVC Layer Map (quick reference)

| File                             | Layer      | Rule                                     |
| -------------------------------- | ---------- | ---------------------------------------- |
| `screens/ProfileScreen.tsx`      | View       | Calls `useProfileScreen()`, renders only |
| `hooks/useProfileScreen.ts`      | Controller | Calls services/store, returns props      |
| `services/userService.ts`        | Model      | Fetches, transforms, returns typed data  |
| `store/userSlice.ts`             | Model      | Holds and mutates user state             |
| `utils/formatDate.ts`            | Model      | Pure transformation, no side effects     |
| `components/ui/Avatar.tsx`       | View       | Stateless, props-driven, no logic        |
| `components/shared/UserCard.tsx` | View       | Composed UI, may call 1 display hook     |

---

## 🎨 Brand Identity — Red CuyoPsi

All UI work must reflect the brand. These values are non-negotiable. Never introduce colors, fonts, or copy that contradict this section.

### Color Tokens

These are the canonical names. Always reference them via `@/constants/colors` — never hardcode hex values.

| Token name       | Role             | Hex       | Usage                                    |
| ---------------- | ---------------- | --------- | ---------------------------------------- |
| `summitBlue`     | Primary          | `#1B3A6B` | Nav bar, primary buttons, headers        |
| `summitMid`      | Primary variant  | `#2B5197` | Active states, links                     |
| `summitSoft`     | Primary tint     | `#D6E4F7` | Info backgrounds, chips                  |
| `cuyoWine`       | Secondary        | `#7A2D3B` | Icons, secondary buttons, specialties    |
| `cuyoWineSoft`   | Secondary tint   | `#F2E0E3` | Secondary backgrounds                    |
| `jarillaGreen`   | Accent / Success | `#5E7A2E` | Confirm, available slot, payment success |
| `jarillaSoft`    | Accent tint      | `#E6EDD8` | Success backgrounds                      |
| `cordilleraGray` | Background       | `#F4F4F1` | Screen backgrounds                       |
| `white`          | Surface          | `#FFFFFF` | Cards, modals, inputs                    |

```ts
// constants/colors.ts  — source of truth
export const colors = {
  summitBlue: "#1B3A6B",
  summitMid: "#2B5197",
  summitSoft: "#D6E4F7",
  cuyoWine: "#7A2D3B",
  cuyoWineSoft: "#F2E0E3",
  jarillaGreen: "#5E7A2E",
  jarillaSoft: "#E6EDD8",
  cordilleraGray: "#F4F4F1",
  white: "#FFFFFF",
  textDark: "#1A1A2E",
  textMid: "#4A4A6A",
  textMuted: "#8E8EA8",
} as const;
```

### Typography

```ts
// constants/typography.ts
export const fontFamily = {
  heading: "Poppins", // titles, screen headers, buttons, prices
  body: "Inter", // body text, labels, meta, descriptions
} as const;

export const fontSize = {
  xs: 10,
  sm: 11,
  md: 13,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  display: 24,
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
```

**Rules:**

- Poppins for all screen titles, section headers, CTAs, and monetary amounts.
- Inter for descriptions, labels, metadata, and form fields.
- Never use system fonts for branded text.

### Brand Values (inform copy and UX decisions)

- **Closeness** — technology as a human bridge, not a barrier. Avoid cold or clinical copy.
- **Confidentiality** — all patient data, session notes, and clinical history must be visually and technically treated as sensitive. Encrypt at rest; never log PII.
- **Evolution** — frame mental health as ongoing growth, not a problem to fix.
- **Simplicity** — minimize friction. Booking a session should never take more than 3 taps after finding a professional.

---

## 📱 Product — Features & Screen Map

Use this as the source of truth for what exists. Before adding a screen or flow, check it's listed here. If it isn't, ask before creating it.

### User Roles

| Role             | Key capabilities                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Patient**      | Search professionals, view profiles, book sessions, manage payments, view appointments                           |
| **Psychologist** | Manage public profile, set billing policy, access patient records, write session notes, view financial dashboard |

### Feature Map

#### 🔵 Feature: `auth`

- Login / Register (patient and psychologist)
- Role selection on onboarding

#### 🔵 Feature: `search`

Screens: `SearchScreen`, `MapScreen`

- List view: `PsychologistCard` with specialty, rate, rating, availability
- Map view: interactive pins per psychologist office (only shown if professional enabled location)
- Filters: specialty, modality (online/in-person), price range

#### 🔵 Feature: `profile` (patient-facing view of a professional)

Screen: `PsychologistProfileScreen`

- Public info: name, registration number, photo, specialties, approach, experience
- Modality: online, in-person, or both
- Location: office address + map pin (only if professional shared it)
- Rates and billing policy (100% upfront / 50% deposit / in-office)
- CTA: "Reservar turno" → navigates to `booking` feature

#### 🔵 Feature: `booking`

Screens: `CalendarScreen`, `PaymentScreen`, `ConfirmationScreen`

- Step 1 — Calendar: show available/unavailable slots per professional
- Step 2 — Payment: apply billing policy (full / 50% deposit / in-office). If payment required → redirect to payment gateway
- Step 3 — Confirmation: digital receipt, appointment saved to `appointments` store

#### 🔵 Feature: `appointments`

Screen: `AppointmentsScreen`

- Tabs: Upcoming / Past / Cancelled
- Card per appointment: professional name, date/time, modality, payment status, actions
- Actions per status: Join (online), Reschedule, Cancel, Pay deposit

#### 🔵 Feature: `patientProfile`

Screen: `PatientProfileScreen`

- Edit personal data, photo, consultation reason
- Manage saved payment methods
- Notification and privacy toggles

#### 🔵 Feature: `professionalSettings` (psychologist only)

Screen: `ProfessionalSettingsScreen`

- Edit public profile: specialties, bio, photo, rates
- Location settings: enable/disable map pin, set office address
- Billing policy selector: 100% / 50% / in-office

#### 🔵 Feature: `clinicalRecord` (psychologist only)

Screen: `PatientRecordScreen`

- Patient data: name, age, emergency contact, appointment history
- Session notes: encrypted text area, timestamped per session, chronological order
- Access only from the professional's own schedule or contact list

#### 🔵 Feature: `financialDashboard` (psychologist only)

Screen: `FinancialDashboardScreen`

- Transaction history: amount, type (deposit/full), patient name, date
- Balance summary: available for withdrawal
- Monthly statistics: paid sessions count and total income

### Navigation Structure

```
AppNavigator
├── AuthStack
│   ├── LoginScreen
│   └── RegisterScreen
└── MainTabs
    ├── Tab: Search
    │   ├── SearchScreen
    │   ├── MapScreen
    │   └── PsychologistProfileScreen → BookingStack
    │       ├── CalendarScreen
    │       ├── PaymentScreen
    │       └── ConfirmationScreen
    ├── Tab: Appointments
    │   └── AppointmentsScreen
    └── Tab: Profile
        ├── PatientProfileScreen          (patient role)
        ├── ProfessionalSettingsScreen    (professional role)
        ├── PatientRecordScreen           (professional role)
        └── FinancialDashboardScreen      (professional role)
```

---

## 📁 Project Structure

```
src/
├── app/              # Navigation, entry points, providers
├── components/
│   ├── ui/           # Primitive, stateless UI (Button, Text, Icon, Card…)
│   └── shared/       # Composed, reusable business components
├── features/         # Self-contained feature modules
│   └── [feature]/
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific hooks
│       ├── screens/      # Screen components (thin, delegate logic to hooks)
│       └── [feature].types.ts
├── hooks/            # Global shared hooks
├── services/         # API clients, storage, analytics, etc.
├── store/            # Global state (Zustand / Redux / Context)
├── utils/            # Pure helper functions
├── constants/        # Colors, spacing, sizes, routes, config keys
└── types/            # Shared TypeScript types and interfaces
```

**Rules:**

- Screens must stay thin — no business logic inline. Delegate to custom hooks.
- Feature folders are self-contained. Do not import across features directly; use shared/ or services/ as the bridge.
- Never put logic inside `index.ts` barrel files.

---

## 🧩 Component Rules

### Structure (always in this order)

```tsx
// 1. Imports
// 2. Types / Props interface
// 3. Component function
// 4. Styles (StyleSheet.create at the bottom)
```

### Template

```tsx
import React from "react";
import { View, StyleSheet } from "react-native";

import { spacing } from "@/constants/spacing";
import { useTheme } from "@/hooks/useTheme";

interface MyComponentProps {
  label: string;
  onPress?: () => void;
}

export function MyComponent({ label, onPress }: MyComponentProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
```

### Rules

- **Always name exports** — no default exports for components (aids refactoring and tree-shaking).
- **Props interface above the component**, in the same file.
- **No inline styles** — use `StyleSheet.create` or a design token.
- **No magic numbers** — use constants from `@/constants/spacing`, `@/constants/colors`, etc.
- Memoize with `React.memo` only when there is a measured performance reason.
- Keep component files **under 150 lines**. If longer, extract sub-components or hooks.

---

## 🪝 Custom Hooks

- Filename: `use[Name].ts` — never `.tsx` unless it returns JSX (avoid).
- Return a plain object `{}`, not an array, unless the hook intentionally mirrors `useState`.
- Separate concerns: one hook per domain (`useAuth`, `useCart`, not `useAuthAndCart`).

```ts
// ✅ Good
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ... logic

  return { profile, isLoading, error };
}
```

---

## 🗂️ State Management

- **Local UI state** → `useState` / `useReducer` inside the component or hook.
- **Shared feature state** → feature-level context or Zustand slice.
- **Global app state** → global Zustand store or Redux slice (decide per project, be consistent).
- **Server state** → React Query / TanStack Query. Do not store server responses in Zustand/Redux.
- Never use `useEffect` to sync two pieces of state — derive instead.

---

## 🎨 Styling Conventions

- Use a centralized theme/token system. All values come from constants:
  ```ts
  // constants/spacing.ts
  export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
  ```
- Support dark/light mode via a `useTheme()` hook — never hardcode colors in components.
- Use `Platform.select` for platform-specific styles; isolate in the style block, not in JSX.

---

## 🧪 Debuggability

- Every `console.log` used during development must be prefixed with `[DEBUG][FileName]`.
- Remove all `[DEBUG]` logs before marking a task as done.
- All async operations must have explicit error handling — no silent `.catch(() => {})`.
- Name all callbacks, even when passing inline: prefer `const handlePress = () =>` over anonymous arrows in JSX.
- Add `// TODO:` or `// FIXME:` comments with a short reason when leaving incomplete work.

---

## ✅ TypeScript Rules

- `strict: true` is assumed always on.
- No `any` — use `unknown` and narrow, or define the actual type.
- No type assertions (`as SomeType`) unless absolutely unavoidable; add a comment explaining why.
- Prefer `interface` for object shapes, `type` for unions, intersections, and utility types.
- Export types from a `*.types.ts` file when shared across more than one file.

---

## 📡 API & Services

- All API calls live in `src/services/`. Components and hooks never call `fetch`/`axios` directly.
- Each service file exports typed async functions:
  ```ts
  // services/userService.ts
  export async function fetchUserProfile(userId: string): Promise<UserProfile> { ... }
  ```
- Use React Query for data fetching. Keep query keys in a central `queryKeys.ts` file:
  ```ts
  export const queryKeys = {
    user: (id: string) => ["user", id] as const,
  };
  ```
- Handle loading, error, and empty states for **every** data-fetching hook.

---

## 🔁 Reuse Checklist (run before creating anything new)

Before writing a new component, hook, util, or service, ask:

- [ ] Does a component in `src/components/ui/` already cover this?
- [ ] Is there a shared hook in `src/hooks/` that handles this logic?
- [ ] Is there a utility in `src/utils/` for this transformation?
- [ ] Could an existing component accept a new prop to cover this case?

If **yes** to any → extend or compose. Do not duplicate.

---

## 🚫 Anti-Patterns (never do these)

| Anti-Pattern                                | Instead                                          |
| ------------------------------------------- | ------------------------------------------------ |
| View importing a service directly           | Route through a controller hook                  |
| Controller hook importing a component       | Hooks are UI-agnostic — remove the import        |
| Model (service/util) importing React        | Models have zero React dependency                |
| Multiple unrelated hooks called in a screen | Compose into one `useScreenName` controller hook |
| Logic inside a Screen component             | Extract to a `useScreenName` hook                |
| `any` type                                  | Define or narrow the type                        |
| Hardcoded colors / sizes                    | Use design tokens from constants                 |
| `useEffect` to sync state                   | Derive the value instead                         |
| Deeply nested ternaries in JSX              | Extract to a variable or sub-component           |
| Importing across feature folders            | Use `shared/` or `services/` as the bridge       |
| Default exports for components              | Use named exports                                |
| Silent error swallowing                     | Always surface or log errors explicitly          |
| Uncommitted `console.log`                   | Prefix with `[DEBUG]` or remove                  |
| Hardcoded hex color in a component          | Use `colors.*` from `@/constants/colors`         |
| Using system font for branded text          | Use Poppins (headings) or Inter (body)           |
| Building a screen not in the Feature Map    | Check the Feature Map first; ask if unsure       |

---

## 💬 Communication Protocol with Claude Code

- When asked to **add a feature**: propose the file structure first, wait for approval, then implement.
- When asked to **fix a bug**: explain the root cause in one sentence before touching any code.
- When asked to **refactor**: list what will change and what won't, then proceed.
- When showing code changes: output only the **modified sections** with surrounding context (5–10 lines). Use `// ... rest unchanged` for skipped sections.
- When unsure about scope: ask **one** clarifying question — not multiple.

---

## 📐 File & Naming Conventions

| Type       | Convention                   | Example                   |
| ---------- | ---------------------------- | ------------------------- |
| Component  | PascalCase                   | `UserAvatar.tsx`          |
| Hook       | camelCase with `use` prefix  | `useUserProfile.ts`       |
| Utility    | camelCase                    | `formatDate.ts`           |
| Service    | camelCase + `Service` suffix | `authService.ts`          |
| Types file | camelCase + `.types.ts`      | `user.types.ts`           |
| Constants  | camelCase                    | `spacing.ts`, `colors.ts` |
| Screen     | PascalCase + `Screen` suffix | `ProfileScreen.tsx`       |
| Test       | Same name + `.test.ts(x)`    | `UserAvatar.test.tsx`     |

---

## 🗄️ Database Schema

This is the canonical data model. All Django models, serializers, and TypeScript types must match it exactly. Never rename fields without updating all three layers simultaneously.

### Entity overview

| Table           | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `psychologists` | Public + operational profile of professionals      |
| `patients`      | Personal details of users booking appointments     |
| `appointments`  | Junction: patient ↔ psychologist at a date/time    |
| `session_notes` | Isolated confidential clinical records (encrypted) |
| `transactions`  | Payment gateway records                            |

### Field reference

#### `psychologists`

| Field            | Type    | Notes                               |
| ---------------- | ------- | ----------------------------------- |
| `id`             | PK      | Auto                                |
| `name`           | String  |                                     |
| `specialty`      | String  |                                     |
| `session_price`  | Decimal |                                     |
| `payment_policy` | Enum    | `TOTAL` · `50_DEPOSIT` · `EXTERNAL` |
| `address`        | String  | Optional                            |
| `latitude`       | Float   | Optional — proximity map only       |
| `longitude`      | Float   | Optional — proximity map only       |

#### `patients`

| Field   | Type   | Notes  |
| ------- | ------ | ------ |
| `id`    | PK     | Auto   |
| `name`  | String |        |
| `email` | String | Unique |
| `phone` | String |        |

#### `appointments`

| Field             | Type                 | Notes                                       |
| ----------------- | -------------------- | ------------------------------------------- |
| `id`              | PK                   | Auto                                        |
| `psychologist_id` | FK → `psychologists` |                                             |
| `patient_id`      | FK → `patients`      |                                             |
| `date_time`       | DateTime             | Always stored in UTC                        |
| `status`          | Enum                 | `PENDING` · `CONFIRMED` · `CANCELED`        |
| `payment_status`  | Enum                 | `PENDING` · `PARTIALLY_PAID` · `FULLY_PAID` |

#### `session_notes`

| Field               | Type                | Notes                                                  |
| ------------------- | ------------------- | ------------------------------------------------------ |
| `id`                | PK                  | Auto                                                   |
| `appointment_id`    | FK → `appointments` |                                                        |
| `patient_id`        | FK → `patients`     | Fast patient-history lookup                            |
| `date`              | DateTime            |                                                        |
| `encrypted_content` | Text                | Must be encrypted before write — never store plaintext |

#### `transactions`

| Field            | Type                | Notes                                |
| ---------------- | ------------------- | ------------------------------------ |
| `id`             | PK                  | Auto                                 |
| `appointment_id` | FK → `appointments` |                                      |
| `amount`         | Decimal             |                                      |
| `type`           | Enum                | `FULL_BOOKING` · `50_DEPOSIT`        |
| `status`         | Enum                | `SUCCESSFUL` · `FAILED` · `REFUNDED` |

### Design rationale (inform every decision)

- **Payment flow gate:** before confirming a booking, the app checks `psychologist.payment_policy`. If `TOTAL` or `50_DEPOSIT`, a `transactions` record with `status=SUCCESSFUL` must exist before `appointment.status` can become `CONFIRMED`.
- **Clinical isolation:** `session_notes` is intentionally separate from `appointments` to keep schedule queries lightweight and to scope encryption strictly to sensitive data.
- **Geolocation:** `latitude`/`longitude` on the psychologist record enable Haversine-based proximity queries. Only populated if the professional opts in.

---

## 🐍 Django API

The backend lives in a sibling `api/` directory at the repo root. The React Native app communicates exclusively through this API — never via direct DB access.

### Stack

- **Framework:** Django + Django REST Framework (DRF)
- **Database:** PostgreSQL (matches the schema above)
- **Python version:** 3.11+

### Directory structure

```
api/
├── manage.py
├── requirements.txt
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── apps/
    ├── psychologists/
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    ├── patients/
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    ├── appointments/
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    ├── session_notes/
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   └── urls.py
    └── transactions/
        ├── models.py
        ├── serializers.py
        ├── views.py
        └── urls.py
```

### Endpoint catalogue

All endpoints are prefixed with `/api/v1/`. No authentication is enforced yet — that is a future implementation.

#### CRUD — Psychologists

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| GET    | `/psychologists/`      | List all psychologists |
| POST   | `/psychologists/`      | Create a psychologist  |
| GET    | `/psychologists/{id}/` | Retrieve one           |
| PUT    | `/psychologists/{id}/` | Full update            |
| PATCH  | `/psychologists/{id}/` | Partial update         |
| DELETE | `/psychologists/{id}/` | Delete                 |

#### CRUD — Patients

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| GET    | `/patients/`      | List all patients |
| POST   | `/patients/`      | Create a patient  |
| GET    | `/patients/{id}/` | Retrieve one      |
| PUT    | `/patients/{id}/` | Full update       |
| PATCH  | `/patients/{id}/` | Partial update    |
| DELETE | `/patients/{id}/` | Delete            |

#### CRUD — Appointments

| Method | Endpoint              | Description                                                                     |
| ------ | --------------------- | ------------------------------------------------------------------------------- |
| GET    | `/appointments/`      | List all appointments (supports `?patient_id=` and `?psychologist_id=` filters) |
| POST   | `/appointments/`      | Create an appointment                                                           |
| GET    | `/appointments/{id}/` | Retrieve one                                                                    |
| PUT    | `/appointments/{id}/` | Full update                                                                     |
| PATCH  | `/appointments/{id}/` | Partial update                                                                  |
| DELETE | `/appointments/{id}/` | Delete                                                                          |

#### CRUD — Session Notes

| Method | Endpoint               | Description                                                   |
| ------ | ---------------------- | ------------------------------------------------------------- |
| GET    | `/session-notes/`      | List (supports `?patient_id=` and `?appointment_id=` filters) |
| POST   | `/session-notes/`      | Create a note (content must be encrypted before save)         |
| GET    | `/session-notes/{id}/` | Retrieve one                                                  |
| PUT    | `/session-notes/{id}/` | Full update                                                   |
| PATCH  | `/session-notes/{id}/` | Partial update                                                |
| DELETE | `/session-notes/{id}/` | Delete                                                        |

#### CRUD — Transactions

| Method | Endpoint              | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| GET    | `/transactions/`      | List (supports `?appointment_id=` filter) |
| POST   | `/transactions/`      | Create a transaction record               |
| GET    | `/transactions/{id}/` | Retrieve one                              |
| PUT    | `/transactions/{id}/` | Full update                               |
| PATCH  | `/transactions/{id}/` | Partial update                            |
| DELETE | `/transactions/{id}/` | Delete                                    |

#### Frontend-specific endpoints

These go beyond basic CRUD and are required for the UI flows defined in the Feature Map.

| Method | Endpoint                            | Screen that uses it        | Description                                                                                                   |
| ------ | ----------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| GET    | `/psychologists/{id}/availability/` | `CalendarScreen`           | Returns available time slots for a given date range. Query params: `?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD` |
| GET    | `/psychologists/{id}/transactions/` | `FinancialDashboardScreen` | All transactions for a professional's appointments. Supports `?month=YYYY-MM`                                 |
| GET    | `/patients/{id}/appointments/`      | `AppointmentsScreen`       | All appointments for a patient. Supports `?status=PENDING\|CONFIRMED\|CANCELED`                               |
| GET    | `/patients/{id}/session-notes/`     | `PatientRecordScreen`      | Full clinical history for a patient, ordered by `date` descending                                             |
| PATCH  | `/appointments/{id}/cancel/`        | `AppointmentsScreen`       | Sets `status=CANCELED`. Does not delete the record                                                            |
| PATCH  | `/appointments/{id}/confirm/`       | Booking flow               | Sets `status=CONFIRMED`. Only valid if payment policy allows it                                               |

### Deferred endpoints (stubbed — not implemented yet)

These endpoints **must exist** in the router and return `HTTP 501 Not Implemented` with a `{"detail": "Not implemented yet"}` body. They are present so the frontend can call them without crashing.

| Method | Endpoint                 | Deferred reason                               |
| ------ | ------------------------ | --------------------------------------------- |
| POST   | `/payments/initiate/`    | Payment gateway integration — future sprint   |
| POST   | `/payments/webhook/`     | Payment gateway callback — future sprint      |
| GET    | `/psychologists/nearby/` | Geolocation / Haversine query — future sprint |

```python
# Example stub view
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def payments_initiate(request):
    return Response(
        {"detail": "Not implemented yet"},
        status=status.HTTP_501_NOT_IMPLEMENTED
    )
```

### Django coding rules

- **One app per entity** — never put two unrelated models in the same Django app.
- **ModelViewSet for CRUD** — use `ModelViewSet` + `DefaultRouter` for all standard CRUD. Only write custom `APIView` or `@api_view` for non-CRUD actions (like `/cancel/`, `/confirm/`, stubs).
- **Serializers own validation** — all field validation lives in the serializer, never in the view.
- **Enums as `TextChoices`** — define all enum fields using Django's `models.TextChoices` so choices are enforced at the model level.
- **`encrypted_content` rule** — the `session_notes.encrypted_content` field must be encrypted/decrypted in the serializer's `create`/`update`/`to_representation` methods. Never store or return plaintext. Use `cryptography.fernet` or equivalent.
- **UTC everywhere** — `USE_TZ = True` in settings. All `DateTimeField`s store UTC. Never apply timezone conversion in models or serializers — that is the frontend's responsibility.
- **No business logic in views** — views route requests and return responses. Logic (e.g. checking `payment_policy` before confirming) lives in a service function in `apps/[entity]/services.py`.
- **Consistent error shape** — all errors return `{"detail": "<message>"}` for single errors or `{"field": ["<message>"]}` for validation errors. Never return raw exceptions.

### `requirements.txt` baseline

```
django>=4.2
djangorestframework>=3.15
psycopg2-binary>=2.9
cryptography>=42.0
django-filter>=23.0
python-decouple>=3.8
```

### Frontend ↔ API contract (TypeScript types must mirror these)

Every TypeScript interface in `src/types/` must exactly match the API response shape. When the API changes a field name or type, update the TypeScript type in the same commit.

```ts
// types/psychologist.types.ts
export interface Psychologist {
  id: number;
  name: string;
  specialty: string;
  session_price: string; // Decimal serialized as string by DRF
  payment_policy: "TOTAL" | "50_DEPOSIT" | "EXTERNAL";
  address?: string;
  latitude?: number;
  longitude?: number;
}

// types/appointment.types.ts
export interface Appointment {
  id: number;
  psychologist_id: number;
  patient_id: number;
  date_time: string; // ISO 8601 UTC string
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  payment_status: "PENDING" | "PARTIALLY_PAID" | "FULLY_PAID";
}
```

---

## 🧹 Before Marking Any Task Done

- [ ] No `any` types introduced.
- [ ] No hardcoded colors, sizes, or strings.
- [ ] No `[DEBUG]` logs left in code.
- [ ] New components follow the template structure.
- [ ] New logic lives in a hook or service, not inline in a component.
- [ ] MVC layers respected: View → Controller → Model. No cross-layer imports.
- [ ] Reuse checklist was considered.
- [ ] TypeScript compiles without errors.
- [ ] Code reads clearly without needing inline comments to explain _what_ (only _why_).
- [ ] All colors come from `@/constants/colors` — no hex hardcoded.
- [ ] New screen is listed in the Feature Map above.
- [ ] **API:** new endpoint is listed in the catalogue above.
- [ ] **API:** no business logic in views — lives in `services.py`.
- [ ] **API:** `session_notes.encrypted_content` is never stored or returned as plaintext.
- [ ] **API:** deferred features return `HTTP 501`, not `404` or an error.
