# AGENTS.md — Rules for AI Agents Working on This Project

You are an expert Senior / Staff Frontend Engineer specializing in **Vue 3**, **Vite**, **TypeScript**, and **Tailwind CSS**. You write clean, scalable, maintainable, and enterprise-grade code.

Follow these binding rules for every change you make in this repository.

---

## 0. Before Starting Any Task — Read These Files First

Every agent MUST read, in this order, before writing any code:

1. **`OVERVIEW.md`** (repo root) — The status snapshot: what is done, what is in progress, what is queued next. Pick up context from it and keep it updated when your task changes the project state.
2. **This file (`AGENTS.md`)** — The rules below are strictly binding.
3. **The target feature's `integrate.md`** (if it exists) — The API contract for that feature (e.g. `src/features/profile/integrate.md`).
4. **The files you are about to modify** — Check surrounding code and conventions first; never assume patterns that you have not read.

If the task touches a shared layer (`src/shared/ui`, `src/shared/composables`, `src/shared/icons`, i18n), re-read §2 before implementing.

---

## 1. Project Architecture & Directory Structure (Vertical Slices)

This project strictly follows a **Feature-Driven Architecture (Vertical Slices)**:

```
src/
├── core/                   # App shell: router, layouts (AuthLayout, DashboardLayout), api client, plugins
├── shared/                 # Truly reusable, domain-agnostic UI and helpers
│   ├── ui/                 # Core UI primitives (UButton, UInput, UModal, UDataTable, etc.)
│   ├── components/         # Cross-feature shared domain sections (CaseAttachmentsCard, etc.)
│   ├── composables/        # Shared composables (useDataTable, useConfirm, useDropdown, etc.)
│   ├── icons/              # SVG icon components (imported via ?component)
│   ├── i18n/               # Locales (ar.json, en.json)
│   ├── utils/              # Helper utilities
│   └── types/              # Global shared TypeScript definitions
├── features/               # Domain-driven feature modules (Vertical Slices)
│   └── <feature-name>/     # e.g. assistance, beneficiaries, profile, settings
│       ├── views/          # Main view-level components (Thin views focused on layout)
│       ├── components/     # Feature-scoped components (NOT shared globally)
│       ├── composables/    # Feature-specific business logic & state
│       ├── store/          # Pinia store & data mappers
│       ├── services/       # API service calls
│       ├── mock/           # Mock data fixtures & handlers (while endpoint is pending)
│       ├── types.ts        # Feature DTOs and TypeScript interfaces
│       ├── constants.ts    # Feature endpoints, mock flags, and constants
│       ├── routes.ts       # Feature route definitions
│       └── index.ts        # Feature barrel export
```

### Architectural Rules:

- **Thin Views, Fat Composables:** Views must remain focused on layout and template structure. Move state, validation, calculations, and mutations into dedicated composables (`use<Feature>.ts`) or Pinia stores.
- **Feature Encapsulation:** Any sub-component, type, or composable specific to a single domain must stay inside `src/features/<feature-name>/`.
- **Cross-Feature Reuse:** If domain sections are reused across multiple features, place them in `src/shared/components/` (barrel exported in `index.ts`). Generic, domain-agnostic UI belongs exclusively in `src/shared/ui/`.
- **Path Aliases:** Always use configured aliases: `@` → `src`, `@shared`, `@core`, `@features`, `@assets`, `@dashboard`.

---

## 2. Always Reuse Shared Helpers — Never Reinvent

Before writing any UI markup or logic, **check `src/shared/` for an existing helper**. If one exists, you MUST use it. Never duplicate logic or recreate primitive UI.

### Shared UI Components (`src/shared/ui`)

Never write raw `<button>`, `<input>`, tables, modals, pagination, etc. — always use the shared components:

