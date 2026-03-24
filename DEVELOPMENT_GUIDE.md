# NeoBot ERP — Development Guide

Complete reference for developing new modules in the NeoBot ERP system. Read this before building any new feature.

---

## System Overview

NeoBot ERP is a **multi-tenant SaaS** ERP platform. One database serves all tenants. Each tenant purchases modules (Trading, Restaurant, Retail, etc.) and gets isolated data, users, roles, and custom fields.

```
┌─────────────────────────────────────────────────────────────┐
│                    NeoBot ERP Platform                         │
│                                                             │
│  SuperAdmin (tenantId=null)                                 │
│  ├── Manages tenants (create/suspend/delete)                │
│  ├── Manages own staff (users/roles)                        │
│  └── Platform dashboard (tenant stats)                      │
│                                                             │
│  Tenant Admin (tenantId="abc", isTenantAdmin=true)          │
│  ├── Uses purchased modules (Trading, HRM, etc.)       │
│  ├── Manages staff users (up to maxUsers)                   │
│  ├── Creates roles with permission checkboxes               │
│  ├── Configures module settings (categories, units)         │
│  └── Defines custom fields for entities                     │
│                                                             │
│  Tenant User (tenantId="abc", isTenantAdmin=false)          │
│  └── Uses assigned permissions only                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 18 + TypeScript + Vite                |
| UI       | Tailwind CSS + lucide-react                 |
| Table    | TanStack React Table                        |
| Forms    | react-hook-form + Zod + FormFieldsGenerator |
| State    | Zustand (auth, theme)                       |
| Backend  | NestJS + TypeScript                         |
| Database | PostgreSQL 16                               |
| ORM      | Prisma                                      |
| Auth     | JWT + Passport                              |
| Monorepo | pnpm workspaces + Turborepo                 |

---

## Project Structure

```
apps/
├── api/                              # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma            # 20+ models
│   │   └── seed.ts                  # Users, roles, permissions, products, units
│   └── src/
│       ├── common/
│       │   ├── guards/              # JwtAuthGuard, PermissionsGuard, SuperAdminGuard
│       │   ├── decorators/          # @RequirePermissions(), @CurrentUser()
│       │   └── interceptors/        # Response transform
│       └── modules/
│           ├── auth/                # Login, Register, JWT
│           ├── users/               # User CRUD (tenant-scoped)
│           ├── roles/               # Role CRUD + permission matrix
│           ├── tenants/             # Tenant CRUD (SuperAdmin only)
│           ├── custom-fields/       # Custom field definitions
│           ├── trading/        # Business module
│           │   ├── products/        # Full CRUD + import/export
│           │   └── settings/        # Categories, Units
│           └── hrm/                 # HRM module
│               ├── employees/       # Employee CRUD + positions
│               ├── attendance/      # Manual attendance + bulk + summary
│               ├── advances/        # Employee advance payments
│               └── payroll/         # Weekly payroll generate/confirm/pay
│
├── mobile/                            # Employee Mobile App (React + Capacitor)
│   ├── capacitor.config.ts          # Capacitor config (appId, webDir)
│   └── src/
│       ├── pages/                   # LoginPage, HomePage, HistoryPage, ProfilePage, LeavePage, OvertimePage
│       ├── components/              # BottomNav
│       ├── stores/                  # authStore (zustand + persist)
│       └── utils/                   # api.ts, geolocation.ts
│
├── marketing/                         # Marketing Website (Next.js 15)
│   └── src/
│       ├── app/                     # Pages: /, /features, /pricing, /about, /contact
│       └── components/              # Navbar, Footer, SectionHeading
│
├── web/                              # React Frontend
│   └── src/
│       ├── layouts/                 # MainLayout, Sidebar, Header
│       ├── routes/                  # ProtectedRoute, PermissionRoute
│       ├── stores/                  # authStore, themeStore
│       ├── shared/
│       │   ├── hooks/               # useAuth, usePermission, useApi, useUrlParams
│       │   ├── utils/               # Axios instance
│       │   └── components/          # DataTable, FilterBar, Drawer, Dialog,
│       │                            # Toast, TabBar, Button, Form/*, TableCells
│       ├── modules/
│       │   ├── auth/                # Login page
│       │   ├── trading/        # Dashboard, Products, etc.
│       │   ├── hrm/                 # Employees, Attendance, Advances, Payroll
│       │   ├── tenants/             # Tenant management + Platform Dashboard
│       │   └── settings/            # Users, Roles, Trading Settings
│       └── types/
```

---

## Data Isolation Pattern

**Every query is scoped by `tenantId`**. This is the most important pattern in the system.

### Backend

```typescript
// Controller — extracts tenantId from JWT
@Get()
findAll(@Query() query: QueryDto, @CurrentUser() user: any) {
  return this.service.findAll(query, user.tenantId);  // ← pass tenantId
}

// Service — filters ALL queries by tenantId
async findAll(query: QueryDto, tenantId: string | null) {
  const where = { tenantId, ...otherFilters };        // ← always filter
  return this.prisma.product.findMany({ where });
}

// Create — sets tenantId on new records
async create(dto: CreateDto, tenantId: string | null) {
  return this.prisma.product.create({
    data: { ...dto, tenantId },                       // ← always set
  });
}
```

### Tables with tenantId

Every business table must include `tenantId`:

- Product, Category, Unit, Inventory, Warehouse
- Sale, SaleItem, Customer
- Purchase, PurchaseItem, Supplier
- Project, ProjectMaterial
- HrmEmployee, HrmAttendance, HrmEmployeeAdvance, HrmPayroll
- User, Role, CustomFieldDefinition

---

## Permission System

### Permission Format

```
{module}.{resource}.{action}

Examples:
  trading.products.read
  trading.products.create
  trading.settings.update
  settings.users.delete
  tenants.read (SuperAdmin only)
```

### Backend Usage

```typescript
@Controller("trading/products")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductsController {
  @Get()
  @RequirePermissions("trading.products.read")
  findAll(@Query() query: QueryDto, @CurrentUser() user: any) {
    return this.service.findAll(query, user.tenantId);
  }

  @Post()
  @RequirePermissions("trading.products.create")
  create(@Body() dto: CreateDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.tenantId);
  }
}
```

### Frontend Usage

```typescript
// Permission hook
const { hasPermission } = usePermission();
const canCreate = hasPermission("trading.products.create");
const canUpdate = hasPermission("trading.products.update");
const canDelete = hasPermission("trading.products.delete");

// Hide/show UI elements
actions={canCreate ? <Button onClick={handleAdd}>Add</Button> : undefined}
onImport={canCreate ? () => setImportOpen(true) : undefined}
onExport={canCreate || canUpdate ? () => setExportOpen(true) : undefined}

// Conditional table columns
...((canUpdate || canDelete) ? [actionsColumn] : [])

// Route protection
<PermissionRoute permission="trading.products.read">
  <ProductsPage />
</PermissionRoute>
```

### Sidebar — Permission Filtering

Sidebar modules and submenus are **automatically hidden** when user lacks permissions:

```typescript
const visibleModules = moduleConfig.filter(
  (m) =>
    m.subMenus.length === 0 ||
    m.subMenus.some((sub) => hasPermission(sub.permission)),
);
```

---

## Module Pattern (How to Build a New Module)

This section describes exactly how to create a new CRUD module. Follow the Products module as the reference.

### Step 1: Database Schema

```prisma
model YourModel {
  id         String   @id @default(cuid())
  name       String
  // ... your fields
  tenantId   String?                          // ← REQUIRED for data isolation
  moduleType String   @default("your-module") // ← if shared across modules
  metadata   Json?    @db.JsonB               // ← for custom fields support
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  tenant     Tenant?  @relation(fields: [tenantId], references: [id])

  @@map("your_models")
}
```

Add relation to Tenant model:

```prisma
model Tenant {
  // ... existing relations
  yourModels YourModel[]
}
```

### Step 2: Backend DTOs

```
apps/api/src/modules/{module}/dto/
├── create-item.dto.ts    # Required fields + @IsNotEmpty()
├── update-item.dto.ts    # All fields @IsOptional()
└── query-item.dto.ts     # search, page, limit, sortBy, sortOrder + custom filters
```

**Create DTO:**

```typescript
export class CreateItemDto {
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() price: number;
  @IsOptional() description?: string;
  @IsOptional() metadata?: Record<string, any>; // ← for custom fields
}
```

**Query DTO:**

```typescript
export class QueryItemDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Type(() => Number) page?: number; // default: 1
  @IsOptional() @Type(() => Number) limit?: number; // default: 20
  @IsOptional() @IsString() sortBy?: string; // default: 'createdAt'
  @IsOptional() @IsString() sortOrder?: "asc" | "desc";
}
```

### Step 3: Backend Service

```typescript
@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryItemDto, tenantId: string | null) {
    const where: Prisma.ItemWhereInput = { tenantId };

    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: "insensitive" } }];
    }

    const skip = ((query.page ?? 1) - 1) * (query.limit ?? 20);

    const [data, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        orderBy: { [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc" },
        skip,
        take: query.limit ?? 20,
      }),
      this.prisma.item.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        totalPages: Math.ceil(total / (query.limit ?? 20)),
      },
    };
  }

  async findOne(id: string, tenantId?: string | null) {
    const item = await this.prisma.item.findFirst({ where: { id, tenantId } });
    if (!item) throw new NotFoundException();
    return item;
  }

  async create(dto: CreateItemDto, tenantId: string | null) {
    return this.prisma.item.create({ data: { ...dto, tenantId } });
  }

  async update(id: string, dto: UpdateItemDto, tenantId?: string | null) {
    await this.findOne(id, tenantId);
    return this.prisma.item.update({ where: { id }, data: dto });
  }

  async remove(id: string, tenantId?: string | null) {
    await this.findOne(id, tenantId);
    return this.prisma.item.delete({ where: { id } });
  }
}
```

### Step 4: Backend Controller

```typescript
@Controller('your-module/items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get()
  @RequirePermissions('your-module.items.read')
  findAll(@Query() query: QueryItemDto, @CurrentUser() user: any) {
    return this.service.findAll(query, user.tenantId);
  }

  // IMPORTANT: specific routes BEFORE /:id
  @Get('export')
  @SkipTransform()
  @RequirePermissions('your-module.items.read')
  export(...) { }

  @Get(':id')
  @RequirePermissions('your-module.items.read')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.tenantId);
  }

  @Post()
  @RequirePermissions('your-module.items.create')
  create(@Body() dto: CreateItemDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.tenantId);
  }

  @Put(':id')
  @RequirePermissions('your-module.items.update')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.tenantId);
  }

  @Delete(':id')
  @RequirePermissions('your-module.items.delete')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.tenantId);
  }
}
```

### Step 5: Register Module

```typescript
// items.module.ts
@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PrismaService],
  exports: [ItemsService],
})
export class ItemsModule {}

// parent-module.module.ts — register
@Module({ imports: [ItemsModule, ...] })
export class ParentModule {}
```

### Step 6: Seed Permissions

```typescript
// seed.ts — add to permissionSlugs array
{ name: 'Read Items', slug: 'your-module.items.read', type: PermissionType.MENU, moduleId: yourModule.id },
{ name: 'Create Items', slug: 'your-module.items.create', type: PermissionType.ACTION, moduleId: yourModule.id },
{ name: 'Update Items', slug: 'your-module.items.update', type: PermissionType.ACTION, moduleId: yourModule.id },
{ name: 'Delete Items', slug: 'your-module.items.delete', type: PermissionType.ACTION, moduleId: yourModule.id },
```

### Step 7: Frontend Hooks

```typescript
// hooks/useItems.ts
export interface ItemData {
  id: string;
  name: string;
  // ... fields matching API response
}