| Need                      | Component                                 | Notes                                                                                |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| Button                    | `UButton`                                 | `variant` (primary/secondary/outline/ghost), `size`, `loading`, `block`              |
| Text input                | `UInput`                                  | label, hint, error, clearable, loading, `#prefix`/`#suffix` slots                    |
| Password input            | `UPasswordInput`                          | built-in eye/eye-off reveal toggle                                                   |
| File picker               | `UFilePicker`                             | `label`, `accept`; emits the selected `File`                                         |
| Select                    | `USelect`                                 | searchable, multiple, keyboard navigation                                            |
| Checkbox / Switch / Radio | `UCheckbox` / `URadio` / `USwitch`        | Form controls                                                                        |
| Date picker               | `UDatePicker`                             | Date selection                                                                       |
| Modal / Dialog            | `UModal`                                  | `v-model` open state, `title`, sizes, `#footer` slot; backdrop click never closes it |
| Confirm dialog            | `UConfirmDialog` + `useConfirm`           | Programmatic confirmation dialog; host mounted in `App.vue`                          |
| Success result dialog     | `USuccessAlert` + `useSweetResult`        | Green-tick result dialog; host mounted in `App.vue`                                  |
| Approve value modal       | `ApproveValueModal`                       | Reusable approve dialog (value input + optional reason)                              |
| Map location picker       | `LocationPicker` / `LocationPickerDialog` | Leaflet map with draggable pin                                                       |
| Data table                | `UDataTable`                              | columns, search, filters, pagination, row actions                                    |
| Load error state          | `UErrorState`                             | message + retry button; renders nothing when message is empty                        |
| Load spinner state        | `ULoadingState`                           | spinner + loading text; `card` prop for rounded card                                 |
| Empty state               | `UEmptyState`                             | inbox illustration + empty message                                                   |
| Pagination                | `UPagination`                             | windowed page numbers                                                                |
| Row actions menu          | `URowActions`                             | teleport-based dropdown menu                                                         |
| Badge                     | `UBadge`                                  | `variant`, `dot`, `size`                                                             |
| Breadcrumbs               | `UBreadcrumbs`                            | RTL-aware breadcrumb trail                                                           |
| Tabs                      | `UTabs`                                   | pill-style tab bar; `tabs` (`{ key, label }[]`), `v-model` active key                |

**Strict Rule on Buttons:** No raw `<button>` in feature code — always `UButton`. The only native `<button>` elements allowed are inside dropdown/combobox triggers within `src/shared/ui` internals.

### Shared Composables (`src/shared/composables`)

Never hand-roll common state logic. Reuse: `useDropdown`, `useDataTable`, `useInfiniteScroll`, `usePagination`, `useStatusConfig`, `useConfirm`.

- `useDataTable` provides `patchRow(key, patch)` and `removeRow(key)` — use them to mutate the table in-place after edits/deletes rather than refetching the entire list.

### Shared Icons (`src/shared/icons`)

- Never inline `<svg>` icons directly in templates (data-driven dynamic charts are the only exception).
- Each icon is an `.svg` file imported via `?component` in `src/shared/icons/index.ts` and exported from the barrel.
- Adding a new icon? Add the `.svg` to `src/shared/icons/`, register it in the barrel, and use it across components.

---

## 3. Data Flow, API Integration & Mock Pattern

### Pinia & API Client

- Centralize API calls through the HTTP client in `src/core/api` inside feature service files (`src/features/<feature>/services/index.ts`).
- Never make raw `fetch` or `axios` calls scattered inside Vue component templates or scripts.

### Mock Data Pattern (List Features)

While a backend endpoint is not yet live, follow the standardized mock pattern — never hardcode static rows directly in views:

1. `constants.ts`: Set `USE_<FEATURE>_MOCK = true` and define `_<FEATURE>_API_ENDPOINTS`.
2. `mock/index.ts`: Shape raw backend envelopes (snake_case) and provide simulated fetchers with small latency.
3. `services/index.ts`: Return `mockCall(...)` when `USE_<FEATURE>_MOCK` is active, otherwise call the API client.
4. `store/index.ts`: Map snake_case raw responses to camelCase domain models (`map<Thing>`) and export fetchers.
5. When the backend endpoint goes live: Flip `USE_<FEATURE>_MOCK = false` — no component code changes.

### API Integration Documentation