interface ItemsResponse {
  data: ItemData[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export function useItems(filters: Record<string, unknown> = {}) {
  const params = useMemo(() => {
    /* build params */
  }, [filters]);
  return useApi<ItemsResponse>({ url: "/your-module/items", params });
}

// hooks/useItemMutations.ts
export function useItemMutations() {
  const createItem = async (data) => api.post("/your-module/items", data);
  const updateItem = async (id, data) =>
    api.put(`/your-module/items/${id}`, data);
  const deleteItem = async (id) => api.delete(`/your-module/items/${id}`);
  return { loading, createItem, updateItem, deleteItem };
}
```

### Step 8: Frontend Drawer (Create/Edit Form)

```typescript
// components/ItemDrawer.tsx

// 1. Zod schema
const itemSchema = z.object({
  name: z.string().min(1, "Required"),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  metadata: z.any().optional(),      // ← for custom fields
});

// 2. Form layout
const formSchema: FormSchema = useMemo(() => {
  const sections: FormSchema = [
    {
      sectionId: 1,
      sectionLabel: "Basic Information",
      fields: [
        { name: "name", label: "Name", type: "text", required: true, fullWidth: true },
        { name: "price", label: "Price", type: "number", required: true },
        { name: "description", label: "Description", type: "textarea", fullWidth: true },
      ],
    },
  ];

  // Auto-append custom fields
  const cf = customFields ?? [];
  if (cf.length > 0) {
    sections.push({
      sectionId: "custom",
      sectionLabel: "Custom Fields",
      fields: cf.map(mapCustomField),  // ← auto-render from definitions
    });
  }

  return sections;
}, [isEdit, customFields]);

// 3. Render
<Drawer open={open} onClose={onClose} title={isEdit ? "Edit" : "Add"} footer={buttons}>
  <FormProvider {...methods}>
    <form onSubmit={handleSubmit}>
      <FormFieldsGenerator formSchema={formSchema} />
    </form>
  </FormProvider>
</Drawer>
```

### Step 9: Frontend Page

```typescript
// pages/ItemsPage.tsx
export default function ItemsPage() {
  const { hasPermission } = usePermission();
  const toast = useToast();
  const url = useUrlParams();

  const canCreate = hasPermission("your-module.items.create");
  const canUpdate = hasPermission("your-module.items.update");
  const canDelete = hasPermission("your-module.items.delete");

  // URL-synced filters
  const search = url.get("search") ?? "";
  const perPage = url.getNumber("limit", 20);

  // API data
  const { data, loading, refetch } = useItems(apiFilters);

  // Custom fields for table columns
  const { data: customFields } = useCustomFields("item", "your-module");

  // CRUD handlers with toast
  const handleSubmit = async (data, isEdit) => {
    try {
      if (isEdit) { await updateItem(id, data); toast.success("Updated"); }
      else { await createItem(data); toast.success("Created"); }
      refetch();
    } catch (err) { toast.error(err.message); }
  };

  // Columns — with custom field columns
  const columns = useMemo(() => [
    { accessorKey: "name", header: "Name", cell: ... },
    // ... static columns
    // Dynamic custom field columns
    ...(customFields ?? []).map(cf => ({
      id: `cf_${cf.fieldKey}`,
      header: cf.label,
      size: 120,
      accessorFn: (row) => row.metadata?.[cf.fieldKey] ?? "—",
      cell: ({ getValue }) => <TextCell>{String(getValue())}</TextCell>,
    })),
    // Actions column (permission-controlled)
    ...((canUpdate || canDelete) ? [actionsColumn] : []),
  ], [canUpdate, canDelete, customFields]);

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      filterBar={
        <FilterBar
          search={{ value: search, onChange: setSearch }}
          filters={filterConfigs}
          onImport={canCreate ? ... : undefined}
          onExport={canCreate || canUpdate ? ... : undefined}
          actions={canCreate ? <Button>Add</Button> : undefined}
        />
      }
    />
  );
}
```

### Server-Side Pagination (DataTable)

DataTable supports **server-side pagination** via these props:

```typescript
const currentPage = url.getNumber("page", 1);
const setPage = useCallback((p: number) => url.set({ page: p === 1 ? null : p }), [url]);

// Include page in API filters
const apiFilters = useMemo(() => ({
  limit: perPage,
  page: currentPage,  // ← pass to API
  ...otherFilters,
}), [perPage, currentPage, ...]);

<DataTable
  data={data}
  columns={columns}
  pageSize={perPage}
  onPageSizeChange={setPerPage}
  // Server pagination props:
  serverTotal={response?.meta?.total}      // ← total from API
  serverPage={currentPage}                  // ← current page (1-based)
  onServerPageChange={setPage}              // ← page change handler
  // Nested layout (e.g. inside TabBar):
  fillParent                                // ← uses h-full instead of viewport height
/>
```

**Without** server props → DataTable uses client-side pagination (TanStack Table).
**With** server props → footer shows correct total, page buttons call API for each page.

**`fillParent` prop**: Use when DataTable is inside a flex container that already constrains height (e.g. TabBar layout). Without it, DataTable uses `h-[calc(100vh-var(--height-header))]` which overflows when nested. With `fillParent`, it uses `h-full` and respects parent height.

**ALL list pages use server-side pagination**:

| Page           | API Endpoint                                     | Status |
| -------------- | ------------------------------------------------ | ------ |
| ProductsPage   | `/trading/products?page=&limit=&search=`         | ✅     |
| SuppliersPage  | `/trading/suppliers?page=&limit=&search=`        | ✅     |
| PurchasesPage  | `/trading/purchases?page=&limit=&search=`        | ✅     |
| InventoryPage  | `/trading/inventory?page=&limit=&search=`        | ✅     |
| TenantsPage    | `/tenants?page=&limit=&search=`                  | ✅     |
| UsersPage      | `/settings/users?page=&limit=&search=`           | ✅     |
| EmployeesPage  | `/hrm/employees?page=&limit=&search=`            | ✅     |
| AttendancePage | `/hrm/attendance?page=&limit=&dateFrom=&dateTo=` | ✅     |
| AdvancesPage   | `/hrm/advances?page=&limit=&status=`             | ✅     |
| PayrollPage    | `/hrm/payroll?page=&limit=&status=`              | ✅     |

### Standard Backend Pattern (All List Endpoints)

Every list endpoint follows this exact pattern:

```typescript
async findAll(query: QueryDto, tenantId: string | null) {
  const { search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
  const where: any = { tenantId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      // ... other searchable fields
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.model.findMany({ where, orderBy: { [sortBy]: sortOrder }, skip, take: limit }),
    this.prisma.model.count({ where }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
```

### Standard Frontend Pattern (All List Pages)

```typescript
// 1. URL state
const search = url.get("search") ?? "";
const perPage = url.getNumber("limit", 20);
const currentPage = url.getNumber("page", 1);

// 2. Handlers
const setSearch = useCallback((v: string) => url.set({ search: v || null, page: null }), [url]);
const setPerPage = useCallback((v: number) => url.set({ limit: v === 20 ? null : v, page: null }), [url]);
const setPage = useCallback((p: number) => url.set({ page: p === 1 ? null : p }), [url]);

// 3. API filters (include page)
const apiFilters = useMemo(() => ({
  limit: perPage, page: currentPage, search: search || undefined,
}), [search, perPage, currentPage]);

// 4. DataTable with server pagination
<DataTable
  data={response?.data ?? []}
  serverTotal={response?.meta?.total}
  serverPage={currentPage}
  onServerPageChange={setPage}
  pageSize={perPage}
  onPageSizeChange={setPerPage}
/>
```

**Key rules:**

- Search resets page to 1 (`page: null`)
- Per page change resets page to 1
- Page 1 = no URL param (`page: null`), page 2+ = `?page=2`

### Step 10: Route + Sidebar

```typescript
// routes/index.tsx
{
  path: 'your-module/items',
  element: (
    <PermissionRoute permission="your-module.items.read">
      <ItemsPage />
    </PermissionRoute>
  ),
},

// Sidebar.tsx — add to moduleConfig
{
  id: "your-module",
  title: "Your Module",
  shortLabel: "YM",
  icon: <SomeIcon size={22} />,
  subMenus: [
    { key: "items", label: "Items", path: "/your-module/items",
      permission: "your-module.items.read", icon: <Icon size={18} /> },
    // Group support:
    { key: "orders", label: "Orders", path: "/your-module/orders",
      permission: "your-module.orders.read", icon: <Icon size={18} />,
      group: "Sales" },
  ],
},
```

---

## Custom Fields Integration

Custom fields let tenants add their own fields to any entity without code changes.

### Backend

Custom fields are stored as `metadata Json? @db.JsonB` on entity tables. Field definitions live in `CustomFieldDefinition` table with `tenantId + moduleSlug + entity + fieldKey` composite unique.

### Frontend — Auto-Render in Forms

```typescript
import { useCustomFields } from "@/modules/settings/hooks/useCustomFields";

const { data: customFields } = useCustomFields("product", "trading");

// Map definition → form field
function mapCustomField(f: CustomFieldDef) {
  const base = {
    name: `metadata.${f.fieldKey}`,
    label: f.label,
    required: f.required,
  };
  switch (f.fieldType) {
    case "number":
      return { ...base, type: "number" };
    case "dropdown":
      return {
        ...base,
        type: "dropdown",
        options: f.options.map((o) => ({ label: o, value: o })),
      };
    case "date":
      return { ...base, type: "date" };
    case "toggle":
      return { ...base, type: "toggle" };
    default:
      return { ...base, type: "text" };
  }
}
```

### Frontend — Auto-Render in Table

```typescript
...(customFields ?? []).map(cf => ({
  id: `cf_${cf.fieldKey}`,
  header: cf.label,
  accessorFn: (row) => row.metadata?.[cf.fieldKey] ?? "—",
  cell: ({ getValue }) => <TextCell>{String(getValue())}</TextCell>,
})),
```

---

## Module Settings Pattern

Each module can have its own settings tab under Settings > [Module Name]:

```
Settings sidebar:
├── PLATFORM ──── (SuperAdmin only)
├── MODULE ────── (per purchased module)
│   └── Trading → TabBar: Categories | Units | Custom Fields
├── ACCOUNT ───── (everyone)
```

Settings page uses `TabBar` component + `Section` table component for inline CRUD with dialogs.

---

## Infinite Scroll Dropdown Pattern

For dropdowns with large datasets (1000+ products), use `useInfiniteOptions` hook instead of fetching all at once.

### Hook: `useInfiniteOptions`

Location: `shared/hooks/useInfiniteOptions.ts`

```typescript
import { useInfiniteOptions } from "@/shared/hooks/useInfiniteOptions";

const productInfinite = useInfiniteOptions({
  url: "/trading/products", // API endpoint (must support ?search=&page=&limit=)
  mapItem: (p) => ({
    // Map API item → dropdown option
    label: `${p.name} (${p.sku})`,
    value: p.id,
    _costPrice: p.costPrice, // Extra data (prefix with _ to avoid conflicts)
  }),
  limit: 30, // Items per page
});

// Returns:
// productInfinite.options    — current loaded options
// productInfinite.loading    — is fetching
// productInfinite.hasMore    — more pages available
// productInfinite.search     — current search value
// productInfinite.setSearch  — set search (debounced 300ms, resets to page 1)
// productInfinite.loadMore   — fetch next page (append to options)
// productInfinite.reset      — reset to page 1 (call when dropdown re-opens)
```

### FormDropdown — Async Props

```tsx
<FormDropdown
  name="productId"
  label="Product"
  options={productInfinite.options} // ← paginated options
  onSearch={productInfinite.setSearch} // ← async search (skips local filter)
  onLoadMore={productInfinite.loadMore} // ← infinite scroll trigger
  asyncLoading={productInfinite.loading} // ← shows spinner at bottom
  hasMore={productInfinite.hasMore} // ← controls scroll trigger
  searchable
/>
```

### How It Works

```
1. Dropdown opens → initial fetch (page 1, limit 30)
2. User types in search → debounce 300ms → fetch page 1 with search param
3. User scrolls to bottom → loadMore() → fetch page 2 (append to options)
4. User scrolls more → page 3, 4, ... until hasMore = false
5. Spinner shows at bottom while loading
```

### When to Use

| Scenario        | Approach                                         |
| --------------- | ------------------------------------------------ |
| < 100 options   | Static `options` array (fetch all)               |
| 100-500 options | Static with `searchable` (local filter)          |
| 500+ options    | `useInfiniteOptions` (paginated + server search) |

### FormFieldsGenerator — Async Dropdown

Async dropdown props can be passed directly in formSchema (no need for separate FormDropdown):

```typescript
const supplierInfinite = useInfiniteOptions({
  url: "/trading/suppliers",
  mapItem: (s) => ({ label: s.name, value: s.id }),
  limit: 30,
});

const formSchema: FormSchema = [
  {
    sectionId: 1,
    fields: [
      {
        name: "supplierId",
        label: "Supplier",
        type: "dropdown",
        searchable: true,
        clearable: true,
        options: supplierInfinite.options,
        onSearch: supplierInfinite.setSearch,
        onLoadMore: supplierInfinite.loadMore,
        asyncLoading: supplierInfinite.loading,
        hasMore: supplierInfinite.hasMore,
      },
    ],
  },
];
```

### Backend Requirement

The API endpoint must support these query params:

```
GET /api/trading/products?search=cement&page=1&limit=30

Response: {
  data: [...],
  meta: { total, page, limit, totalPages }
}
```

All existing list endpoints already support this format.

---

## Internationalization (i18n)

The app supports multiple languages using `i18next` + `react-i18next`.

### Setup

```
apps/web/src/
├── i18n/
│   ├── index.ts              # i18n config (init, fallback, localStorage persist)
│   └── locales/
│       ├── en.json           # English translations
│       └── my.json           # Myanmar (Burmese) translations
├── main.tsx                  # imports "./i18n" before App
```

### Supported Languages

| Code | Language          | Status            |
| ---- | ----------------- | ----------------- |
| `en` | English           | Default, complete |
| `my` | Myanmar (Burmese) | Complete          |

### How to Use in Components

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("dashboard.totalProducts")}</h1>;
}
```

### Translation Key Structure

```
common.*          — Shared buttons, labels (save, cancel, delete, search, etc.)
auth.*            — Login page
header.*          — Header UI (search placeholder, tooltips)
sidebar.*         — Module titles (Trading, HRM, LMS)
nav.*             — Submenu labels (Dashboard, Products, Invoices, etc.)
pageTitle.*       — Header page titles
dashboard.*       — Dashboard stat cards, tables
products.*        — Product CRUD
suppliers.*       — Supplier CRUD
customers.*       — Customer CRUD
purchases.*       — Purchase orders
sales.*           — Sales orders
invoices.*        — Invoices
payments.*        — Payment pages
inventory.*       — Inventory/stock
settings.*        — Trading settings
tenants.*         — Tenant management
status.*          — Status labels (Pending, Paid, Cancelled, etc.)
```

### Language Switcher

- Located in Header (Globe icon + language code)
- Toggles between `en` ↔ `my`
- Persists to `localStorage("language")`
- Auto-loads saved language on app start

### Adding a New Language

1. Create `apps/web/src/i18n/locales/{code}.json` (copy from `en.json`)
2. Add to `i18n/index.ts`:
   ```typescript
   import th from "./locales/th.json";
   // In resources:
   th: { translation: th },
   ```
3. Update language switcher in Header to support 3+ languages

### Sidebar i18n Pattern

Sidebar uses `labelKey` / `titleKey` / `groupKey` on menu items:

```typescript
{
  key: "products",
  label: "Products",            // fallback if no labelKey
  labelKey: "nav.products",     // i18n key
  group: "Sales",
  groupKey: "sales.title",      // i18n key for group header
}
```

Render: `{item.labelKey ? t(item.labelKey) : item.label}`

### Translating New Pages

When building a new page:

1. Add keys to both `en.json` and `my.json` under the appropriate namespace
2. Use `const { t } = useTranslation()` in the component
3. Replace hardcoded strings with `t("namespace.key")`
4. For dynamic values: `t("key", { count: 5 })` (if interpolation needed)

---

## Design System Rules

| Rule          | Value                                     |
| ------------- | ----------------------------------------- |
| Font          | Plus Jakarta Sans                         |
| Primary color | #2563eb (blue)                            |
| Max padding   | p-3                                       |
| Max font size | text-xl (18px)                            |
| Border radius | rounded-md (inputs), rounded-lg (cards)   |
| Icons         | lucide-react only                         |
| Colors        | Theme tokens only (never hardcode hex)    |
| Buttons       | Pill shape (rounded-full), h-10           |
| Tables        | Hover-reveal actions, skeleton loading    |
| Forms         | Schema-driven (FormFieldsGenerator + Zod) |
| Notifications | useToast() on all CRUD operations         |
| Dark mode     | Supported via CSS variables in html.dark  |

---

## Checklist for New Module

- [ ] Prisma model with `tenantId`, `metadata` JSONB
- [ ] Migration: `npx prisma db push`
- [ ] Backend DTOs (create, update, query)
- [ ] Backend Service (all queries filtered by `tenantId`)
- [ ] Backend Controller (`@CurrentUser()` + `@RequirePermissions()`)
- [ ] Backend Module (register in parent + AppModule)
- [ ] Seed: module + permissions in `seed.ts`
- [ ] Frontend hooks (useItems + useItemMutations)
- [ ] Frontend Drawer (Zod + FormFieldsGenerator + custom fields auto-render)
- [ ] Frontend Page (DataTable + FilterBar + permissions + Toast + custom field columns)
- [ ] Route in `routes/index.tsx` with `PermissionRoute`
- [ ] Sidebar entry in `moduleConfig` (with `group` if needed)
- [ ] Module settings if needed (categories, units — TabBar pattern)
- [ ] i18n keys in en.json + my.json (if translating)

---

## Completed Modules

### Trading Module

| Sub-module          | Status | Features                                                                                                                                                                                                                                                                                   |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dashboard**       | Done   | Real-time stats (products, suppliers, purchases, inventory value), pending POs, low stock alerts, recent purchases table, payment stats (total received, total made, unpaid invoices)                                                                                                      |
| **Products**        | Done   | Full CRUD, import/export (xlsx/csv), search/filter/sort, server pagination, permission-based UI, custom fields (form + table columns), tenant-scoped SKU uniqueness, optional supplier link, markup-based auto selling price (round to nearest 500)                                        |
| **Suppliers**       | Done   | Full CRUD, search, server pagination, permission-based UI, custom fields, purchase count, delete protection                                                                                                                                                                                |
| **Purchases**       | Done   | PO with line items, discount/tax (fixed/%), supplier link, status flow (PENDING→RECEIVED→stock), auto PO number (tenant-scoped), detail page, receive/cancel actions, payment tracking (paidAmount/balance), payment history on detail page, product dropdown filters by selected supplier |
| **Inventory**       | Done   | Stock view with summary cards, search/filter by status, manual adjust (add/deduct with reason), auto-update on PO receive, warehouse support                                                                                                                                               |
| **Customers**       | Done   | Full CRUD, search, server pagination, custom fields, sales count, delete protection                                                                                                                                                                                                        |
| **Sales**           | Done   | Sales Orders with line items, customer link, discount/tax (fixed/%), auto SO number, stock auto-deduct on create, cancel restores stock, complete/cancel actions, generate invoice                                                                                                         |
| **Invoices**        | Done   | Generate from completed SO, payment tracking (full/partial), auto INV number, cancel, status flow (UNPAID→PARTIAL→PAID), PDF print (react-to-print), detail page                                                                                                                           |
| **Payments**        | Done   | Payment model with audit trail, auto PAY number, Payment Received (customer→invoice) + Payment Made (supplier→purchase), advance payment support (pay before receive), payment method tracking, payment history on Invoice/Purchase detail pages                                           |
| **Sales Returns**   | Done   | Return items from completed SO, partial return support, auto RET number, stock restore, invoice amount adjustment, return history with tracking                                                                                                                                            |
| **Goods Received**  | Done   | Received PO history page, supplier filter, payment status, reuses Purchase model with status=RECEIVED filter                                                                                                                                                                               |
| **Projects**        | Done   | Full CRUD with Drawer, detail page with BOQ (Bill of Quantities), material progress tracking, budget vs spent, linked POs, status flow (PLANNING→IN_PROGRESS→COMPLETED/ON_HOLD), PO→Project link, material usedQty auto-update on PO receive                                               |
| **Reports**         | Done   | 5-tab reports (Sales, Purchases, Payments, Profit, Projects), date range filter with presets, recharts bar/pie charts, daily trend, top products, profit by product/category, project budget vs spent, CSV export                                                                          |
| **Receivable**      | Done   | Accounts receivable — unpaid invoice list, aging report (0-30/31-60/61-90/90+ days), by customer summary, aging bar chart, CSV export                                                                                                                                                      |
| **Payable**         | Done   | Accounts payable — unpaid purchase list, aging report, by supplier summary, aging bar chart, CSV export                                                                                                                                                                                    |
| **Global Search**   | Done   | Header search bar with real API, searches across Products/Customers/Suppliers/Invoices/Purchases/Projects/HRM Employees, debounced 300ms, category icons (UserCog for Employee), click navigates to detail/list page                                                                       |
| **Activity Log**    | Done   | ActivityLog model, auto-logging on all CRUD actions (Sales, Purchases, Invoices, Payments, Products, Projects, Sale Returns), fire-and-forget pattern, paginated list page with entity filter, sidebar entry                                                                               |
| **Print Templates** | Done   | PaymentReceiptTemplate, PurchaseOrderTemplate, ProjectBOQTemplate — all using React.forwardRef + react-to-print pattern                                                                                                                                                                    |

### HRM Module

| Sub-module        | Status | Features                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projects**      | Done   | HrmProject — independent from Trading Project, CRUD, name/location/description/dates, ACTIVE/COMPLETED/ON_HOLD status, worker count, search + filter                                                                                                                                                                                                                                                     |
| **Departments**   | Done   | HrmDepartment CRUD, name/description, employee count, delete protection (fails if employees assigned), linked to Employee via departmentId dropdown                                                                                                                                                                                                                                                      |
| **Employees**     | Done   | **Multi-step FormPage** (6 steps: Personal, Contact, Employment, Compensation, Bank, Settings). Comprehensive fields: personal (DOB, gender, marital status, nationality, religion, blood type), identification (NRC, passport, SSN, driving license), contact (phone, email, address, city/state/zip), emergency contact (name, relation, phone, address), employment (employee code, position, job title, employment type, department, project, join/probation/contract/resign dates), compensation (salary type daily/monthly, daily rate, monthly salary, OT hourly rate), **bank accounts (multiple, one-to-many HrmBankAccount — bank name, branch, account no, account name, isPrimary, add/remove/set-primary UI)**, settings (active toggle, notes, mobile login). List page: DataTable with ID, name, position, department, phone, type, joined, daily rate, mobile, status columns. Search by name/phone/position/employeeCode. name-click-to-edit navigates to /hrm/employees/:id/edit, Add navigates to /hrm/employees/new. Reset Password, Credentials Dialog preserved |
| **Attendance**    | Done   | Manual daily entry (FULL_DAY/HALF_DAY/ABSENT/LEAVE), overtime hours tracking, per-employee per-date unique, bulk create (upsert), hrmProjectId per record, date range filter, type + employee filter, attendance summary endpoint, Clock In/Out time columns, Source column (GPS/Manual), GPS coordinates (checkInLat/Lng, checkOutLat/Lng) |
| **Bulk Calendar** | Done   | Month grid view (rows=employees, cols=days), click cell to cycle F→H→A→L, per-row HRM project dropdown, batch save with dirty tracking, weekend highlighting, sticky employee column, month navigation, search + department/project FilterChip filters, server pagination (50/page) |
| **Leave**         | Done   | 3-tab page (Requests + Balance + Leave Types). **Leave Types**: CRUD (name, paidDaysPerYear, description). **Leave Requests**: create (employee + type + date range + auto-calc days + reason), status flow (PENDING → APPROVED/REJECTED/CANCELLED), approve/reject/cancel actions, filter by status/type. **Leave Balance**: dynamic columns per leave type, remaining/total/used per employee per year |
| **Overtime**      | Done   | 2-tab page (Requests + Summary). **Requests**: create (employee + date + hours + reason), status flow (PENDING → APPROVED/REJECTED/CANCELLED), approve/reject/cancel actions, unique per employee+date, delete blocked for approved, filter by status. **Summary**: approved OT hours grouped by employee for current month, total hours + request count |
| **Shifts**        | Done   | 2-tab page (Schedule + Shift Types). **Schedule**: week calendar view — rows=employees grouped by department, cols=Mon-Sun, color-coded shift blocks, week navigation, today highlight, legend bar, hover-to-remove. **Shift Types**: CRUD (name, startTime, endTime, description, color preview) |
| **Advances**      | Done   | Employee advance payments, deductOnPayrollId scheduling (useInfiniteOptions searchable dropdown), PENDING/DEDUCTED status, auto-recalculate payroll on link/unlink, unscheduled warning, edit/delete blocked for DEDUCTED                                                                                                                                                                                |
| **Payroll**       | Done   | Weekly payroll generation (DRAFT), auto-calculate from attendance, advance auto-deduction on confirm, rate snapshot, status flow (DRAFT→CONFIRMED→PAID), regenerate (force=true deletes DRAFT and recalculates), payslip print with daily breakdown (react-to-print), date range filter, monthly summary endpoint, bulk selection + bulk confirm/pay/delete actions                                      |
| **Reports**       | Done   | 2-tab reports (Monthly Cost + Attendance), month pill selector + year dropdown, ReportCard summary cards, employee breakdown table, CSV export                                                                                                                                                                                                                                                           |
| **Dashboard**     | Done   | HRM overview page (/hrm/dashboard). Stat cards: active employees, departments, projects, pending leave/OT/advances. Today's attendance breakdown (present/half/absent/leave). Monthly attendance chart (last 6 months, BarChart). Recent payrolls table (8 rows). Department distribution with progress bars. Month summary section (full days, half days, absences, OT hours, leave stats). API: GET /hrm/dashboard/stats (permission: hrm.dashboard.view) |

### HRM Module — Implementation Roadmap

```
Phase 1:  ✅ HRM Projects (independent CRUD — ACTIVE/COMPLETED/ON_HOLD)
Phase 2:  ✅ Departments (CRUD + employee count + linked to Employee)
Phase 3:  ✅ Employees (CRUD + daily rate + OT rate + HRM project + department assignment)
Phase 4:  ✅ Attendance (manual entry + bulk + summary + hrmProjectId + clock-in/out ready)
Phase 5:  ✅ Bulk Calendar (month grid view + click-to-cycle + per-row project + batch save)
Phase 6:  ✅ Leave (leave types + requests + approve/reject/cancel + balance per employee per year)
Phase 7:  ✅ Overtime (OT requests + approve/reject/cancel + summary per employee)
Phase 8:  ✅ Shifts (shift types + employee assignment with date range)
Phase 9:  ✅ Advances (advance payments + scheduled deduction + payroll auto-recalc)
Phase 9:  ✅ Payroll (weekly generate + regenerate + confirm + pay + payslip print + bulk actions)
Phase 10: ✅ Mobile Check-in (Capacitor app + self-service API + GPS)
Phase 11: ✅ Employee Mobile Access (auto user creation + credentials dialog + reset/change password)
Phase 12: ✅ Dashboard (HRM overview — stat cards, attendance chart, recent payrolls, department distribution)
```

### Mobile App (Employee Self-Service)

| Component         | Status | Details                                                                                                                     |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Scaffold**      | Done   | `apps/mobile` — React + Vite + Tailwind v4 + Capacitor 6, shared theme tokens                                               |
| **Auth**          | Done   | Login page, zustand persist store, JWT token management                                                                     |
| **HomePage**      | Done   | **Check In / Check Out buttons** (gradient, full-width), time display (in/out/duration), GPS coords, quick action cards (Leave, Overtime, Payslip), announcements |
| **HistoryPage**   | Done   | Paginated attendance list, duration calc, load more                                                                         |
| **LeavePage**     | Done   | Leave balance cards (remaining/total per type), 2 tabs (My Requests + New Request). **Requests**: list with status badges (PENDING/APPROVED/REJECTED/CANCELLED), type, dates, days, reason. **New Request**: leave type dropdown, start/end date pickers, auto-calc days, reason, submit → creates via self-service API. Admin approve/reject → balance auto-deducted (getBalance uses approved requests) |
| **OvertimePage**  | Done   | 2 tabs (My Requests + New Request). **Requests**: list with date, hours, status badges, reason. **New Request**: date picker, hours input, reason, submit → creates via self-service API. Admin approve/reject from web app |
| **ProfilePage**   | Done   | **Employee info editing**: contact (phone, email, address, city/state/zip), personal (DOB, gender, marital status, nationality, religion, blood type), emergency contact (name, relation, phone, address). Save button updates via `PUT /hrm/employees/me/profile`. Change password form + sign out |
| **BottomNav**     | Done   | Home + History + Profile tabs                                                                                               |
| **Geolocation**   | Done   | Capacitor Geolocation plugin wrapper, high accuracy                                                                         |
| **Self-Service API** | Done | `GET/PUT /hrm/employees/me/profile`, `GET /me/leave/types`, `GET /me/leave/balance`, `GET/POST /me/leave/requests`, `GET/POST /me/overtime/requests`, `POST /me/change-password` — all JWT-protected, no permissions needed, employee auto-resolved from userId |
| **Schema**        | Done   | GPS fields on HrmAttendance (checkInLat/Lng, checkOutLat/Lng), userId on HrmEmployee                                        |
| **Auto User**     | Done   | Employee create with "Enable Mobile Login" toggle → auto-creates User account + shows credentials dialog                    |
| **Reset Password**| Done   | Admin can reset employee password from employee list (KeyRound icon) → credentials dialog with copy buttons                 |

**Running the mobile app:**

```bash
# Dev (browser)
cd apps/mobile && pnpm dev

# Build + sync to Android
pnpm build && npx cap sync && npx cap open android

# Build + sync to iOS
pnpm build && npx cap sync && npx cap open ios
```

**Employee → Mobile Login flow:**
1. Admin creates employee with "Enable Mobile Login" toggle ON in the Employee Drawer
2. Backend auto-creates a User account (auto-generated email + random password)
3. Credentials dialog pops up with email/password + copy buttons
4. Admin shares credentials with the employee
5. Employee logs in to mobile app, can change password from Profile tab
6. If employee forgets password → Admin clicks KeyRound icon on employee row → new credentials dialog

**Important notes:**
- Set `VITE_API_URL` in `.env` to point to your API server
- CORS: API must allow `capacitor://localhost` (iOS) and `http://localhost` (Android)
- GPS permission is requested at first check-in
- Clock in/out records appear in admin's Attendance page with Clock In/Out time + Source (GPS/Manual) columns
- Same HrmAttendance table → Payroll calculates from these records automatically

**Self-Service API Endpoints (JWT-protected, no permissions, employee resolved from userId):**
```
GET    /api/hrm/employees/me/profile               # Get own employee profile (includes bankAccounts)
PUT    /api/hrm/employees/me/profile               # Update own contact/personal/emergency fields only
POST   /api/hrm/employees/me/change-password       # Change own password (oldPassword + newPassword)
GET    /api/hrm/employees/me/leave/types           # Get active leave types
GET    /api/hrm/employees/me/leave/balance         # Get own leave balance (remaining/total per type)
GET    /api/hrm/employees/me/leave/requests        # List own leave requests (paginated)
POST   /api/hrm/employees/me/leave/requests        # Create leave request (leaveTypeId, startDate, endDate, days, reason)
GET    /api/hrm/employees/me/overtime/requests     # List own OT requests (paginated)
POST   /api/hrm/employees/me/overtime/requests     # Create OT request (date, hours, reason)
```

**Leave/Overtime Approval Flow:**
1. Employee submits request from mobile app → status = PENDING
2. Admin approves/rejects from web app (/hrm/leave or /hrm/overtime)
3. On APPROVE: leave balance auto-deducted (getBalance counts APPROVED requests for the year)
4. On APPROVE (OT): approved hours counted in attendance OT summaries and payroll

**Timezone handling:**
- Prisma `@db.Date` fields store UTC midnight dates
- Backend uses `Date.UTC(year, month, date)` to construct today's date correctly (see `todayUTC()` helper in `self-attendance.controller.ts`)
- Frontend uses `dayjs.utc(date)` to parse date fields without timezone offset shifting (prevents off-by-one day bug)
- Never use `new Date().setHours(0,0,0,0)` for date-only fields — it creates local midnight which shifts when Prisma converts to UTC

### Restaurant Module

```
Phase 1:  ✅ Menu Management (categories + items + variants + toggle availability)
Phase 2:  ✅ Tables (CRUD + zones + status grid/card view + quick status toggle)
Phase 3:  ✅ Orders / POS (3-panel POS: table select + menu grid + cart → Pay Later / Pay First dual mode)
Phase 4:  ✅ Kitchen Display (KDS Kanban: 3 columns New/Cooking/Ready, item status toggle, auto-refresh 10s)
Phase 5:  ✅ Bills & Payments (create bill from order, pay endpoint, auto-complete order + release table)
Phase 6:  ✅ Dashboard (today's stats, hourly chart, top selling items, recent orders, order type/status breakdown)
Phase 7:  ✅ Ingredients & Recipes (CRUD + stock adjust IN/OUT/WASTE + recipe costing + auto-deduct on order complete)
Phase 8:  ✅ Suppliers (CRUD + ingredient count + delete protection)
Phase 9:  ✅ Shifts (open/close shift, cash count, expected vs actual, shift history + detail)
Phase 9b: ✅ Receipt Print (thermal receipt template, print after Pay First + Pay Later, bill enriched with order items)
Phase 10: ✅ Reports (Sales/Items/Profit tabs, date range presets, daily trend chart, revenue by payment/order type, top items, profit by item/category with recipe cost)
Phase 11: ✅ Settings (RestaurantSettings model — tax %, service charge %, payment mode, auto-applied to bill creation)
```

Restaurant Module — Implementation Details:

```
Database Models:
  MenuCategory: id, name, description, sortOrder, image, isActive, tenantId
  MenuItem: id, name, description, price, categoryId, image, variants (JSONB), isAvailable, isActive, tenantId
  RestaurantTable: id, name, capacity, zone, sortOrder, status (AVAILABLE/OCCUPIED/RESERVED), isActive, tenantId
  RestaurantOrder: id, orderNumber (ORD-YYYYMMDD-XXX), tableId?, orderType (DINE_IN/TAKEAWAY/DELIVERY),
    status (PENDING/PREPARING/READY/SERVED/COMPLETED/CANCELLED), customerName?, customerPhone?, note?,
    subtotal, taxAmount, serviceCharge, discountAmount, totalAmount, waiterId?, tenantId
  RestaurantOrderItem: id, orderId, menuItemId, quantity, unitPrice, variant?, note?, kdsStatus (WAITING/COOKING/DONE)
  RestaurantBill: id, billNumber (BILL-YYYYMMDD-XXX), orderId (unique), subtotal, taxAmount, serviceCharge,
    discountAmount, totalAmount, paymentMethod (CASH/TRANSFER/CREDIT), paidAmount, changeAmount, status (UNPAID/PAID/VOID)
  RestaurantSupplier: id, name, phone?, address?, note?, isActive, tenantId
  Ingredient: id, name, unit, costPerUnit, stock, lowStockAlert?, supplierId?, isActive, tenantId
  Recipe: id, menuItemId, ingredientId, quantity (per 1 item), tenantId — @@unique([menuItemId, ingredientId])
  IngredientStockLog: id, ingredientId, type (IN/OUT/ADJUST/WASTE), quantity, reason?, tenantId
  RestaurantShift: id, shiftNumber (SHIFT-YYYYMMDD-NNN), openedById, openedByName, openingCash, closingCash?,
    expectedCash?, cashDifference?, totalCashSales, totalTransferSales, totalSales, billCount, status (OPEN/CLOSED),
    note?, openedAt, closedAt?, tenantId

Backend:
  apps/api/src/modules/restaurant/
  ├── restaurant.module.ts       # Root module (MenuCategories + MenuItems + Tables + Orders + Bills + KDS + Ingredients + Recipes + Suppliers + Shifts + Dashboard)
  ├── menu-categories/           # CRUD + item count
  ├── menu-items/                # CRUD + toggle availability + variant pricing
  ├── tables/                    # CRUD + status update endpoint
  ├── orders/
  │   ├── orders.service.ts      # Auto orderNumber, price resolution, table status management, status validation
  │   └── dto/ (create-order, update-order-status, query-order)
  ├── bills/
  │   ├── bills.service.ts       # Create bill, pay bill, auto-complete order + release table
  │   └── dto/ (create-bill)
  ├── kds/
  │   └── kds.service.ts         # Active orders, item status transitions, auto READY/COMPLETED based on bill status
  ├── ingredients/
  │   ├── ingredients.service.ts # CRUD + stock adjust (IN/OUT/WASTE/ADJUST) + deductStockForOrder
  │   └── dto/ (create, update, adjust-stock, query)
  ├── recipes/
  │   ├── recipes.service.ts     # CRUD + by-item with cost calc + unique constraint [menuItemId, ingredientId]
  │   └── dto/ (create-recipe)
  ├── suppliers/
  │   ├── suppliers.service.ts   # CRUD + ingredient count + delete protection
  │   └── dto/ (create, update, query)
  └── shifts/
      ├── shifts.service.ts      # Open/close shift, auto shift number, cash reconciliation
      └── dto/ (open-shift, close-shift, query-shift)

Frontend:
  apps/web/src/modules/restaurant/
  ├── hooks/
  │   ├── useMenuCategories.ts
  │   ├── useMenuItems.ts
  │   ├── useRestaurantTables.ts
  │   ├── useOrders.ts           # useOrders + useOrder + useOrderMutations
  │   ├── useIngredients.ts      # useIngredients + useIngredientMutations (CRUD + adjustStock)
  │   ├── useRecipes.ts          # useRecipes + useRecipesByItem + useRecipeMutations
  │   ├── useRestaurantSuppliers.ts # useRestaurantSuppliers + useSupplierMutations
  │   └── useShifts.ts           # useShifts + useActiveShift + useShiftMutations
  ├── components/
  │   ├── MenuItemDrawer.tsx
  │   ├── TableDrawer.tsx
  │   ├── IngredientDrawer.tsx   # Includes supplier dropdown (useInfiniteOptions)
  │   ├── SupplierDrawer.tsx
  │   └── RestaurantReceiptTemplate.tsx  # Thermal receipt (forwardRef, @media print, 80mm width)
  └── pages/
      ├── MenuPage.tsx           # DataTable + FilterBar + availability toggle
      ├── TablesPage.tsx         # Card grid view, color-coded status, zone filter pills, quick status toggle
      ├── POSPage.tsx            # 3-panel POS with Pay Later / Pay First dual mode + receipt print
      ├── OrdersPage.tsx         # DataTable + status/type filters + cancel + Bill & Pay + receipt print
      ├── KitchenDisplayPage.tsx # KDS Kanban: 3 columns, item status toggle, Serve button for READY
      ├── IngredientsPage.tsx    # DataTable + stock adjust (IN/OUT/WASTE) dialogs + low stock alerts
      ├── RecipesPage.tsx        # Split panel: menu items (left) + recipe detail with cost/profit calc (right)
      ├── SuppliersPage.tsx      # DataTable + phone/address icons + ingredient count + active status
      └── RestaurantShiftsPage.tsx # Open/close shift, active shift banner, cash reconciliation, detail dialog

POS Page Layout:
  Left panel (w-52): Order type tabs (Dine In/Takeaway/Delivery) + table grid or customer info
  Center panel (flex): Category pills + menu item cards (name, price, variants)
  Right panel (w-72): Cart items with qty controls + order note + totals + 2 buttons:
    - "Pay Later" → send to kitchen, pay after serving (standard restaurant flow)
    - "Pay & Send" → payment dialog (method + amount + change) → create order + bill + pay at once (fast food/cafe flow)

Payment Dialog: payment method (Cash/Transfer), paid amount input, quick amount buttons, change calculation

KDS Page (Kitchen Display):
  Kanban 3 columns: New Orders (PENDING) | Cooking (PREPARING) | Ready (READY)
  Order cards show: order number, table, type badge, elapsed time (color-coded), customer, note
  Each item has status toggle button: □ → 🔥 COOKING → ✓ DONE
  When first item starts COOKING → order auto-moves to PREPARING
  When all items DONE → order auto-moves to READY
  "Mark All Ready" button to bulk-complete items
  Auto-refresh every 10 seconds

Order Flow:
  Pay Later:  POS "Pay Later" → PENDING → KDS (PREPARING → READY) → KDS "Serve" → SERVED
              → Orders page "Bill" button → Payment dialog (method + amount + change) → COMPLETED + table AVAILABLE
  Pay First:  POS "Pay & Send" → Payment dialog → PENDING (bill PAID) → KDS (PREPARING → all items DONE)
              → auto COMPLETED + table AVAILABLE (no serve/bill step needed)
  KDS auto-transitions:
    - First item COOKING → order PREPARING
    - All items DONE + bill PAID → auto COMPLETED (Pay First)
    - All items DONE + no bill → READY (Pay Later, waiter serves)
  On COMPLETED/CANCELLED: table released to AVAILABLE (if no other active orders)
  On COMPLETED: ingredient stock auto-deducted based on recipes

API Endpoints:
  GET    /api/restaurant/menu-categories         # List
  POST   /api/restaurant/menu-categories         # Create
  PUT    /api/restaurant/menu-categories/:id     # Update
  DELETE /api/restaurant/menu-categories/:id     # Delete (fails if has items)
  GET    /api/restaurant/menu-items              # List (filter by category, status)
  POST   /api/restaurant/menu-items              # Create
  PUT    /api/restaurant/menu-items/:id          # Update
  PUT    /api/restaurant/menu-items/:id/toggle   # Toggle availability
  DELETE /api/restaurant/menu-items/:id          # Delete
  GET    /api/restaurant/tables                  # List (filter by zone, status)
  POST   /api/restaurant/tables                  # Create
  PUT    /api/restaurant/tables/:id              # Update
  PUT    /api/restaurant/tables/:id/status       # Update status only
  DELETE /api/restaurant/tables/:id              # Delete
  GET    /api/restaurant/orders                  # List (filter by status, type, date range, table)
  GET    /api/restaurant/orders/:id              # Detail with items
  POST   /api/restaurant/orders                  # Create (auto orderNumber, price lookup, table → OCCUPIED)
  PUT    /api/restaurant/orders/:id/status       # Status transition (validated)
  PUT    /api/restaurant/orders/:id/cancel       # Cancel + release table
  DELETE /api/restaurant/orders/:id              # Delete (only CANCELLED orders)
  POST   /api/restaurant/bills                   # Create bill from order (auto billNumber, optional immediate pay)
  PUT    /api/restaurant/bills/:id/pay           # Pay bill (paidAmount + paymentMethod → PAID + order COMPLETED)
  GET    /api/restaurant/kds/orders              # Active orders with items for kitchen display
  PUT    /api/restaurant/kds/items/:id/status    # Update item KDS status (WAITING → COOKING → DONE)
  PUT    /api/restaurant/kds/orders/:id/ready    # Mark entire order READY (bulk set all items DONE)
  POST   /api/restaurant/ingredients                # Create ingredient
  GET    /api/restaurant/ingredients                # List (search, lowStock filter)
  PUT    /api/restaurant/ingredients/:id            # Update
  POST   /api/restaurant/ingredients/:id/adjust     # Stock adjust (IN/OUT/WASTE/ADJUST + reason)
  DELETE /api/restaurant/ingredients/:id            # Delete (fails if used in recipes)
  GET    /api/restaurant/recipes                    # List all (grouped by menu item)
  GET    /api/restaurant/recipes/by-item/:id        # Recipes for menu item (with cost calc)
  POST   /api/restaurant/recipes                    # Add ingredient to recipe
  PUT    /api/restaurant/recipes/:id                # Update quantity
  DELETE /api/restaurant/recipes/:id                # Remove from recipe
  GET    /api/restaurant/dashboard/stats            # Today's stats (revenue, orders, hourly chart, top items)
  GET    /api/restaurant/suppliers                  # List (paginated + search)
  GET    /api/restaurant/suppliers/:id              # Get single (with ingredients)
  POST   /api/restaurant/suppliers                  # Create
  PUT    /api/restaurant/suppliers/:id              # Update
  DELETE /api/restaurant/suppliers/:id              # Delete (fails if has ingredients)
  GET    /api/restaurant/shifts                     # List (paginated + status/date filters)
  GET    /api/restaurant/shifts/active              # Get current user's open shift
  GET    /api/restaurant/shifts/:id                 # Get single shift detail
  POST   /api/restaurant/shifts/open                # Open new shift (openingCash, note)
  PUT    /api/restaurant/shifts/:id/close           # Close shift (closingCash, auto-calc expected/diff)
  GET    /api/restaurant/bills/:id                  # Get bill with order items (for receipt)

Permissions:
  restaurant.dashboard.view
  restaurant.menu.read / create / update / delete
  restaurant.tables.read / create / update / delete
  restaurant.orders.read / create / update / delete
  restaurant.bills.read
  restaurant.kds.read / update
  restaurant.ingredients.read / create / update / delete
  restaurant.recipes.read / create / update / delete
  restaurant.suppliers.read / create / update / delete
  restaurant.shifts.read / create / update

Routes: /restaurant/dashboard, /restaurant/menu, /restaurant/tables, /restaurant/pos, /restaurant/orders, /restaurant/kitchen, /restaurant/ingredients, /restaurant/recipes, /restaurant/suppliers, /restaurant/shifts
Settings: /restaurant/settings (SettingsSideNav layout, categories management)

Recipes Page Layout:
  Left panel (w-64): Menu items grouped by category + search
  Right panel (flex): Selected item recipe table (ingredient, qty, cost/unit, line cost, stock level)
    + header with price/cost/profit/margin summary
    + "Add Ingredient" dialog (select ingredient + qty per item)

Ingredients Page Features:
  DataTable with: name, stock (colored if low), cost/unit, alert level, supplier, recipe count
  Actions: Add Stock (IN), Remove Stock (OUT), Edit, Delete
  Stock Adjust Dialog: quantity + reason → creates IngredientStockLog entry
```

### Marketing Website

| Page | Status | Description |
|------|--------|-------------|
| **Home** | Done | Hero with gradient orbs, module cards (Trading/HRM/Restaurant/LMS), platform features (Multi-tenant/Mobile/Reports/i18n), CTA section |
| **Features** | Done | Detailed module breakdown with alternating layout, feature lists per module, Mobile App section |
| **Pricing** | Done | 3-tier cards (Basic 49K / Standard 149K / Premium 349K Ks/month), feature comparison, highlighted "Most Popular" |
| **About** | Done | Company story, values (Simplicity/Local First/Unified) |
| **Contact** | Done | Contact form (name/email/company/message), office info cards (address/phone/email), success state |
| **Navbar** | Done | Fixed top, glassmorphism bg, mobile hamburger, gradient CTA button |
| **Footer** | Done | Product/Modules/Company link groups, gradient orb bg |

**Tech:** Next.js 15 (App Router) + Tailwind CSS v4 + lucide-react. Port 3100.

**Run:** `cd apps/marketing && pnpm dev`

See [readme/MARKETING.md](../readme/MARKETING.md) for full documentation.

---

### HRM — File Reference

```

Database (schema.prisma):
model HrmProject {
id, name, location?, description?, status (ACTIVE|COMPLETED|ON_HOLD),
startDate?, endDate?, tenantId, isActive
@@map("hrm_projects")
}

model HrmDepartment {
id, name, description?, isActive, tenantId
@@map("hrm_departments")
}

model HrmEmployee {
id, name, dateOfBirth?, gender?, maritalStatus?, nationality?, religion?, bloodType?, photo?,
nrc?, passportNo?, ssnNo?, drivingLicense?,
phone?, email?, address?, city?, state?, zipCode?,
emergencyName?, emergencyRelation?, emergencyPhone?, emergencyAddress?,
employeeCode?, position?, jobTitle?, employmentType?, joinDate?, probationEndDate?, contractEndDate?, resignDate?,
dailyRate, overtimeHourlyRate?, salaryType?, monthlySalary?,
hrmProjectId? (→ HrmProject), departmentId? (→ HrmDepartment), userId? (→ User), tenantId, isActive, note?
bankAccounts → HrmBankAccount[] (one-to-many)
@@map("hrm_employees")
}

model HrmBankAccount {
id, employeeId (→ HrmEmployee, onDelete: Cascade), bankName, bankBranch?, accountNo, accountName, isPrimary, tenantId
@@map("hrm_bank_accounts")
}

model HrmAttendance {
id, employeeId, tenantId, date, type (FULL_DAY|HALF_DAY|ABSENT|LEAVE),
overtimeHours, hrmProjectId? (→ HrmProject relation),
checkIn?, checkOut?, source (MANUAL|CLOCK), note
@@unique([employeeId, date])
@@map("hrm_attendances")
}

model HrmEmployeeAdvance {
id, employeeId, tenantId, date, amount, note,
deductOnPayrollId? (which payroll to deduct from),
status (PENDING|DEDUCTED), payrollId? (linked when deducted)
@@map("hrm_employee_advances")
}

model HrmPayroll {
id, employeeId, tenantId, periodStart, periodEnd,
workDays, regularAmount, overtimeAmount, grossAmount,
advanceDeduction, netAmount, rateSnapshot, otRateSnapshot?,
status (DRAFT|CONFIRMED|PAID), paidAt?, note
@@unique([employeeId, periodStart, periodEnd])
@@map("hrm_payrolls")
}

model HrmLeaveType {
id, name, paidDaysPerYear, description?, isActive, tenantId
@@map("hrm_leave_types")
}

model HrmLeaveRequest {
id, employeeId, leaveTypeId, startDate, endDate, days,
reason?, status (PENDING|APPROVED|REJECTED|CANCELLED),
approvedBy?, approvedAt?, tenantId
@@map("hrm_leave_requests")
}

model HrmOvertimeRequest {
id, employeeId, date, hours, reason?,
status (PENDING|APPROVED|REJECTED|CANCELLED),
approvedBy?, approvedAt?, tenantId
@@unique([employeeId, date])
@@map("hrm_overtime_requests")
}

model HrmShiftType {
id, name, startTime ("08:00"), endTime ("16:00"), description?, color? (hex string e.g. "#3B82F6"), isActive, tenantId
@@map("hrm_shift_types")
}

model HrmShiftAssignment {
id, employeeId, shiftTypeId, startDate, endDate? (null = ongoing), note?, tenantId
@@map("hrm_shift_assignments")
}

Backend:
apps/api/src/modules/hrm/
├── hrm.module.ts # Root HRM module (registered in AppModule)
├── dashboard/
│ ├── dashboard.module.ts
│ ├── dashboard.controller.ts # GET /hrm/dashboard/stats (permission: hrm.dashboard.view)
│ └── dashboard.service.ts # Aggregates employees, attendance, payroll, leave, OT, advances, departments
├── projects/
│ ├── hrm-projects.module.ts
│ ├── hrm-projects.controller.ts # CRUD + status update (endpoint: /hrm/projects)
│ ├── hrm-projects.service.ts # Tenant-scoped, worker count
│ └── dto/ (create, query)
├── departments/
│ ├── departments.module.ts
│ ├── departments.controller.ts # CRUD (endpoint: /hrm/departments)
│ ├── departments.service.ts # Tenant-scoped, employee count, delete protection
│ └── dto/ (create, update, query)
├── employees/
│ ├── employees.module.ts
│ ├── employees.controller.ts # CRUD + positions endpoint
│ ├── employees.service.ts # Tenant-scoped, paginated, position list, department+project filter
│ └── dto/ (create, update, query)
├── attendance/
│ ├── attendance.module.ts
│ ├── attendance.controller.ts # CRUD + bulk create + summary
│ ├── attendance.service.ts # Upsert, date-unique, summary calc
│ └── dto/ (create + BulkCreate, update, query)
├── leave/
│ ├── leave.module.ts
│ ├── leave.controller.ts # Leave types CRUD + requests CRUD + approve/reject/cancel + balance
│ ├── leave.service.ts # Types CRUD, requests with status flow, balance calc per employee per year
│ └── dto/ (create-leave-type, update-leave-type, create-leave-request, query-leave-request)
├── overtime/
│ ├── overtime.module.ts
│ ├── overtime.controller.ts # CRUD + approve/reject/cancel + summary
│ ├── overtime.service.ts # Request CRUD, status flow, summary by employee
│ └── dto/ (create-overtime-request, query-overtime-request)
├── shifts/
│ ├── shifts.module.ts
│ ├── shifts.controller.ts # Shift types CRUD + assignments CRUD
│ ├── shifts.service.ts # Types CRUD, assignments with employee+shiftType validation
│ └── dto/ (create-shift-type, update-shift-type, create-shift-assignment, query-shift-assignment)
├── advances/
│ ├── advances.module.ts
│ ├── advances.controller.ts # CRUD
│ ├── advances.service.ts # DEDUCTED status protection, pending list
│ └── dto/ (create, update, query)
└── payroll/
├── payroll.module.ts
├── payroll.controller.ts # List + generate + confirm + pay + monthly-summary
├── payroll.service.ts # Auto-calc from attendance, advance deduction, rate snapshot
└── dto/ (generate, confirm/pay, query)

Frontend:
apps/web/src/modules/hrm/
├── hooks/
│ ├── useEmployees.ts # useEmployees + useEmployeeMutations
│ ├── useDepartments.ts # useDepartments + useDepartmentMutations
│ ├── useAttendance.ts # useAttendance + useAttendanceSummary + useAttendanceMutations
│ ├── useLeave.ts # useLeaveTypes + useLeaveRequests + useLeaveBalance + mutations
│ ├── useOvertime.ts # useOvertimeRequests + useOvertimeSummary + useOvertimeMutations
│ ├── useShifts.ts # useShiftTypes + useShiftAssignments + mutations
│ ├── useAdvances.ts # useAdvances + useAdvanceMutations
│ └── usePayroll.ts # usePayrolls + usePayrollMutations + useMonthlySummary
├── components/
│ ├── HrmProjectDrawer.tsx # Sections: Project Info + Dates + Settings
│ ├── DepartmentDrawer.tsx # Sections: Department Info + Settings
│ ├── EmployeeDrawer.tsx # Sections: Basic Info (+ HRM project + department dropdowns) + Rates + Settings
│ ├── AttendanceDrawer.tsx # Employee dropdown + date + type + HRM project (auto-fill) + OT hours
│ ├── LeaveTypeDrawer.tsx # Name + paid days/year + description + active toggle
│ ├── LeaveRequestDrawer.tsx # Employee dropdown + leave type + date range + auto-calc days + reason
│ ├── OvertimeRequestDrawer.tsx # Employee dropdown + date + hours + reason
│ ├── ShiftTypeDrawer.tsx # Name + start/end time + description + color picker + active toggle
│ ├── ShiftAssignmentDrawer.tsx # Employee dropdown + shift type + date range + skipWeekends/replaceDuplicates toggles + note
│ ├── AdvanceDrawer.tsx # Sections: Amount + Deduction Schedule (useInfiniteOptions)
│ ├── GeneratePayrollDrawer.tsx # Period start/end + force regenerate checkbox
│ ├── PayslipTemplate.tsx # forwardRef print template (react-to-print)
│ └── reports/
│ ├── MonthlySummaryReport.tsx # Summary cards + employee breakdown table + CSV
│ └── AttendanceSummaryReport.tsx # Attendance cards + per-employee table + CSV
└── pages/
├── HrmDashboardPage.tsx # Stat cards (employees, depts, projects, pending items), today attendance, monthly chart, recent payrolls, department distribution
├── HrmProjectsPage.tsx # DataTable + FilterBar (status) + worker count + CRUD
├── DepartmentsPage.tsx # DataTable + FilterBar (status) + employee count + CRUD
├── EmployeeFormPage.tsx # Multi-step form (6 steps: Personal, Contact, Employment, Compensation, Bank, Settings), create (/new) + edit (/:id/edit)
├── EmployeesPage.tsx # DataTable + FilterBar (status) + name click navigates to edit, Add navigates to /new
├── AttendancePage.tsx # DataTable + FilterBar (employee + type + date range) + HRM project column
├── BulkAttendancePage.tsx # Month grid calendar (click-to-cycle, per-row HRM project dropdown, batch save)
├── LeavePage.tsx # TabBar (Requests + Balance + Leave Types) — each tab has DataTable + FilterBar
├── OvertimePage.tsx # TabBar (Requests + Summary) — OT request list + employee OT summary
├── ShiftsPage.tsx # TabBar (Schedule + Shift Types) — week calendar (rows=employees by dept, cols=Mon-Sun, color blocks, week nav) + type CRUD
├── AdvancesPage.tsx # DataTable + FilterBar (status) + pending total banner
├── PayrollPage.tsx # DataTable (Employee, Period, Days, Regular, OT, Gross, Advance, Net, Status) + FilterBar (status + employee + period) + checkbox bulk selection + bulk confirm/pay/delete + generate/print
└── HrmReportsPage.tsx # TabBar (Monthly Cost + Attendance) + month/year selector

API Endpoints:
GET /api/hrm/departments # List (paginated + search + status)
GET /api/hrm/departments/:id # Get single
POST /api/hrm/departments # Create
PUT /api/hrm/departments/:id # Update
DELETE /api/hrm/departments/:id # Delete (fails if has employees)

GET /api/hrm/employees # List (paginated + search + status + departmentId + hrmProjectId)
GET /api/hrm/employees/positions # Distinct position list
GET /api/hrm/employees/:id # Get single
POST /api/hrm/employees # Create (with optional departmentId)
PUT /api/hrm/employees/:id # Update
DELETE /api/hrm/employees/:id # Delete

GET /api/hrm/attendance # List (paginated + date range + type)
GET /api/hrm/attendance/summary # Summary (fullDay/halfDay/absent/leave/OT for employee+period)
POST /api/hrm/attendance # Create single
POST /api/hrm/attendance/bulk # Bulk upsert (multiple employees, same date)
PUT /api/hrm/attendance/:id # Update
DELETE /api/hrm/attendance/:id # Delete

GET /api/hrm/advances # List (paginated + status + date range)
POST /api/hrm/advances # Create (with optional deductOnPayrollId)
PUT /api/hrm/advances/:id # Update (blocked if DEDUCTED)
DELETE /api/hrm/advances/:id # Delete (blocked if DEDUCTED)

GET /api/hrm/payroll # List (paginated + status + search + periodStart/End)
GET /api/hrm/payroll/monthly-summary # Monthly report (year + month)
GET /api/hrm/payroll/:id # Get single with advances
POST /api/hrm/payroll/generate # Generate DRAFT payrolls for period (force=true to regenerate)
PUT /api/hrm/payroll/:id/confirm # DRAFT → CONFIRMED (marks linked advances as DEDUCTED)
PUT /api/hrm/payroll/:id/pay # CONFIRMED → PAID
DELETE /api/hrm/payroll/:id # Delete (restores advances to PENDING)

GET /api/hrm/leave/types # List all leave types
POST /api/hrm/leave/types # Create leave type
PUT /api/hrm/leave/types/:id # Update leave type
DELETE /api/hrm/leave/types/:id # Delete (fails if has requests)
GET /api/hrm/leave/requests # List (paginated + status + leaveTypeId + employeeId)
POST /api/hrm/leave/requests # Create leave request
PUT /api/hrm/leave/requests/:id/approve # PENDING → APPROVED
PUT /api/hrm/leave/requests/:id/reject # PENDING → REJECTED
PUT /api/hrm/leave/requests/:id/cancel # → CANCELLED
DELETE /api/hrm/leave/requests/:id # Delete (blocked if APPROVED)
GET /api/hrm/leave/balance # Balance per employee per leave type (year param)

GET    /api/hrm/overtime                    # List (paginated + status + employeeId + date range)
GET    /api/hrm/overtime/summary            # Approved OT summary grouped by employee (date range)
POST   /api/hrm/overtime                    # Create OT request (unique per employee+date)
PUT    /api/hrm/overtime/:id/approve        # PENDING → APPROVED
PUT    /api/hrm/overtime/:id/reject         # PENDING → REJECTED
PUT    /api/hrm/overtime/:id/cancel         # → CANCELLED
DELETE /api/hrm/overtime/:id                # Delete (blocked if APPROVED)

GET    /api/hrm/shifts/types                # List all shift types
POST   /api/hrm/shifts/types                # Create shift type
PUT    /api/hrm/shifts/types/:id            # Update shift type
DELETE /api/hrm/shifts/types/:id            # Delete (fails if has assignments)
GET    /api/hrm/shifts/assignments          # List (paginated + shiftTypeId + employeeId)
POST   /api/hrm/shifts/assignments          # Create assignment (employee + shiftType + date range + replaceDuplicates? + skipWeekends?)
DELETE /api/hrm/shifts/assignments/:id      # Remove assignment

GET    /api/hrm/dashboard/stats              # Dashboard stats (attendance, payroll, leave, OT, advances, departments)

Permissions:
hrm.dashboard.view
hrm.departments.read / create / update / delete
hrm.employees.read / create / update / delete
hrm.attendance.read / create / update / delete
hrm.leave.read / create / update / delete
hrm.overtime.read / create / update / delete
hrm.shifts.read / create / update / delete
hrm.advances.read / create / update / delete
hrm.payroll.read / create / update / delete
hrm.reports.read

Sidebar: HRM module with entries grouped (Dashboard | Projects | Employee + Departments | Attendance + Bulk Calendar + Leave + Overtime + Shifts | Payroll + Advances + Reports)
Routes: /hrm/dashboard, /hrm/projects, /hrm/departments, /hrm/employees, /hrm/employees/new, /hrm/employees/:id/edit, /hrm/attendance, /hrm/attendance/calendar, /hrm/leave, /hrm/overtime, /hrm/shifts, /hrm/advances, /hrm/payroll, /hrm/reports

API Endpoints (HRM Projects):
GET /api/hrm/projects # List (paginated + search + status)
GET /api/hrm/projects/:id # Get single
POST /api/hrm/projects # Create
PUT /api/hrm/projects/:id # Update
PUT /api/hrm/projects/:id/status # Status transition
DELETE /api/hrm/projects/:id # Delete

Architecture Note:
HrmProject is INDEPENDENT from Trading Project.
Trading Project = BOQ, materials, budget, PO links (trading-specific)
HrmProject = lightweight name/location/dates (any module can use HRM)
This allows HRM to be sold standalone without Trading module dependency.

Payroll Calculation Flow:

1. Admin generates payroll for period (periodStart → periodEnd)
2. For each active employee:
   a. Fetch attendance records in period
   b. Fetch APPROVED overtime requests (HrmOvertimeRequest) in period
   c. workDays = Σ (FULL_DAY=1, HALF_DAY=0.5, ABSENT=0, LEAVE=0)
   d. totalOtHours = Σ attendance.overtimeHours + Σ approvedOtRequests.hours
   e. regularAmount = dailyRate × workDays
   f. overtimeAmount = totalOtHours × otRate
      otRate = overtimeHourlyRate ?? (dailyRate / 8 × 1.5)
   g. grossAmount = regularAmount + overtimeAmount
   h. Find advances scheduled for this payroll (deductOnPayrollId = payroll.id)
   i. advanceDeduction = Σ scheduled advance amounts
   j. netAmount = grossAmount - advanceDeduction
   k. Store rateSnapshot + otRateSnapshot for history
3. Admin reviews DRAFT → Confirm (advances marked DEDUCTED) → Mark Paid

OT Sources (both contribute to payroll overtimeAmount):
  - Attendance overtimeHours: directly recorded per day in attendance records
  - OvertimeRequest (APPROVED): from the approval workflow (/hrm/overtime)
  - Both are summed during payroll generation for the period

Advance Deduction Flow:

- Worker takes advance → admin records with optional deductOnPayrollId
- deductOnPayrollId dropdown uses useInfiniteOptions (searchable, server-paginated)
- If deductOnPayrollId is null → advance stays PENDING (unscheduled, shown with warning)
- Admin links advance to payroll → backend auto-recalculates payroll (advanceDeduction + netAmount)
- On Confirm (DRAFT→CONFIRMED): linked PENDING advances → DEDUCTED, payrollId set
- If payroll deleted → advances restored to PENDING

Payroll Regenerate Flow:

- Generate drawer has "Regenerate" checkbox (force=true)
- Deletes existing DRAFT payrolls for the period
- Restores linked advances to PENDING + unlinks deductOnPayrollId
- Recalculates from latest attendance data
- CONFIRMED/PAID payrolls are never affected

Payslip Print:

- PayslipTemplate.tsx (forwardRef + react-to-print pattern)
- Shows: company header, employee info, period, DAILY BREAKDOWN table
  (date, day, type badge, OT hours, daily amount), summary, deductions, net pay box, signatures
- PayrollPage actions: printer icon → fetch attendance for period → render template → print dialog
- Daily amount = dailyRate × multiplier (Full=1, Half=0.5, Absent=0) + OT hours × otRate

Bulk Attendance Calendar:

- BulkAttendancePage.tsx (/hrm/attendance/calendar)
- Month grid: rows = active employees, columns = days of month
- Click cell → cycle: F(Full) → H(Half) → A(Absent) → L(Leave)
- Per-row project dropdown (default = employee's assigned project, overridable per row)
- Dirty cells show ring highlight, "Save (N)" button appears
- Save calls POST /hrm/attendance/bulk per date (upsert pattern, includes projectId)
- Weekend columns highlighted, sticky employee column
- Month navigation (prev/next arrows, resets dirty + row projects)

HRM Projects (Independent Module):

- HrmProject model — separate from Trading Project
- CRUD via /hrm/projects endpoint
- Status: ACTIVE → COMPLETED, ON_HOLD
- Worker count shown in table (\_count.employees)
- HrmProjectsPage: DataTable + FilterBar (status) + CRUD drawer

Attendance + HRM Project Link:

- HrmAttendance has hrmProjectId → HrmProject relation
- Tracks which project an employee worked on each day
- Employee can work on Project A normally but Project B some days
- AttendanceDrawer: HRM project dropdown (searchable, useInfiniteOptions, /hrm/projects)
- Auto-fills from employee's assigned hrmProject when employee selected
- AttendancePage: Project column in table
- BulkCalendar: per-row project dropdown (StandaloneDropdown + useInfiniteOptions)

Employee → HRM Project Assignment:

- HrmEmployee has optional hrmProjectId → HrmProject relation
- EmployeeDrawer: "Assigned Project" dropdown (useInfiniteOptions, /hrm/projects)
- EmployeesPage: Project column in table
- Serves as default project for attendance records

Payroll Bulk Actions:

- PayrollPage: checkbox column for row selection
- Bulk action bar appears when rows selected (shows count)
- Bulk Confirm: confirm all selected DRAFT payrolls (advances → DEDUCTED)
- Bulk Mark Paid: mark all selected CONFIRMED payrolls as PAID
- Bulk Delete: delete all selected non-PAID payrolls (advances → PENDING)
- Confirmation dialog shows affected employee list with net amounts
- Status mismatch rows are skipped with count notification

Leave Module:

- Single page (/hrm/leave) with 3 TabBar tabs: Requests, Balance, Leave Types
- Each tab renders its own DataTable + FilterBar
- Leave Types: admin-configurable (Annual Leave, Sick Leave, etc.) with paidDaysPerYear quota
- Leave Requests: employee + type + date range + auto-calc days + reason
- Status flow: PENDING → APPROVED (by admin) / REJECTED / CANCELLED
- Approve/Reject actions only on PENDING, Cancel on PENDING or APPROVED
- Delete blocked for APPROVED requests
- Leave Balance: dynamic columns per active leave type, shows remaining/total/used per employee for current year
- Balance calculated from approved leave requests grouped by employeeId + leaveTypeId

Overtime Module:

- Single page (/hrm/overtime) with 2 TabBar tabs: Requests, Summary
- OT Requests: create (employee + date + hours + reason), unique per employee+date
- Status flow: PENDING → APPROVED (by admin) / REJECTED / CANCELLED
- Approve/Reject on PENDING only, Cancel on PENDING or APPROVED
- Delete blocked for APPROVED requests
- Summary tab: approved OT hours grouped by employee for current month (totalHours + requestCount)
- Separate from attendance overtimeHours — OT requests are approval workflow, attendance OT is direct recording

Shift Module:

- Single page (/hrm/shifts) with 2 TabBar tabs: Schedule, Shift Types
- Schedule tab: Week calendar view (similar pattern to BulkAttendancePage)
  - Rows = employees grouped by department (with dept header rows)
  - Columns = Mon–Sun with day name + date
  - Cells = color-coded shift blocks (time range + shift name), colors from DB hex or fallback palette
  - Shift type color stored in DB (hex string), rendered via inline styles (shiftColorStyle helper)
  - Week navigation: prev/next arrows + Today button
  - Today column highlighted with primary/10, weekends with danger/5
  - Employee column sticky on horizontal scroll
  - Hover shift block shows X button to remove assignment
  - Legend bar shows shift type colors
  - Assign Shift drawer: employee dropdown + shift type + date range + options:
    - "Skip Weekends" toggle (default: true) — skips Sat/Sun when assigning date range
    - "Replace Duplicates" toggle — replaces existing overlapping shifts instead of throwing conflict error
  - Backend handles skipWeekends by creating individual per-day assignments (skipping day 0/6)
  - Backend handles replaceDuplicates by deleting conflicting assignments before creating new ones
- Shift Types tab: DataTable CRUD (name, startTime, endTime, description, color picker, active toggle)
- Delete protection: cannot delete shift type if assignments exist

Department Module:

- HrmDepartment: simple CRUD (name, description, isActive)
- Linked to HrmEmployee via departmentId (optional)
- EmployeeDrawer: department dropdown (useInfiniteOptions, /hrm/departments)
- EmployeesPage: filterable by departmentId
- Delete protection: cannot delete department if employees are assigned

Bug Fixes Applied:

- FormDatePicker: timezone fix — local date string instead of toISOString() (UTC shift)
- FormDropdown: scroll-inside fix — don't close on scroll within dropdown list
- AdvanceDrawer: strip employeeId on edit (forbidNonWhitelisted fix)
- Advance update: @ValidateIf for null deductOnPayrollId
- BulkCreateAttendanceDto: @IsArray @ValidateNested @Type decorators for records field
- AttendancePage/PayrollPage: date range filter timezone fix (fmtLocal instead of toISOString)

```

### Trading Module — Implementation Roadmap

```

Phase 1: ✅ Products (CRUD + import/export + custom fields)
Phase 2: ✅ Suppliers (CRUD + custom fields + delete protection)
Phase 3: ✅ Purchases (PO + line items + status flow + stock update on receive)
Phase 4: ✅ Inventory (stock view + summary + manual adjust + auto-update on PO receive)
Phase 5: ✅ Dashboard (real-time stats, low stock alerts, recent POs)
Phase 6: ✅ Customers (CRUD — Supplier clone)
Phase 7: ✅ Sales Orders (PO mirror — line items, discount/tax, stock deduct)
Phase 8: ✅ Invoices (generate from SO, payment tracking, status flow)
Phase 9: ✅ Payments (Payment Received/Made + audit trail + advance payment)
Phase 10: ✅ Sales Returns (return items + stock restore + invoice adjust)
Phase 11: ✅ Goods Received (received PO history page)
Phase 12: ✅ Projects (BOQ + material tracking + budget + PO link)
Phase 13: ✅ Reports (Sales/Purchases/Payments/Profit/Projects + charts + CSV export)
Phase 14: ✅ Receivable/Payable (aging reports + by customer/supplier)
Phase 15: ✅ Global Search + Activity Log + Print Templates

```

### Suppliers — File Reference

```

Backend:
apps/api/src/modules/trading/suppliers/
├── suppliers.module.ts
├── suppliers.controller.ts # @CurrentUser() + tenantId on all endpoints
├── suppliers.service.ts # Tenant-scoped, paginated, purchase count
└── dto/
├── create-supplier.dto.ts # name (required), phone, email, address, contactPerson, notes, metadata
├── update-supplier.dto.ts # All optional
└── query-supplier.dto.ts # search, page, limit, sortBy, sortOrder

Frontend:
apps/web/src/modules/trading/
├── pages/SuppliersPage.tsx # DataTable + FilterBar + permissions + Toast + custom fields columns
├── components/SupplierDrawer.tsx # Zod + FormFieldsGenerator + custom fields auto-render
└── hooks/
├── useSuppliers.ts # List hook with filters
└── useSupplierMutations.ts # Create/Update/Delete

API Endpoints:
GET /api/trading/suppliers # List (paginated + search + tenant-scoped)
GET /api/trading/suppliers/:id # Get single
POST /api/trading/suppliers # Create (sets tenantId)
PUT /api/trading/suppliers/:id # Update
DELETE /api/trading/suppliers/:id # Delete (fails if has purchases)

Permissions:
trading.suppliers.read
trading.suppliers.create
trading.suppliers.update
trading.suppliers.delete

````

### Zod NaN Handling for Optional Number Fields

When using `z.coerce.number()` with number inputs, empty fields return `NaN` which causes
"Invalid input: expected number, received NaN" errors. Use `z.preprocess` for optional number fields:

```typescript
// ❌ Wrong — empty input → NaN → validation error
discount: z.coerce.number().min(0).default(0),

// ✅ Correct — empty/NaN → 0
discount: z.preprocess((v) => Number(v) || 0, z.number().min(0)),
````

Apply this to ALL optional number fields (discount, tax) in Purchase and Sale forms.
Required number fields (quantity, unitPrice) can keep `z.coerce.number()` since they must have values.

### Purchases — File Reference (Parent-Child Pattern)

This is the reference for **parent-child** modules (header + line items).

```
Backend:
  apps/api/src/modules/trading/purchases/
  ├── purchases.module.ts
  ├── purchases.controller.ts       # CRUD + receive/cancel status actions
  ├── purchases.service.ts          # Tenant-scoped, auto PO number, status validation
  └── dto/
      ├── create-purchase.dto.ts    # supplierId + items[] (ValidateNested)
      └── query-purchase.dto.ts     # search, status, supplierId, pagination

Frontend:
  apps/web/src/modules/trading/
  ├── pages/PurchasesPage.tsx       # DataTable + status action buttons (Receive/Cancel/Delete)
  ├── components/PurchaseDrawer.tsx  # Supplier select + dynamic line items (add/remove rows)
  └── hooks/
      ├── usePurchases.ts           # List hook with filters
      └── usePurchaseMutations.ts   # create, receive, cancel, delete

API Endpoints:
  GET    /api/trading/purchases          # List (paginated + search + filter by status/supplier)
  GET    /api/trading/purchases/:id      # Get single with items
  POST   /api/trading/purchases          # Create PO with items (auto generates PO number)
  PUT    /api/trading/purchases/:id/receive  # Mark as RECEIVED (only from PENDING)
  PUT    /api/trading/purchases/:id/cancel   # Mark as CANCELLED
  DELETE /api/trading/purchases/:id      # Delete (only if not RECEIVED)

Permissions:
  trading.purchases.read
  trading.purchases.create
  trading.purchases.update     # Receive/Cancel actions
  trading.purchases.delete

Status Flow:
  PENDING → RECEIVED (goods arrived)
  PENDING → CANCELLED (order cancelled)
  RECEIVED → cannot delete or cancel

Discount/Tax Flow (supports fixed amount + percentage):
  Types: "fixed" (Ks amount) or "percentage" (% of subtotal)
  Helper: calcAmount(value, type, base) = type === "percentage" ? base * value / 100 : value

  Item level:
    lineSubtotal = qty × unitPrice
    discountAmt  = calcAmount(discount, discountType, lineSubtotal)
    taxAmt       = calcAmount(tax, taxType, lineSubtotal)
    lineTotal    = lineSubtotal - discountAmt + taxAmt

  Order level:
    itemsSubtotal = sum(all lineTotals)
    orderDiscAmt  = calcAmount(orderDiscount, orderDiscountType, itemsSubtotal)
    orderTaxAmt   = calcAmount(orderTax, orderTaxType, itemsSubtotal)
    netAmount     = itemsSubtotal - orderDiscAmt + orderTaxAmt

  Database fields:
    Purchase:     discount, discountType, tax, taxType, totalAmount, netAmount, voucherNo, voucherImage
    PurchaseItem: discount, discountType, tax, taxType, totalPrice

Voucher Attachment:
  Purchase model has optional voucherNo (String?) and voucherImage (String?, base64)
  PurchaseFormPage: Voucher No. text field + photo upload (camera/file, base64, preview+remove)
  PurchaseDetailPage: Shows voucher no. in details card + voucher image (click to enlarge)
  Mobile: camera capture support via input[capture="environment"]
  Note: Production should use file storage (S3/Cloudinary) instead of base64 in DB

  UI Component: FormAmountWithType (shared/components/Form/FormAmountWithType.tsx)
    — Number input + small type dropdown (Ks / %) side by side
    — Props: name, typeName, label, placeholder
    — Usage: <FormAmountWithType name="discount" typeName="discountType" label="Discount" />

Key Differences from Simple CRUD:
  1. Create DTO has nested items[] with @ValidateNested
  2. Service creates parent + child records in one Prisma create
  3. PO number auto-generated: PO-YYYYMMDD-XXX
  4. Status actions (receive/cancel) instead of generic update
  5. Full page form (PurchaseFormPage) with LineItemsTable + FormFieldsGenerator
  6. Detail page (PurchaseDetailPage) with status actions + item list
  7. Table actions are status-dependent (Receive only for PENDING)
  8. Receive triggers inventory stock update (see below)
  9. Item-level + order-level discount/tax with auto-calculated totals

Frontend Pages:
  /trading/purchases          → PurchasesPage (list + filter + status actions)
  /trading/purchases/new      → PurchaseFormPage (2-column: items left, supplier right)
  /trading/purchases/:id      → PurchaseDetailPage (view PO + items + actions)

Reusable Components Used:
  LineItemsTable  → shared/components/LineItemsTable.tsx (add/remove rows, column render)
  FormDropdown    → for product select in line items (searchable)
  FormInput       → for qty/price in line items
  useFieldArray   → react-hook-form array management for items
```

### Purchase → Inventory Flow (Stock Update)

When a Purchase Order is marked as **RECEIVED**, inventory is automatically updated:

```
Purchase Order: PENDING
        ↓ [Receive] button
        ↓
┌─ receive() method ──────────────────────────────┐
│ 1. Validate status === PENDING                   │
│ 2. Find tenant's default warehouse               │
│    (auto-create "Main Warehouse" if missing)     │
│ 3. Transaction:                                   │
│    a. Update PO status → RECEIVED                │
│    b. For each PO item:                          │
│       Inventory.upsert(productId + warehouseId)  │
│       → existing: quantity += item.quantity       │
│       → new: create with item.quantity            │
└──────────────────────────────────────────────────┘
        ↓
Product list → stock = sum(inventory.quantity) ← auto-computed
```

**Important**: Use raw Prisma query (not transformed `findOne`) for inventory operations.
Prisma Decimal fields must receive Decimal-compatible values, not `Number()` converted values:

```typescript
// ✅ Correct — use raw Prisma query
const purchase = await this.prisma.purchase.findFirst({
  where: { id, tenantId },
  include: { items: true }, // items.quantity is Prisma Decimal
});

// ❌ Wrong — findOne transforms to Number, loses Decimal type
const purchase = await this.findOne(id, tenantId);
// purchase.items[0].quantity is Number → increment may fail
```

### Warehouse System

```
Database:
  model Warehouse {
    id, name, location, tenantId, isActive
  }

  model Inventory {
    productId + warehouseId (composite unique)
    quantity (Decimal)
    tenantId
  }

Auto-creation:
  1. Seed → creates "Main Warehouse" for SuperAdmin (tenantId=null)
  2. Tenant create → auto-creates "Main Warehouse" for new tenant
  3. PO Receive → auto-creates warehouse if none exists

Stock Computation (in ProductsService.findAll):
  const stock = product.inventory.reduce(
    (sum, inv) => sum + Number(inv.quantity), 0
  );

Current State:
  ✅ Default warehouse auto-created
  ✅ Stock updates on PO receive
  ✅ Stock shown in Products table
  ✅ Manual stock adjustment (add/deduct with reason, negative check)
  ✅ Inventory page with summary cards + search/filter
  → Multi-warehouse support (future)
```

### Payments — File Reference

```
Database:
  model Payment {
    id, paymentNo, type (RECEIVED|MADE), amount, paymentMethod (CASH|TRANSFER|CREDIT),
    paymentDate, reference, notes, invoiceId?, purchaseId?, customerId?, supplierId?,
    tenantId, createdBy
    @@unique([paymentNo, tenantId])
  }

  Purchase model — added paidAmount field for tracking supplier payments

Backend:
  apps/api/src/modules/trading/payments/
  ├── payments.module.ts
  ├── payments.controller.ts       # GET list, GET :id, POST received, POST made
  ├── payments.service.ts          # findAll, findOne, createReceived, createMade
  └── dto/
      ├── create-payment.dto.ts    # type?, amount, paymentMethod, reference, notes, invoiceId, purchaseId
      └── query-payment.dto.ts     # search, type, paymentMethod, customerId, supplierId, pagination

Frontend:
  apps/web/src/modules/trading/
  ├── pages/PaymentReceivedPage.tsx   # Customer payments list + create dialog (invoice dropdown)
  ├── pages/PaymentMadePage.tsx       # Supplier payments list + create dialog (purchase dropdown)
  └── hooks/usePayments.ts           # usePayments + usePaymentMutations

API Endpoints:
  GET  /api/trading/payments              # List (filter by type, paymentMethod, customer, supplier)
  GET  /api/trading/payments/:id          # Get single
  POST /api/trading/payments/received     # Record customer payment (updates invoice paidAmount + status)
  POST /api/trading/payments/made         # Record supplier payment (updates purchase paidAmount)

Permissions:
  trading.payments.read       # View payment history
  trading.payments.create     # Record new payments

Payment Flow:
  Payment Received (customer → invoice):
    1. Select unpaid/partial invoice (useInfiniteOptions with status=UNPAID,PARTIAL)
    2. Auto-fill balance as default amount
    3. Transaction: create Payment + update Invoice (paidAmount, status → PARTIAL/PAID)

  Payment Made (supplier → purchase):
    1. Select pending/received purchase with balance > 0 (unpaidOnly=true)
    2. Advance payment supported (pay PENDING PO before goods arrive)
    3. Transaction: create Payment + update Purchase (paidAmount)

  Payment number auto-generated: PAY-YYYYMMDD-XXX (tenant-scoped)

Payment History on Detail Pages:
  InvoiceDetailPage — shows payment history table below print template + "Record Payment" button in header
  PurchaseDetailPage — shows payment summary card + history list in right panel + "Record Payment" button in header (with amount + payment method dialog)

Accounts Receivable / Payable:
  GET /api/trading/payments/receivable — unpaid invoices with aging (0-30/31-60/61-90/90+ days), by customer summary
  GET /api/trading/payments/payable — unpaid purchases with aging, by supplier summary
  Frontend: ReceivablePage + PayablePage under Payments sidebar group
  Features: summary cards, aging bar chart (recharts), by customer/supplier table, full invoice/purchase list with aging badges, CSV export

Key Patterns:
  - useInfiniteOptions for invoice/purchase dropdowns (paginated + server search)
  - Comma-separated status filter: ?status=UNPAID,PARTIAL (backend splits + uses Prisma `in`)
  - unpaidOnly=true filter on purchases (post-filter: balance > 0)
  - FormDropdown direct (not FormFieldsGenerator) for async dropdown with onSearch/onLoadMore
  - Dialog reset: methods.reset() + infinite.reset() on open
```

### Sales Returns — File Reference

```
Database:
  model SaleReturn {
    id, returnNo, saleId, customerId, tenantId, totalAmount, reason, notes, createdBy, createdAt
    @@unique([returnNo, tenantId])
  }

  model SaleReturnItem {
    id, saleReturnId, saleItemId, productId, quantity, unitPrice, totalPrice
  }

  Relations added to: Tenant, User, Sale, Customer, Product

Backend:
  apps/api/src/modules/trading/sale-returns/
  ├── sale-returns.module.ts
  ├── sale-returns.controller.ts       # GET list, GET :id, GET by-sale/:saleId, POST create
  ├── sale-returns.service.ts          # findAll, findOne, findBySale, create (stock restore + invoice adjust)
  └── dto/
      ├── create-sale-return.dto.ts    # saleId, reason, notes, items[] (ValidateNested)
      └── query-sale-return.dto.ts     # search, saleId, customerId, pagination

Frontend:
  apps/web/src/modules/trading/
  ├── pages/SaleReturnsPage.tsx        # DataTable + create Dialog with item selection
  └── hooks/useSaleReturns.ts          # useSaleReturns + useSaleReturnMutations

API Endpoints:
  GET  /api/trading/sale-returns              # List (paginated + search)
  GET  /api/trading/sale-returns/:id          # Get single with items
  GET  /api/trading/sale-returns/by-sale/:id  # Returns for specific sale
  POST /api/trading/sale-returns              # Create return

Permissions:
  trading.sales-returns.read       # View return history
  trading.sales-returns.create     # Create new returns

Return Flow:
  1. User selects a COMPLETED sale order (useInfiniteOptions with status=COMPLETED)
  2. System fetches sale items + existing returns for that sale
  3. Calculates available qty per item (original - already returned)
  4. User selects items + return quantities (with +/- buttons)
  5. Transaction:
     a. Create SaleReturn + SaleReturnItems
     b. Restore stock (upsert inventory with increment)
     c. Adjust invoice amount (reduce by return total, recalculate status)
  6. Return number auto-generated: RET-YYYYMMDD-XXX (tenant-scoped)

Partial Return Support:
  - Can return subset of items with reduced quantities
  - Tracks cumulative returns per saleItem across multiple returns
  - Prevents over-returning (validates against available qty)

Invoice Adjustment:
  - If sale has active invoice, reduces invoice.amount by return total
  - Recalculates invoice status (PAID/PARTIAL/UNPAID)
  - Handles overpayment case (paidAmount > new amount → PAID)

Key Patterns:
  - useInfiniteOptions for sale order dropdown
  - Fetches sale detail + existing returns on SO selection
  - ReturnLineItem state managed with useState (not react-hook-form)
  - Dialog width: w-[560px] (wider for item table)
```

### Projects — File Reference

```
Database:
  model Project { id, name, description, location, budget, status, startDate, endDate, tenantId }
  model ProjectMaterial { projectId, productId (@@unique), estimatedQty, usedQty, unitPrice }
  Purchase model — added projectId (optional link to project)

Backend (MOVED to top-level common module):
  apps/api/src/modules/projects/           # ← was trading/projects/, now shared
  ├── projects.module.ts                   # Registered in AppModule (not TradingModule)
  ├── projects.controller.ts               # @Controller('projects') — shared /projects endpoint
  ├── projects.service.ts                  # Tenant-scoped, computed budget/spent fields
  └── dto/
      ├── create-project.dto.ts
      └── query-project.dto.ts

Frontend (pages/hooks remain in trading/, API endpoint changed):
  apps/web/src/modules/trading/
  ├── pages/ProjectsPage.tsx
  ├── pages/ProjectDetailPage.tsx
  └── hooks/
      ├── useProjects.ts           # API: /projects (was /trading/projects)
      └── useProjectMutations.ts   # API: /projects (was /trading/projects)

API Endpoints:
  GET    /api/projects              # List (paginated + search + status filter)
  GET    /api/projects/:id          # Detail (materials + purchases + computed fields)
  POST   /api/projects              # Create
  PUT    /api/projects/:id          # Update
  DELETE /api/projects/:id          # Delete (blocked if has received POs)
  PUT    /api/projects/:id/status   # Status transition
  POST   /api/projects/:id/materials        # Add material (unique per product)
  PUT    /api/projects/:id/materials/:mid   # Update material qty/price
  DELETE /api/projects/:id/materials/:mid   # Remove material

Note: Permissions remain trading.projects.* for backward compatibility.
      Route changed: /trading/projects → /projects (sidebar, routes, header all updated)
      HRM module uses /projects endpoint for employee/attendance project dropdowns.

Status Flow:
  PLANNING → IN_PROGRESS, ON_HOLD
  IN_PROGRESS → COMPLETED, ON_HOLD
  ON_HOLD → IN_PROGRESS, PLANNING
  COMPLETED → (terminal)

PO → Project Link:
  Purchase model has optional projectId field
  PurchaseFormPage has "Project (Optional)" dropdown (useInfiniteOptions)
  Pre-selects from URL param: /trading/purchases/new?projectId=xxx
  On PO receive: auto-increments ProjectMaterial.usedQty for matching products

Budget Computation:
  budget = user-set project budget
  estimatedCost = sum(material.estimatedQty * material.unitPrice) from BOQ
  totalSpent = sum(purchase.netAmount) where status=RECEIVED and projectId=project
  remaining = budget - totalSpent

Permissions:
  trading.projects.read
  trading.projects.create
  trading.projects.update     # Status change, material CRUD
  trading.projects.delete
```

### Goods Received — File Reference

```
No new backend model or API needed — reuses Purchase model with status=RECEIVED filter.

Frontend:
  apps/web/src/modules/trading/
  └── pages/GoodsReceivedPage.tsx     # DataTable showing received POs

  Reuses existing hooks:
    usePurchases({ status: "RECEIVED" })   — filters purchases by received status
    useSuppliers()                          — for supplier filter dropdown

Route: /trading/purchases/received
Permission: trading.purchases.read (reuses existing)
Sidebar: Already configured (key: "goods-received", group: "Purchases")

Columns: PO Number (link to detail), Supplier, Items, Total, Payment Status, Created By, Date
Filters: Supplier dropdown (searchable, multi-select)

Key Pattern:
  - No new backend code needed
  - Frontend-only feature — just a filtered view of existing Purchase data
  - Payment status computed client-side: net vs paid amounts
```

### Dashboard — Payment Stats

```
Backend (dashboard.service.ts):
  Added to getStats() Promise.all:
    - payment.aggregate({ type: 'RECEIVED' }) → totalReceived (sum of amounts)
    - payment.aggregate({ type: 'MADE' }) → totalMade (sum of amounts)
    - invoice.count({ status: UNPAID|PARTIAL }) → unpaidInvoices

Frontend (DashboardPage.tsx):
  3 new stat cards (9 total, grid: 2→3→6 cols):
    - Payment Received (green, in millions)
    - Payment Made (warning, in millions)
    - Unpaid Invoices (danger, count)
```

### useApi — Refetch Pattern

```
The useApi hook uses a refreshKey pattern for reliable refetch:

  const [refreshKey, setRefreshKey] = useState(0);
  const paramsRef = useRef(params);           // always fresh params
  paramsRef.current = params;

  const fetchData = useCallback(async () => {
    const res = await api.get(url, { params: paramsRef.current, ... });
    setData(res.data);
  }, [url, JSON.stringify(params), enabled, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

Key points:
  - refreshKey increment forces useCallback identity change → useEffect re-runs
  - paramsRef ensures latest params used even if closure is stale
  - Fixes issue where refetch after mutation didn't show new data
```

### Category Markup System

Categories can define a default markup (fixed Ks or percentage) that auto-fills into the Product form.

```
Database:
  model Category {
    markup      Decimal @default(0) @db.Decimal(12, 2)
    markupType  String  @default("percentage")    // "percentage" or "fixed"
  }

Settings Page (TradingSettingsPage):
  - Category dialog has "Default Markup" field using amount-with-type (Ks/% selector)
  - Category table shows markup column
  - EditDialog extended with type: "amount-with-type" support (typeKey + typeValue)

API:
  POST /api/trading/settings/categories   { name, description?, markup?, markupType? }
  PUT  /api/trading/settings/categories/:id  { name?, description?, markup?, markupType? }
```

### Product — Supplier Link + Markup Auto-Pricing

```
Database:
  model Product {
    supplierId  String?    // optional default supplier
    supplier    Supplier?  @relation("ProductSupplier")
  }

Product Drawer (ProductDrawer.tsx):
  1. Supplier dropdown (useInfiniteOptions, searchable, clearable, optional)
     — passed via FormFieldsGenerator async dropdown props
  2. Markup field (FormAmountWithType — Ks/%)
     — Auto-fills from selected category's default markup
     — Editable per product
  3. Selling price auto-calculation:
     — Cost price + markup → selling price
     — Rounds to nearest 500 (midpoint 250 goes down)
     — Example: cost=18000, markup=15% → 18000+2700=20700 → round → 20500

  Rounding logic (roundTo500):
    remainder = value % 500
    if remainder <= 250: round down (21250 → 21000)
    if remainder > 250: round up (21300 → 21500)

  Auto-fill flow:
    Category selected → markup auto-fills from category default
    Cost price changed → selling price recalculated
    Markup changed → selling price recalculated

  DTO handling:
    markup/markupType are accepted in DTO (to pass whitelist validation)
    but stripped before Prisma create/update (not stored in DB)
    They are UI-only fields for price calculation

Query filter:
  GET /api/trading/products?supplierId=xxx  — filter products by supplier
```

### PurchaseFormPage — Supplier Product Filter

```
When supplier is selected in PurchaseFormPage:
  1. methods.watch("supplierId") tracks selection
  2. supplierFilter state synced via useEffect
  3. productInfinite params updated: { supplierId: "xxx" }
  4. useInfiniteOptions re-fetches with new params (JSON.stringify dependency)
  5. Product dropdown shows only that supplier's products

When no supplier selected:
  - All products shown (no supplierId filter)

Backend:
  QueryProductDto has supplierId?: string
  ProductsService.findAll: if (supplierId) where.supplierId = supplierId
```

### FormFieldsGenerator — Extended Field Types

```
Standard types: text, number, password, email, textarea, dropdown, date, radio, toggle, time

Extended types added:
  1. amount-with-type — Number input + Ks/% type selector
     Usage in formSchema:
       { name: "markup", label: "Markup", type: "amount-with-type", typeName: "markupType" }
     Renders: FormAmountWithType component

  2. color — Color picker with preset swatches + custom hex input
     Usage in formSchema:
       { name: "color", label: "Color", type: "color" }
     Renders: FormColorPicker component (15 preset colors + native color input + hex text input)
     Stores value as hex string (e.g. "#3B82F6")

  3. dropdown (async) — Dropdown with server search + infinite scroll
     Usage in formSchema:
       {
         name: "supplierId", label: "Supplier", type: "dropdown",
         options: supplierInfinite.options,
         onSearch: supplierInfinite.setSearch,
         onLoadMore: supplierInfinite.loadMore,
         asyncLoading: supplierInfinite.loading,
         hasMore: supplierInfinite.hasMore,
         searchable: true, clearable: true,
       }
     Props passed through to FormDropdown automatically

Comma-separated status filter (backend pattern):
  ?status=UNPAID,PARTIAL or ?status=PENDING,RECEIVED
  Backend splits: status.split(',') → Prisma { in: [...] }
  Used by: invoices.service.ts, purchases.service.ts

unpaidOnly filter (purchases):
  ?unpaidOnly=true — post-filters purchases where balance > 0
  Used by: PaymentMadePage to hide fully-paid POs from dropdown
```

### Inventory — File Reference

```
Backend:
  apps/api/src/modules/trading/inventory/
  ├── inventory.module.ts
  ├── inventory.controller.ts       # @CurrentUser() + tenantId
  ├── inventory.service.ts          # Stock view + adjust + warehouse list
  └── dto/
      ├── query-inventory.dto.ts    # search, status, warehouseId, pagination
      └── stock-adjustment.dto.ts   # productId, warehouseId, quantity, reason

Frontend:
  apps/web/src/modules/trading/
  ├── pages/InventoryPage.tsx       # Summary cards + DataTable + adjust dialog
  └── hooks/useInventory.ts         # useInventory, useWarehouses, useStockAdjust

API Endpoints:
  GET  /api/trading/inventory              # Stock list (product-centric view)
  GET  /api/trading/inventory/warehouses   # List warehouses
  POST /api/trading/inventory/adjust       # Manual stock adjustment

Response includes summary:
  { data: [...], meta: {...}, summary: { totalProducts, inStock, lowStock, outOfStock } }

Stock Status Logic:
  stock === 0              → "out-of-stock" (red)
  stock <= minStock        → "low-stock" (amber)
  stock > minStock         → "in-stock" (green)

Manual Adjustment:
  quantity > 0  → add stock
  quantity < 0  → deduct stock (validates won't go negative)
  reason        → optional text (e.g., "Damaged", "Count correction")

Permissions:
  trading.inventory.read      # View stock
  trading.inventory.update    # Manual adjust
```