Every feature consuming APIs must maintain an `integrate.md` documenting: endpoint URL, HTTP method, request payload, response structure (exact snake_case field names + types), and enum values.

---

## 4. Component Architecture & Vue 3 Best Practices

- **Composition API Exclusively:** Always use `<script setup lang="ts">`. Never use the Options API.
- **Strict DRY Principle:** If a layout block, card pattern, or logic is repeated, extract it into a focused, reusable component.
- **Single Responsibility:** Keep components small, focused, and maintainable.
- **Zero Native Alerts:** Never use native `window.alert()` or `window.confirm()`. Always use `useConfirm()` / `UConfirmDialog` or `showSuccessAlert()`.
- **Modal Row Actions:** Table row actions (edit/delete) should trigger `UModal` forms or `useConfirm()` dialogs rather than full-page navigation, unless a dedicated page is explicitly designed.

---

## 5. TypeScript Strictness

- **No `any`:** Avoid `any` at all costs. Use `unknown` with type guards, generics, or precise interfaces.
- **Explicit Typing for Props and Emits:**

```vue
<script setup lang="ts">
interface Props {
  title: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
});

const emit = defineEmits<{
  (e: "submit", payload: { id: string }): void;
  (e: "close"): void;
}>();
</script>
```

- **Type Extraction:** Shared models live in `src/shared/types/` and domain models in `src/features/<feature>/types.ts`.

---

## 6. Styling, Tailwind CSS & RTL Support

- **Utility-First:** Use Tailwind CSS utility classes directly in templates. Avoid raw `<style>` blocks.
- **Theme Tokens Over Hex:** Always use theme tokens defined in `tailwind.config.ts` (`primary`, `primary-dark`, `primary-soft`, `ink`, `muted`, `surface`) instead of raw hex values.
- **RTL & Logical Properties:** For robust Arabic (RTL) and English (LTR) support, always prefer Tailwind logical properties:
  - Use `ms-*` / `me-*` instead of `ml-*` / `mr-*`
  - Use `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
  - Use `text-start` / `text-end` instead of `text-left` / `text-right`
- **Responsive Design:** Mobile-first approach (`w-full md:w-1/2 lg:w-1/3`).

---

## 7. Internationalization (i18n)

- **Zero Hardcoded Strings:** Never hardcode user-facing text in templates or scripts.
  - In templates: Use `$t('path.key')`.
  - In scripts: Use `const { t } = useI18n()` and `t('path.key')`.
- **Dual Locale Synchronization:** Always add translation keys to **both** `src/shared/i18n/locales/ar.json` and `en.json`.
- **Dynamic Constants/Dropdowns:** When static options or step titles are defined in scripts, wrap labels in `computed()` with translation calls:

```ts
// ❌ WRONG:
const steps = [{ title: "Personal Info" }, { title: "Payment" }];

// ✅ CORRECT:
const steps = computed(() => [
  { title: t("checkout.steps.personal_info") },
  { title: t("checkout.steps.payment") },
]);
```

---

## 8. Dependency Management & Protected Configs

- **Zero Unsolicited Packages:** DO NOT install or suggest adding new `npm` packages unless explicitly instructed by the user. Use Vue 3 primitives, existing libraries in `package.json`, and native Web APIs.
- **Protected Config Files:** Never edit project config files (`vite.config.ts`, `package.json`, `tsconfig.json`, CI pipelines) without explicit user permission.

---

## 9. Code Hygiene & Output Integrity

- **Surgical Edits:** Only modify code directly related to the user's task. Do not refactor unrelated code.
- **Complete Code (No Placeholders):** Never produce truncated code containing comments like `// ... rest of code unchanged`. Always output complete, fully copy-pasteable blocks.
- **Clean Up Debugging:** Remove all temporary `console.log` statements, commented-out dead code, and test traces before completing a task.
- **Build Verification:** After making changes, run `npm run build` (`vue-tsc + vite build`) to ensure type safety and build integrity.
- **Status Tracking:** Always update `OVERVIEW.md` (repo root) when your changes complete, progress, or alter feature tasks.
