# Estado del Proyecto - Landed (Backend + Frontend)

**Fecha:** 8 de Abril de 2026
**Backend URL:** `https://landed-api-staging-575929073955.us-central1.run.app`

---

## ✅ Sesión 8 de Abril 2026 — UI completa + Push a GitHub

### Resumen
Sesión de iteración de UI sobre el scaffold existente. Diseño final con design system, modo oscuro, jerarquía de cards, secciones de contenido y push inicial a GitHub.

**GitHub:** `git@github.com:luisfm44/landed_frontend.git` — branch `main`, upstream configurado, 72 objetos pusheados.

### Cambios principales

#### Design System + Modo Oscuro
- `app/globals.css` — `@theme {}` con tokens semánticos: `--color-success/light`, `--color-warning/light`, `--color-danger/light`, `--color-brand/light`, `--color-primary-light`, `--color-surface`, `--color-ld-border`, `--shadow-card`, `--shadow-elevated`.
- `:root` overrides: `--primary: oklch(0.488 0.243 264.376)` (#2563EB), `--background: oklch(0.980 0 0)`, `--radius: 0.625rem`.
- `.dark {}` overrides: `--background: #0B0B0C`, `--card: #111113`, `--border: #26262B`, fills translúcidos.
- Ambient glow en `.dark body` con dos gradientes radiales.
- `ThemeToggle` client component. `useReveal` hook para animaciones reveal-on-scroll.

#### Hero (`app/page.tsx`)
- H1: `text-[#0f172a] font-extrabold` + gradiente `from-blue-600 to-violet-600` (valores explícitos, no vars CSS).
- Eliminado overlay `from-primary/5 to-brand/5` que lavaba el texto.
- Hero `min-h-[80vh]` con search bar y trust text.

#### Secciones de contenido (`app/page.tsx`)
Layout de 6 secciones en orden:
1. **Hero** — pregunta→respuesta H1, search bar, trust text
2. **Real Example** — comparación KEF LS50 Meta: local $12.9M vs importado $8.7M
3. **How It Works** — 3 pasos con números `text-4xl font-black text-gray-100`
4. **Resultados** (si hay búsqueda) ó **Top Deals + All Opportunities** (default)
5. **Value Prop** — 3 cards `bg-gray-50 dark:bg-surface/60`
6. **CTA final** — scroll a top via `window.scrollTo`

#### Card hierarchy (`components/opportunity-card.tsx`)
Orden estricto reescrito:
1. Precio `text-4xl font-extrabold text-[#0f172a]` + savings inline `text-success`
2. Pill de recomendación: subasta (brand/purple) | worthImporting (success/green) | buyLocally (gray text liso)
3. Explicación `text-sm font-semibold text-[#1e293b]` — con valor `formatUsd(savingsAmount)` o `explanation[0]`
4. Segunda línea de explicación `text-xs text-gray-400` si existe `explanation[1]`
5. Título `text-sm font-medium text-gray-600` tras `border-t border-ld-border`
6. Meta `text-xs text-gray-400` — score · ofertas · marketplace
7. Detalles de subasta — `<span>` inline liso (sin box ni borde)
8. `pricingWarning` — `text-warning` + TriangleAlert

Hover: `hover:scale-[1.02]` + `hover:shadow-elevated`.
CTA:
- Subasta → `"Ir a la subasta"` — `bg-primary`
- Worth importing → `"Comprar por $X"` — `bg-primary` + glow `hover:shadow-[0_0_16px_rgba(37,99,235,0.35)]`
- Not worth importing → `"Ver oferta"` — `bg-gray-100 text-gray-600`

`border-t-2 border-t-primary` solo en top deals. Sin pill borders, sin left accent, sin emoji en etiquetas de score.

#### AuctionTimer (`components/auction-timer.tsx`)
- Fix de hidratación: `useState<number | null>(null)` (SSR y cliente ambos renderizan `null`); valor real se calcula en `useEffect`.
- Retorna `<span>` solo (sin `<div>`, sin progress bar) — seguro dentro de `<span>` en card.
- Color: `text-danger` (<10min) | `text-warning` (<1hr) | `text-muted-foreground` en otro caso.

#### i18n (`messages/es.json` + `messages/en.json`)
Claves añadidas bajo `"home"`:
- `home.example.*` — sección Real Example (KEF LS50 Meta)
- `home.howItWorks.*` — sección How It Works (3 pasos)
- `home.valueProp.*` — sección Value Prop (3 beneficios)

Claves añadidas bajo `"card"`:
- `cheaperThanLocal`, `noLocalAdvantage`, `listingPrice`, `viewOffer`, `buyFor`, `joinAuction`
- Sin emoji en labels de score

⚠️ **Crítico**: `howItWorks` y `valueProp` DEBEN estar anidadas dentro del objeto `"home"`. Un bug previo las insertó al top-level causando `MISSING_MESSAGE`. Fix aplicado con script Python.

### Bugs resueltos

| Bug | Causa | Fix |
|-----|-------|-----|
| Hero ilegible | Overlay `from-primary/5` + variables OKLCH claras | Eliminado overlay; colores explícitos `#0f172a` y `blue-600/violet-600` |
| Componente duplicado | `replace_string_in_file` solo reemplazó imports, dejando body antiguo | `head -n N > /tmp/clean && mv` para truncar al largo correcto |
| Hydration mismatch en AuctionTimer | `useState(() => Date.now())` diferente en SSR y cliente | `useState<number | null>(null)` + cálculo en `useEffect` |
| `<p>` contiene `<div>` | AuctionTimer retornaba `<div>`, colocado dentro de `<p>` | Wrapper de card cambiado a `<span>`; AuctionTimer reescrito a `<span>` |
| MISSING_MESSAGE | `howItWorks`/`valueProp` en top-level JSON | `d["home"][key] = d.pop(key)` para ambos locales |

### Estado del build
`npm run build` → exit 0. GitHub push: 72 objetos a `main`, upstream configurado.

### Pendientes (próxima sesión)
- [ ] Conectar `app/opportunities/page.tsx` al endpoint real `GET /opportunities`
- [ ] Reemplazar `MOCK_OPPORTUNITIES` en `app/page.tsx` con fetch real al backend
- [ ] Modo oscuro en `SearchBar` — aún no tiene tokens `dark:`
- [ ] Deploy a Vercel / hosting frontend

---

## ✅ Sesión 8 de Abril 2026 — Frontend Scaffold (Next.js + Tailwind + shadcn/ui)

### Stack
- **Next.js 16.2.3** — App Router, TypeScript strict, Turbopack
- **Tailwind CSS v4** — `@import "tailwindcss"` en globals.css (NO usar sintaxis antigua `@tailwind base/components/utilities`)
- **shadcn/ui** — ⚠️ INSTALADO CON `@base-ui/react` (NO Radix UI). **`asChild` NO existe** en ningún componente. Usar elementos HTML + clases Tailwind en su lugar.
- **lucide-react 1.7.0** — íconos: `Search`, `ExternalLink`, `TrendingDown`, `Gavel`, `Tag`

### Ubicación
`/Users/luisfelipemarincano/Documents/landed/landed-frontend`

### Archivos creados

#### `types/opportunity.ts`
```typescript
export type ListingType = "auction" | "fixed";
export interface Opportunity {
  title: string; price: number; landedPrice: number;
  savingsPercentage: number; score: number;
  type: ListingType; externalUrl: string;
  marketplace?: string; imageUrl?: string; currency?: string;
  shippingMethod?: string; explanation?: string[]; pricingWarning?: string;
}
```

#### `lib/format.ts`
- `formatUsd(amount, decimals=0)` — `Intl.NumberFormat en-US USD`
- `formatCop(amount)` — `Intl.NumberFormat es-CO COP`
- `clamp(value, min, max)`

#### `components/header.tsx`
Header sticky con logo `Landed` + nav link a `/opportunities`.

#### `components/search-bar.tsx`
`"use client"` — Input + Button, props: `onSearch(q: string)`, `isLoading: boolean`.

#### `components/opportunity-card.tsx`
Card con score, precio US / Landed / Ahorro, badges, tooltip de explicación, link externo.
- **Fix aplicado**: `TooltipTrigger` sin `asChild` (no soportado en base-ui)
- **Fix aplicado**: link externo con `<a>` + clases Tailwind en lugar de `<Button asChild><a>`
- Score tiers: `≥75` → emerald, `≥50` → amber, else muted

#### `app/layout.tsx`
Header global + `TooltipProvider` + Footer con nota de afiliados.

#### `app/page.tsx`
`"use client"` — hero + `SearchBar` + grid de `OpportunityCard`.
- Datos mock: KEF R3 Meta, McIntosh MA352, Technics SL-1200MK2
- Loading: 3 skeleton cards con `animate-pulse`
- ⚠️ Pendiente: reemplazar mock por fetch real al backend

#### `app/opportunities/page.tsx`
Server Component placeholder. ⚠️ Pendiente: conectar a `GET /opportunities`.

### Estado del build
`npm run build` → exit 0. 3 rutas estáticas: `/`, `/_not-found`, `/opportunities`.

### Pendientes (próxima sesión)
- [ ] Conectar `app/opportunities/page.tsx` al endpoint real `GET /opportunities?q=&minSaving=0.1&minScore=50&limit=20`
- [ ] Eliminar mock data de `app/page.tsx` y usar fetch real
- [ ] Integrar búsqueda real en `SearchBar.onSearch(query)` con param `q`
- [ ] Deploy del backend (cambios del 7 de Abril) a staging
- [ ] Cache Redis para `/opportunities`

---

## ✅ Sesión 8 de Abril 2026 — Internacionalización (ES/EN) con next-intl

### Stack agregado
- **next-intl** — detección automática de idioma vía header `Accept-Language`. Sin cambio de URLs (no i18n routing).

### Lógica de detección
`i18n/request.ts` lee `Accept-Language` del request; si el idioma primario es `es` → español, cualquier otro → inglés.

### Archivos creados
- `messages/en.json` — todos los strings en inglés (header, hero, search, card, footer, meta, mockData)
- `messages/es.json` — todos los strings en español
- `i18n/request.ts` — `getRequestConfig` con detección de locale

### Archivos modificados
- `next.config.ts` — envuelto con `createNextIntlPlugin("./i18n/request.ts")`
- `app/layout.tsx` — async, `NextIntlClientProvider`, `generateMetadata` traducida, footer traducido
- `components/header.tsx` — async server component, `getTranslations("header")`
- `components/search-bar.tsx` — `useTranslations("search")` (client), eliminado prop `placeholder`
- `components/opportunity-card.tsx` — añadido `"use client"` + `useTranslations("card")`
- `app/page.tsx` — `useTranslations("home")` + `useTranslations("mockData")` para mock explanations
- `app/opportunities/page.tsx` — async, `generateMetadata` + `getTranslations("opportunities")`

### Estado del build
`npm run build` → exit 0. Rutas dinámicas (ƒ): `/`, `/_not-found`, `/opportunities`.

---

# Estado del Proyecto - Backend Landed

**Fecha:** 7 de Abril de 2026
**Estado:** Staging operativo + Catálogo v4 + OpportunityService refactorizado + Endpoint GET /opportunities
**URL:** `https://landed-api-staging-575929073955.us-central1.run.app`

---

## ✅ Sesión 7 de Abril 2026 — Catálogo v4 + OpportunityService + Endpoint /opportunities

### 1. Catálogo de Productos — Iteración 4 (`src/products/catalog.seed.ts`)

Objetivo: resolver gaps reales en unresolved-titles sin agregar ruido.

**Nuevo producto:**
- `Focal Twin6 ST6` (studio-monitors) — con 2 aliases limpios

**Nuevo alias:**
- `Focal Professional Shape 50` → producto `Focal Shape 50` (studio-monitors)

**Seed validado:** idempotente — `created: 0, skipped: 130` en segunda corrida; 1 alias creado correctamente en primera corrida.

**Cobertura post-seed:** 62% relevantes (885/1424) — sin regresiones.

---

### 2. OpportunityService — Nuevos métodos y refactors

#### `findOpportunities(listings)` — nuevo método público
- Agrupa `NormalizedProduct[]` por `productId`.
- Ignora listings sin `productId`.
- Por cada grupo: ordena por precio ascendente y expone `bestListing`, `lowestPriceUsd`, `listingCount`.
- Retorna `OpportunityResult[]` ordenado por `lowestPriceUsd`.

#### `buildOpportunities()` — refactorizado para usar `findOpportunities`
- Reemplaza iteración directa sobre `products` por llamada a `this.findOpportunities(products)`.
- Usa `group.bestListing` como producto base para cada cálculo.
- Cambio de firma: `landedCosts: Map<string, number>` ahora es legacy fallback; nuevo parámetro opcional `pricingResults?: Map<string, PricingResult>` en posición 8.
- `landedCostUsd` calculado desde `pricing.breakdown.totalCop / trm` si existe, fallback a `landed`.
- `saving` y `savingPct` usan `pricing.savingsCop / savingsPercentage` si disponibles; fallback al cálculo manual.
- TRM: `pricing.exchangeRateUsed ?? exchangeRate ?? 4000`.
- Validación: `if (local == null || (pricing == null && landed == null))`.

#### `calculateBuyScore()` — señales adicionales y scoring multiplicativo
Señales añadidas (opcionales, sin romper llamadas existentes):
- `localPriceSource?: string` — multiplicador `× 1.05` si es `'ML_MATCH'`
- `pricingWarning?: string` — multiplicador `× 0.90` si existe
- `listingCount?: number` — `liquidityBoost = min(count/5, 1) * 5` (escala continua)

Score cappado a 100 con `Math.min(100, Math.round(score))`.

#### `buildExplanation(opportunity)` — nuevo método privado
Genera `string[]` con explicaciones legibles por humano:
- `"Ahorro del {N}% frente/comparado con precio local"` (con porcentaje real)
- `"Alta oportunidad de compra"` si `buyScore > 75`
- Método de envío (`locker` / `direct`)
- Nota de pricingNotes que mencione envío (regex `/envío|ship/i`)
- `"Comparado contra precio real del mercado"` si `opportunityType === 'REAL'`
- `"Múltiples opciones disponibles para este producto"` si `listingCount > 1`
- `"Riesgo: {warning}"` si `pricingWarning` existe
- Deduplica con `Array.from(new Set(lines))`

#### `OpportunityResult` — nuevo tipo en `opportunity.model.ts`
```typescript
interface OpportunityResult {
  productId: string;
  listingCount: number;
  lowestPriceUsd: number;
  bestListing: NormalizedProduct;
  listings: NormalizedProduct[];
}
```

#### Campos nuevos en `Opportunity` (`opportunity.model.ts`)
- `listingCount?: number`
- `pricingNotes?: string[]`
- `shippingMethod?: string`
- `pricingWarning?: string`
- `explanation?: string[]`

---

### 3. OpportunitiesController — `GET /opportunities`

**Archivo:** `src/opportunities/opportunities.controller.ts` (nuevo)

**Endpoint:** `GET /opportunities`

**Query params:**
| Param | Default | Descripción |
|-------|---------|-------------|
| `q` | `'studio monitors'` | Query de búsqueda |
| `minSaving` | `0.1` | Umbral mínimo de ahorro (0–1) |
| `minScore` | `50` | Umbral mínimo de buyScore |
| `limit` | `20` | Máximo resultados (cap: 100) |

**Flujo:**
1. `listingService.searchListings(q, undefined, 100)` — listings activos de DB
2. Filtra `l.productId != null`
3. Mapea con `toNormalizedProduct()` (incluye `productId`, `sellerRating`, `weightKg`/`isAuction` desde `metadata`)
4. `pricingService.simulatePricingDetailed(resolvedListings)` → `Map<string, PricingResult>`
5. Construye `localPrices` desde `estimatedLocalPriceCop / exchangeRateUsed` — filtra entries sin `estimatedLocalPriceCop` para evitar `local = 0`
6. `opportunityService.buildOpportunities(...)` con `pricingResults` como fuente principal
7. Filtra `savingPct >= savingThreshold && buyScore >= scoreThreshold`
8. `slice(0, resultLimit)`

**Respuesta:**
```json
{
  "query": "focal",
  "totalFound": 12,
  "returned": 5,
  "results": [...]
}
```

**Seguridad / validaciones:**
- Thresholds con `Math.max(0, ...)` — evita negativos
- `isNaN()` fallback a default en todos los parsed params
- `limit` cap a 100 con `Math.min`
- `InternalServerErrorException` en catch (no expone stacktrace)

**Módulo actualizado:** `OpportunitiesModule` importa `PricingModule` y `CrawlerModule`.

---

### 4. OpportunitiesModule (`src/opportunities/opportunities.module.ts`)
- Importa `PricingModule` y `CrawlerModule` (para `ListingService`)
- Registra `OpportunitiesController`
- Exporta `OpportunityService` (sin cambios para consumidores)

---

### Pendientes
- Conectar `GET /opportunities` a datos de Reverb/eBay con `productId` real (ya hay listings resueltos en staging).
- Deploy a staging de los cambios de hoy.
- Mover `toNormalizedProduct()` a `src/common/mappers/listing.mapper.ts` para reutilización con `SearchService`.
- Agregar cache (Redis) al endpoint `/opportunities` para evitar recalcular en cada request.
- Tests unitarios para `OpportunityService.findOpportunities()` y `buildExplanation()`.



### Objetivo
Ligar los listings crawleados a productos canónicos para habilitar análisis por producto y calcular coverage de inventario. Sin tocar `/search`, `OpportunityService`, `PricingService` ni `SearchService`.

### Nuevas entidades y módulo de productos

#### `src/products/entities/product.entity.ts`
- Tabla `products` — producto canónico con `brand`, `model`, `displayName`, `normalizedName` (índice), `category`, `metadata` (jsonb).
- Índice único sobre `(brand, model)`.

#### `src/products/entities/product-alias.entity.ts`
- Tabla `product_aliases` — múltiples variantes de nombre de marketplace por producto.
- `aliasRaw` (texto original) + `aliasNormalized` (único global, sin acentos/puntuación).
- `source?: string` — marketplace de origen del alias.

#### `src/products/products.service.ts`
- `normalize(text)` — lowercase → trim → reemplaza no-alfanuméricos con espacio → colapsa espacios.
- `resolveAlias(rawText)` — lookup exacto por `aliasNormalized`.
- `resolveAliasByPrefix(normalizedText)` — busca aliases donde el título normalizado **empieza con** el alias (maneja sufijos de color/año/condición). Usa `starts_with()` PostgreSQL; devuelve el alias más largo.
- `findByBrandAndModel`, `findByNormalizedName`, `createProduct`, `createAlias` (idempotente).

#### `src/products/product-resolver.types.ts`
- `ResolveStrategy`: `alias_exact | alias_prefix | brand_model_exact | normalized_name_exact | not_found`.

#### `src/products/product-resolver.service.ts` (read-only, nunca crea productos)
Cadena de resolución:
1. `alias_exact` — normalize(brand + title) → resolveAlias()
2. `alias_exact` — normalize(title) → resolveAlias()
3. `alias_prefix` — normalize(title) → resolveAliasByPrefix() *(nuevo — maneja sufijos de marketplace)*
4. `brand_model_exact` — brand + modelo extraído → findByBrandAndModel()
5. `normalized_name_exact` — normalize(title) → findByNormalizedName()
6. `not_found`

#### `src/products/products.controller.ts`
- `POST /products` — crear producto
- `POST /products/aliases` — agregar alias
- `GET /products` — listar catálogo
- `GET /products/resolve/preview?title=&brand=` — probar resolución *(ruta antes de `/:id`)*
- `GET /products/:id` — detalle de producto

#### `src/products/products.module.ts` + `src/products/catalog.seed.ts`
- 30 productos en catálogo (idempotente vía `.orIgnore()`):
  - Hi-fi: KEF R3 Meta, KEF LS50 Meta, B&W 804 D4, Focal Kanta No.2, Harbeth M30.2 XD, McIntosh MA352, MA8900, Naim Nait XS 3, Luxman L-509X, Chord Hugo 2, Chord Qutest, Cambridge Audio CXN V2, Sennheiser HD 800 S, Focal Clear Mg, Rega Planar 3
  - Technics (dominan inventario): SL-1200 MK2, MK3, MK5, MK6, M7B
  - Focal studio monitors: Shape 50/65/Twin/40, Solo6 Be, Twin6 Be, Trio11 Be, SM9, Alpha Twin Evo, Listen Professional
- Ejecutar con `npm run seed:catalog`

### Migraciones TypeORM (locales — pendiente staging)
| Archivo | Qué hace |
|---------|----------|
| `1774917724733-AddProductCatalog` | Crea tablas `products` y `product_aliases` |
| `1774918047868-RefactorProductAliasAddNormalized` | Agrega `alias_normalized` único global |
| `1774919366905-LinkListingToProduct` | Agrega `product_id`, `product_resolution_strategy`, `product_resolution_text` a `listings` |

### Integración en el crawler (pasiva, best-effort)

#### `src/crawler/entities/listing.entity.ts`
Tres columnas nuevas nullable:
```typescript
productId?: string;               // FK → products.id (SET NULL on delete)
productResolutionStrategy?: string;
productResolutionText?: string;
```

#### `src/crawler/workers/base.worker.ts`
- `setProductResolver(resolver)` — setter inyectado desde `CrawlerModule.onModuleInit()`.
- `resolveListingProducts(listings)` — llama al resolver para cada listing; logs `product_resolved` (debug) / `product_not_resolved` (debug) / `product_resolution_error` (warn). Best-effort: nunca interrumpe el crawl.
- Llamado entre `normalizeListings()` y `saveListings()` en `process()`.

#### `src/crawler/crawler.module.ts`
- Importa `ProductsModule`.
- Inyecta `ProductResolverService` y llama `worker.setProductResolver()` para los 4 workers en `onModuleInit()`.

### Endpoints de administración

#### `src/crawler/crawler.controller.ts` — nuevos endpoints
- `GET /crawler/statistics/product-coverage` — cobertura total, por marketplace y por estrategia.
- `GET /crawler/statistics/unresolved-titles?limit=50&marketplace=X` — títulos activos sin producto (con `normalizedTitle`).
- `GET /crawler/listings?marketplace=X&limit=N&offset=N` — paginado con offset (nuevo).
- `PATCH /crawler/listings/:id/product` — actualiza campos de resolución de producto en un listing.

### Scripts de validación y backfill

#### `scripts/validate-product-catalog.js` (`npm run validate:catalog`)
Checklist completo:
1. Cuenta productos en catálogo
2. Prueba 19 casos de resolución (15 esperan match, 4 esperan `not_found`)
3. Muestra cobertura por marketplace y estrategia
4. Lista top 20 títulos sin resolver

**Resultado actual:** 19/19 tests pasan ✅

#### `scripts/backfill-product-resolution.js` (`npm run backfill:product-resolution`)
- Pagina por todos los listings activos sin `productId` (por marketplace).
- Llama a `/products/resolve/preview` por cada uno.
- Aplica PATCH via `/crawler/listings/:id/product`.
- Soporte `DRY_RUN=true` para previsualizar sin escribir.

#### `scripts/test-products.js` (`npm run script:test-products`)
- Prueba manual rápida de resolución contra el servidor local.

### Resultado del backfill

| Marketplace | Coverage | Listings resueltos |
|-------------|----------|--------------------|
| Reverb | 27% | 153 / 575 |
| eBay | 16% | 123 / 750 |
| **Total** | **21%** | **276 / 1325** |

Estrategia dominante: `alias_prefix` (246) — maneja sufijos de año/color/condición de Reverb/eBay.

### Gaps identificados para próxima iteración del catálogo
- **Technics** SL-1200MK7, M7L, MK3D, M5G — variantes no en catálogo
- **KEF** EGG Duo, Q Concerto Meta, LSX II LT — línea KEF incompleta  
- **Focal** Alpha 50 Evo, CMS65, Clear Pro MG — más variantes Focal studio
- Items no-audio mezclados en crawl (impresoras, accesorios DJ)

### Fix ESLint
- `eslint.config.mjs` — `scripts/**` agregado a `ignores` para excluir archivos JS puros del typed-linting.

### Pendientes
- **Deploy a staging** — las 3 migraciones de producto correrán automáticamente en el próximo `deploy:staging` via `migrationsRun: true`.
- **Re-seed en staging** — ejecutar `npm run seed:catalog` apuntando a staging tras el deploy.
- **Backfill en staging** — ejecutar `BASE_URL=https://landed-api-staging-... npm run backfill:product-resolution`.
- **Ampliar catálogo** — agregar variantes identificadas arriba (Technics MK7/M7L/MK3D, KEF EGG, Focal Alpha/CMS/Clear Pro).
- **Proxy residencial Audiogon** — bloqueado por CF Bot Management, requiere Brightdata/Oxylabs.



## ✅ Sesión 24 de Marzo 2026 — Headless Browser + Formato de Código

### Playwright / Headless Browser (✅ Completado y Desplegado)
- Creado `src/crawler/services/headless-browser.service.ts` — servicio Playwright con:
  - Singleton Chromium lazy-launch, reutilizado entre requests.
  - Stealth: `navigator.webdriver=false`, `outerWidth/Height`, `chrome.runtime/loadTimes/csi`, `navigator.permissions` patch.
  - Soporte de proxy residencial vía `HEADLESS_PROXY_SERVER` env var.
  - Feature flag `HEADLESS_BROWSER_ENABLED=true` (por defecto desactivado).
  - Cleanup en `onModuleDestroy()`.
- `audiogon.worker.ts` — inyecta `HeadlessBrowserService`, fallback CF → headless por página.
- `usaudiomart.worker.ts` — mismo patrón; URL corregida (`search/?q=` → `search?q=`).
- `crawler.module.ts` — `HeadlessBrowserService` agregado a providers.
- `Dockerfile` — `apk add chromium nss freetype harfbuzz ca-certificates ttf-freefont` + ENV vars para Playwright.
- `scripts/deploy-staging.sh` — memoria 512Mi → 1Gi para soportar Chromium.
- `deploy/staging.env.yaml` — `HEADLESS_BROWSER_ENABLED: "true"` habilitado en staging.

### Estado Cloudflare por Sitio
- **USAudioMart** — usa CF JS Challenge (tier básico). El headless Playwright **debería** poder bypassarlo.
- **Audiogon** — usa CF Bot Management (tier premium). Requiere proxy residencial (Brightdata/Oxylabs). En pausa hasta tener presupuesto.

### Correcciones de Formato (✅ Completado)
- `audiogon.worker.ts` — 5 fixes Prettier (fetchHTML args, url ternario, parseFloat, title selector, seller selector).
- `usaudiomart.worker.ts` — 5 fixes Prettier (fetchHTML args, 2x `.find()` selectores, price selector, trailing newline).
- `headless-browser.service.ts` — 7 fixes (2x logger formatting, eslint directives, origQuery + permissions block, `page.route`, `waitForSelector`).
- `search.service.ts` — fix en `buildCrawlerSources()` `.map()` multi-línea innecesario.
- `search.module.ts` — fix array de imports en múltiples líneas.

### Pendientes Próxima Sesión
- Validar que USAudioMart funciona con headless en staging (trigger crawl + revisar logs).
- Dead Letter Queue + retry hardening para workers.
- Observabilidad (logs estructurados / Google Cloud Monitoring).
- Proxy residencial para Audiogon (cuando haya presupuesto).

## ✅ Sesión 25 de Marzo 2026 (tarde) — DLQ + Retry Hardening + Observabilidad

### Item 4: Dead Letter Queue + Retry Hardening (✅ Completado — rev 00024-9q6)

#### Cambios desplegados
- `src/crawler/workers/reverb.worker.ts` — `lockDuration: 120000` (2 min) para evitar "could not renew lock" en crawls lentos.
- `src/crawler/queue/crawl.queue.ts` — dos nuevos métodos:
  - `getFailedJobs(marketplace, limit)` — lista trabajos fallidos del DLQ (BullMQ failed set).
  - `retryFailedJobs(marketplace)` — reencola todos los trabajos fallidos de un marketplace.
- `src/crawler/crawler.controller.ts` — dos nuevos endpoints:
  - `GET /crawler/queues/:marketplace/failed?limit=N` — inspección del DLQ.
  - `POST /crawler/queues/:marketplace/retry-failed` — reintento masivo.

#### Validación
- `GET /crawler/queues/reverb/failed` → devolvió 5 trabajos con `failedReason` (timeouts + duplicate key).
- `POST /crawler/queues/reverb/retry-failed` → `{"retried": 7}` — 7 trabajos re-encolados.
- Queue stats después del retry: `failed: 0, active: 4, waiting: 3` — todos procesando.

### Item 5: Observabilidad — Google Cloud Monitoring (✅ Completado — rev 00025-2pz)

#### Logger estructurado JSON
- `src/common/json-logger.service.ts` — `JsonLoggerService` extiende `ConsoleLogger`:
  - En Cloud Run (`K_SERVICE` env definido): escribe JSON a stdout → Cloud Logging lo parsea como `jsonPayload`.
  - Localmente: fallback a pretty-print estándar de NestJS.
  - Método estático `JsonLoggerService.metric(event, fields)` para emitir eventos de métricas.
- `src/main.ts` — `app.useLogger(app.get(JsonLoggerService))` conecta el logger a NestJS.
- `src/app.module.ts` — `JsonLoggerService` registrado como provider global.

#### Eventos de métricas en workers
- `src/crawler/workers/base.worker.ts` — emite `crawl_completed` al finalizar cada job:
  - Campos: `marketplace`, `query`, `status` (success/failed), `listingsFound`, `listingsNew`, `listingsUpdated`, `durationMs`, `jobId`, `logId`.
  - Se emite tanto en éxito como en fallo.

#### Log-based metrics creadas en GCP (proyecto `landed-ebay-prod-01`)
| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `crawl_job_count` | DELTA/INT64 | Conteo de jobs completados, etiquetado por `marketplace` y `status` |
| `crawl_duration_ms` | DELTA/DISTRIBUTION | Duración en ms de crawls exitosos, etiquetado por `marketplace` |
| `crawl_listings_new` | DELTA/DISTRIBUTION | Listings nuevos por crawl exitoso, etiquetado por `marketplace` |

Visibles en Cloud Monitoring → Metrics Explorer bajo `logging/user/crawl_*`.

#### Validación
- Evento `crawl_completed` confirmado en Cloud Logging con `jsonPayload`:
  ```json
  {"event":"crawl_completed","marketplace":"reverb","status":"success","listingsFound":50,"listingsNew":0,"listingsUpdated":50,"durationMs":71046}
  ```

### Pendientes
- **Item 6 — Proxy residencial Audiogon/USAudioMart**: bloqueado por presupuesto. Variable `HEADLESS_PROXY_SERVER` ya soportada en `HeadlessBrowserService`, solo requiere configurar el proveedor (Brightdata/Oxylabs).

---

## ✅ Sesión 25 de Marzo 2026 (mañana) — Deploy + Crawls + USAudioMart Headless

### TypeORM Migrations (✅ Completado)
- `synchronize` desactivado en todos los entornos (`synchronize: false`).
- Creado `src/database/data-source.ts` — DataSource para CLI de TypeORM.
- Creado `tsconfig.typeorm.json` — CommonJS para compatibilidad con `ts-node` CLI.
- Migración inicial `1774402019399-InitialSchema` generada y ejecutada: crea tablas `seeds`, `listings`, `crawl_logs` con todos los índices y la extensión `uuid-ossp`.
- `migrationsRun: true` en `AppModule` — las migraciones corren automáticamente al arrancar.
- Scripts disponibles: `npm run migration:generate`, `migration:run`, `migration:revert`, `migration:show`.

### Workers Audiogon / USAudioMart (✅ Completado)
- `audiogon.worker.ts` reescrito con:
  - `isCloudflareChallenge()` — detecta páginas de desafío CF y devuelve array vacío (no crashea).
  - `parseNextData()` — extrae listings del `__NEXT_DATA__` JSON de Next.js (primera opción).
  - `parseListings()` — fallback HTML con múltiples selectores CSS.
- `usaudiomart.worker.ts` reescrito con detección CF + parsing HTML multi-selector.
- Ambos workers requieren headless browser (Puppeteer/Playwright) + proxy residencial para producción real.

### Search + Crawler DB Integration (✅ Completado y Validado)
- `SearchModule` importa `CrawlerModule` para acceder a `ListingService`.
- `SearchService` ahora consulta la DB del crawler y agrega `crawlerSources` a la respuesta del endpoint `GET /search`.
- `buildCrawlerSources()` convierte listings a `NormalizedProduct`, aplica `PricingService.simulatePricing()` y calcula `landedCostUsd/Cop`, `estimatedLocalCop`, `estimatedSavingPct`.
- Endpoint `GET /search?q=kef+r11` validado localmente: `crawlerSources` presente en respuesta (`total: 0` esperado en DB local vacía).

### Pendientes Próxima Sesión
- ~~Correr crawls en staging para popular la DB y validar `crawlerSources` con datos reales.~~ ✅ Completado en sesión tarde
- ~~Deploy a staging con migraciones auto-run.~~ ✅ Completado
- ~~Dead Letter Queue + retry hardening para workers.~~ ✅ Completado en sesión tarde
- ~~Observabilidad (Google Cloud Monitoring métricas/alertas).~~ ✅ Completado en sesión tarde
- Playwright headless para Audiogon + USAudioMart: bloqueado por CF Bot Management desde IPs de Cloud Run. Requiere proxy residencial.

## ✅ Hardening Completo - 18 de Marzo 2026

### Paso 2: Secret Manager + Hardening de Credenciales
- Se habilitó `secretmanager.googleapis.com` en el proyecto `landed-ebay-prod-01`.
- Se creó el secreto `landed-staging-db-password` en Secret Manager (versión 1 activa).
- Cloud Run revisión `landed-api-staging-00009-ht8` consume `DB_PASSWORD` vía `secretKeyRef` — sin valores planos.
- Se rotó la contraseña del usuario `postgres` de staging para alinearla con el secreto.
- Se creó el usuario `landed_staging` en Cloud SQL.

### Paso 3: Usuario Dedicado landed_staging
- Se aplicaron grants SQL completos a `landed_staging` en la base `landed` (CONNECT, USAGE ON SCHEMA, SELECT/INSERT/UPDATE/DELETE ON ALL TABLES, secuencias, DEFAULT PRIVILEGES).
- `DB_USER` cambiado de `postgres` a `landed_staging` en `deploy/staging.env.yaml`.
- Revisión `landed-api-staging-00010-qql` deployada con `DB_USER=landed_staging`.
- Validación post-cutover: `GET /crawler/status` → `operational`, crawl Reverb (marantz) → `listingsFound:50, listingsNew:50, status:success`.
- Total listings en DB: **102** (50 kef + 50 marantz + 2 previos), confirmando lectura y escritura con el usuario dedicado.

## 🔄 Actualización de Validación - 18 de Marzo 2026

### ✅ Paso 1 Completado (Validación End-to-End en Staging)
- `GET /crawler/status` respondió `operational` con scheduler habilitado y colas activas.
- Se ejecutó trigger manual en eBay:
   - `POST /crawler/trigger` con `{ marketplace: "ebay", query: "mcintosh", maxPages: 1 }`.
   - El job fue encolado y finalizó con `status: success`.
   - El crawl log quedó persistido en PostgreSQL (`crawl_logs`).
- Se ejecutó trigger manual en Reverb:
   - `POST /crawler/trigger` con `{ marketplace: "reverb", query: "kef", maxPages: 1 }`.
   - Resultado en logs: `listingsFound: 50`, `listingsNew: 50`, `status: success`.
   - `GET /crawler/statistics/listings` confirmó persistencia real: `[{ marketplace: "reverb", total: 50, active: 50, inactive: 0 }]`.

### 📌 Conclusión Operativa
- Staging ya está validado de extremo a extremo para el flujo `queue -> worker -> normalizer -> PostgreSQL`.
- La persistencia de `crawl_logs` y `listings` quedó confirmada en entorno Cloud Run + Cloud SQL.
- En eBay los jobs se ejecutan correctamente, pero para la query probada (`mcintosh`) el resultado fue `0` listings (sin error de pipeline).

### 🎯 Punto Exacto Para Continuar
1. Mover `DB_PASSWORD` de `deploy/staging.env.yaml` a Secret Manager.
2. Crear usuario de BD dedicado para staging (evitar uso de `postgres` administrador).
3. Actualizar deploy de `landed-api-staging` para consumir secretos desde runtime.

## 🔄 Actualización de Cierre - 17 de Marzo 2026

### ✅ Estado Actual Verificado
- `landed-api-staging` quedó desplegado correctamente en Cloud Run.
- La revisión activa y lista es `landed-api-staging-00008-76r`.
- La URL de staging operativa es `https://landed-api-staging-575929073955.us-central1.run.app`.
- La validación de `GET /crawler/status` respondió correctamente en staging con scheduler habilitado y colas activas.

### ✅ Causa Raíz Resuelta
- El fallo histórico de staging no era bootstrap de Nest ni Redis.
- `DB_HOST` estaba apuntando a `10.128.0.2`, que resultó ser un endpoint PSC de Memorystore y no una base PostgreSQL.
- Se creó una instancia real de Cloud SQL PostgreSQL para staging: `landed-postgres-staging`.
- La base `landed` quedó creada en esa instancia.
- `deploy/staging.env.yaml` se actualizó para usar la IP privada real de Cloud SQL: `10.34.240.3`.

### ✅ Ajustes Técnicos que Dejaron Staging Operativo
- `src/main.ts` quedó endurecido para Cloud Run con bind explícito a `0.0.0.0`, logs de bootstrap y manejo de errores.
- `src/app.module.ts` ahora inicializa TypeORM con trazas de conexión y `synchronize: process.env.NODE_ENV !== 'production'` para permitir creación automática de tablas en staging.
- El arranque del crawler quedó tolerante a Redis ausente o no inicializado en Cloud Run.
- `scripts/deploy-staging.sh` quedó alineado con producción usando `--vpc-egress=private-ranges-only`.
- Se creó la regla de firewall `allow-serverless-vpc-to-db-redis` para permitir tráfico desde el rango del Serverless VPC Connector (`10.8.0.0/28`) hacia PostgreSQL y Redis.

### 🧪 Validaciones Ejecutadas
- `npm run build` ejecutó correctamente.
- `./scripts/deploy-staging.sh` finalizó con exit code `0`.
- Cloud Run confirmó que la revisión fue creada y quedó sirviendo el `100%` del tráfico.
- `curl https://landed-api-staging-575929073955.us-central1.run.app/crawler/status` devolvió estado `operational`.

### 🎯 Punto Exacto Para Retomar Mañana
1. Verificar en Cloud SQL que TypeORM haya creado todas las tablas esperadas (`listings`, `seeds`, `crawl_logs` o equivalentes).
2. Ejecutar un crawl manual en staging y revisar persistencia real en PostgreSQL.
3. Mover `DB_PASSWORD` de `deploy/staging.env.yaml` a Secret Manager y dejar de usar el usuario administrador `postgres`.

## 🔄 Actualización de Debug - 17 de Marzo 2026

### ✅ Hallazgos Confirmados
- `src/main.ts` fue endurecido para Cloud Run con logs de bootstrap, bind explícito a `0.0.0.0` y manejo de errores.
- `src/app.module.ts` ahora deja trazas de configuración para PostgreSQL y Redis durante el arranque.
- `scripts/deploy-staging.sh` quedó alineado con producción usando `private-ranges-only` por defecto para `--vpc-egress`.
- Se creó una regla de firewall para permitir tráfico desde el rango del Serverless VPC Connector (`10.8.0.0/28`) hacia `tcp:5432` y `tcp:6379`.

### ⚠️ Causa Raíz Actual de Staging
- El servicio `landed-api-staging` sigue fallando con `HealthCheckContainerError`, pero ya se aisló el bloqueo real.
- Los logs de la revisión fallida muestran que Nest arranca y se detiene en `TypeOrmModule` por timeout al conectar a PostgreSQL.
- El valor actual de `DB_HOST` en `deploy/staging.env.yaml` es `10.128.0.2`.
- Se verificó en GCP que `10.128.0.2` y `10.128.0.3` pertenecen a forwarding rules de **Private Service Connect para Memorystore**, no a PostgreSQL.
- Conclusión: `DB_HOST` en staging está apuntando al recurso equivocado. El bloqueo no es ya el VPC connector ni Redis, sino un host incorrecto para PostgreSQL.

### 🎯 Punto Exacto Para Retomar
1. Identificar el host real de PostgreSQL en GCP (Cloud SQL, VM o endpoint privado correcto).
2. Reemplazar `DB_HOST` en `deploy/staging.env.yaml` por ese valor real.
3. Redeployar `landed-api-staging` y validar que la app llegue a escuchar en `PORT=8080`.

## 🔄 Última Actualización - Cierre de Sesión (16 de Marzo 2026)

### ✅ Estado Actual Verificado
- Build del backend compila correctamente con `npm run build`.
- El crawler local sigue operativo con Docker (`PostgreSQL + Redis + NestJS`).
- Validado en local el flujo real de crawling y persistencia para eBay y Reverb.
- Producción en Cloud Run se mantuvo intacta durante toda la sesión.

### ✅ Cambios Técnicos Cerrados en Esta Sesión
1. **Persistencia end-to-end del crawler completada**
   - `BaseWorker` ahora normaliza listings y persiste tanto listings como crawl logs.
   - La persistencia se hace vía `ListingService`, `NormalizerService` y `CrawlerService`.
   - Resultado validado: los crawls manuales ya dejan datos reales en PostgreSQL.

2. **Integración real de eBay completada**
   - `EbayWorker` dejó de ser placeholder y ahora usa `EbayFetcher` real.
   - Se agregó paginación real (`limit` + `offset`) en `src/fetchers/ebay/ebay.fetcher.ts`.
   - Se mapearon productos normalizados de eBay al modelo universal del crawler.

3. **Correcciones de runtime cerradas**
   - Reverb corregido agregando header obligatorio `Accept-Version: 3.0`.
   - `seedId` de crawl logs corregido para usar `null` en crawls manuales sin seed.
   - `CrawlerModule` actualizado para registrar `EbayFetcher` en DI.

4. **Preparación de staging en GCP**
   - Creado script `scripts/deploy-staging.sh`.
   - Creado template `deploy/staging.env.yaml.example`.
   - Creado `deploy/staging.env.yaml` para ambiente staging compartiendo temporalmente DB/Redis de producción.
   - Se agregó soporte de `VPC Connector` al script de deploy (`landed-vpc-connector`).

### 🧪 Validaciones Ejecutadas
- Build exitoso después de los cambios.
- `GET /crawler/status` funcional en local.
- `POST /crawler/trigger?marketplace=ebay` funcional en local.
- Verificación directa en PostgreSQL: listings persistidos para eBay y Reverb.
- Cloud Build de staging exitoso en GCP.

### ⚠️ Bloqueo Actual de Staging
- El servicio `landed-api-staging` fue creado en Cloud Run y tiene URL asignada:
  - `https://landed-api-staging-575929073955.us-central1.run.app`
- Sin embargo, la revisión no supera el health check de Cloud Run.
- Error observado repetidamente:
  - `HealthCheckContainerError`
  - `The user-provided container failed to start and listen on PORT=8080 within the allocated timeout`
- Se confirmó que producción usa `landed-vpc-connector` y staging fue redeployado con ese conector.
- Aun con VPC Connector, el problema persiste, por lo que mañana hay que inspeccionar logs de revisión y el bootstrap del contenedor en Cloud Run.

### 🎯 Punto Exacto para Retomar Mañana
1. Abrir logs de la revisión fallida más reciente de `landed-api-staging` en Cloud Run.
2. Confirmar si el bloqueo ocurre por bootstrap de Nest, conexión TypeORM, Redis o inicialización de workers.
3. Comparar configuración runtime de `landed-api` vs `landed-api-staging`.
4. Ajustar startup del contenedor para que la app escuche `PORT` antes de cualquier dependencia bloqueante, o corregir la dependencia que está colgando el arranque.

### ✅ Evaluación de Cierre de Hoy
- El crawler quedó funcional localmente con persistencia real.
- eBay quedó integrado de forma real y no como placeholder.
- La preparación de staging quedó avanzada y reproducible.
- El único bloqueo abierto es el startup de Cloud Run staging.

## 🔄 Última Actualización - Cierre de Sesión (9 de Marzo 2026)

### ✅ Estado Actual Verificado
- Crawler operativo en local con Docker (`PostgreSQL + Redis + NestJS`).
- `GET /crawler/status` responde `operational` con colas y scheduler activos.
- Seeds existentes en base de datos: **8**.

### ✅ Cambios Técnicos Cerrados en Esta Sesión
1. **Migración de persistencia completada a PostgreSQL + TypeORM**
   - `ListingService` y `CrawlerService` ya usan repositories de TypeORM.
   - Redis queda para BullMQ (colas), no para almacenamiento principal.

2. **Corrección de errores de arranque de TypeORM**
   - Se ajustaron índices inválidos/duplicados en entidades de crawler.
   - Se corrigió índice de `createdAt` → `firstSeenAt` en `ListingEntity`.

3. **Corrección crítica de BullMQ**
   - Se cambiaron nombres de colas de `crawl:marketplace` a `crawl-marketplace`.
   - Se actualizó tanto en QueueService como en todos los workers.
   - Resultado: se elimina el error `Queue name cannot contain :`.

4. **Endpoint manual de inicialización de seeds agregado**
   - Nuevo endpoint: `POST /crawler/seeds/initialize`.
   - Comportamiento idempotente implementado: responde si creó seeds nuevas o si ya estaban inicializadas.
   - Ejemplo de respuesta verificada:
     - `success: true`
     - `alreadyInitialized: true`
     - `created: 0`
     - `count: 8`

### 🧪 Validaciones Ejecutadas
- Build del proyecto exitoso.
- Lint sin errores en archivos modificados.
- Endpoints probados en runtime local:
  - `GET /crawler/status`
  - `GET /crawler/seeds`
  - `POST /crawler/seeds/initialize`

### ✅ Evaluación de Validez (Estado Real)
- **Veredicto:** El proyecto es **válido** como MVP técnico y base de escalamiento.
- **Arquitectura correcta:** PostgreSQL para persistencia + Redis/BullMQ para orquestación.
- **Estado funcional:** El crawler responde en local y los flujos base están operativos.
- **Riesgo actual:** Medio, concentrado en hardening de producción (no en diseño).

### 🎯 Brecha hacia Producción Sólida
1. Implementar migraciones formales (desacoplar de `synchronize` en entornos productivos).
2. Completar cobertura E2E del flujo de crawling (queue -> worker -> persistencia -> logs).
3. Añadir observabilidad operativa (métricas, alertas, trazas).
4. Endurecer manejo de fallos (timeouts por marketplace, DLQ, retries por tipo de error).
5. Completar workers con parsing real y validaciones anti-regresión.

## 🚀 Funcionalidades Implementadas - 9 de Marzo 2026

### 🧠 Crawler Platform (Sistema Completo de Indexación)

**ACTUALIZACIÓN IMPORTANTE:** Migrado a PostgreSQL + TypeORM para persistencia de datos.

**Arquitectura Implementada:**
- ✅ **PostgreSQL + TypeORM**: Base de datos persistente para listings, seeds, y logs
- ✅ **Redis + BullMQ**: Sistema de colas para procesamiento asíncrono
- ✅ Workers para múltiples marketplaces (Audiogon, US Audio Mart, Reverb, eBay)
- ✅ Scheduler con cron jobs automáticos
- ✅ Sistema de seeds dinámico con categorías
- ✅ Normalizador universal de listings
- ✅ API completa de administración
- ✅ **Docker Compose**: PostgreSQL 15 + Redis 7 para desarrollo local

**Stack de Base de Datos:**

1. **PostgreSQL (TypeORM)**
   - `ListingEntity`: Listings con índices en marketplace, active, category, brand
   - `SeedEntity`: Seeds con JSONB para marketplaces y lastCrawled
   - `CrawlLogEntity`: Logs detallados con métricas de rendimiento
   - Soporte JSONB para datos flexibles (images, metadata)
   - Full-text search con ILIKE
   - Agregaciones SQL para estadísticas

2. **Redis (BullMQ únicamente)**
   - Colas de jobs por marketplace
   - Estado de workers en tiempo real
   - Rate limiting y retries

**Ventajas de PostgreSQL:**
- ✅ Deduplicación real por URL (índice único)
- ✅ Búsquedas complejas con filtros y agregaciones
- ✅ Indexación optimizada para queries frecuentes
- ✅ Full-text search nativo
- ✅ Analytics con queries SQL
- ✅ Persistencia indefinida (no TTL)
- ✅ JSONB para flexibilidad sin sacrificar rendimiento

**Componentes Actualizados:**

1. **Entities** (`src/crawler/entities/`)
   - `listing.entity.ts`: Entity con TypeORM decorators
   - `seed.entity.ts`: Entity con JSONB support
   - `crawl-log.entity.ts`: Entity con índices optimizados

2. **Services** (migrados a PostgreSQL)
   - `listing.service.ts`: Repository Pattern con TypeORM
     - Bulk operations optimizadas
     - Query builder para búsquedas
     - Agregaciones SQL para estadísticas
   - `crawler.service.ts`: Repository Pattern para seeds y logs
   - `normalizer.service.ts`: Sin cambios (lógica de negocio)

3. **Docker Setup**
   - `docker-compose.yml`: PostgreSQL 15 + Redis 7
   - Volumes persistentes para desarrollo
   - Health checks configurados
   - `.env.example`: Variables de entorno documentadas

**Componentes Creados (Previos):**

1. **Models** (`src/crawler/models/`)
   - `listing.model.ts`: Modelo universal de listings
   - `seed.model.ts`: Sistema de seeds con 8 seeds predeterminadas
   - `crawl-log.model.ts`: Logs y estadísticas de crawling
   - `crawl-job.types.ts`: Tipos y configuración de rate limiting

2. **Queue System** (`src/crawler/queue/`)
   - `crawl.queue.ts`: Gestión de colas con BullMQ
   - Una cola dedicada por marketplace
   - Sistema de retries con backoff exponencial
   - Eventos de progreso en tiempo real

3. **Scheduler** (`src/crawler/scheduler/`)
   - `crawl.scheduler.ts`: Cron jobs automáticos
   - Audiogon: cada 12h
   - US Audio Mart: cada 12h (offset 1h)
   - Reverb: cada 6h
   - eBay: cada 1h
   - Cleanup automático: diario a las 3 AM

4. **Workers** (`src/crawler/workers/`)
   - `base.worker.ts`: Lógica común (rate limiting, error handling)
   - `audiogon.worker.ts`: Worker para Audiogon (template)
   - `usaudiomart.worker.ts`: Worker para US Audio Mart (template)
   - `reverb.worker.ts`: Worker para Reverb (API funcional)
   - `ebay.worker.ts`: Worker para eBay (integración pendiente)

5. **API Controller** (`src/crawler/crawler.controller.ts`)
   - 20+ endpoints para administración
   - Status, estadísticas, logs
   - Control de colas (pause/resume/clear)
   - Búsqueda y gestión de listings
   - Control del scheduler

**Setup Local:**
```bash
# 1. Iniciar infraestructura
docker compose up -d

# 2. Configurar variables
cp .env.example .env

# 3. Iniciar aplicación
npm run start:dev

# 4. Verificar
curl http://localhost:3000/crawler/status
curl -X POST http://localhost:3000/crawler/seeds/initialize
```

**Debug PostgreSQL:**
```bash
# Conectar a DB
docker compose exec postgres psql -U landed -d landed_crawler

# Ver estadísticas
SELECT marketplace, COUNT(*), COUNT(*) FILTER (WHERE active = true)
FROM listings GROUP BY marketplace;
```

**Rate Limiting Configurado:**
- Audiogon: 12 req/min (5s delay)
- US Audio Mart: 15 req/min (4s delay)
- Reverb: 30 req/min (2s delay)
- eBay: 60 req/min (1s delay)

**Seeds Predeterminadas:**
- Speakers: KEF, Focal, B&W
- Amplifiers: McIntosh, Luxman, Accuphase
- Turntables: Technics SL-1200, Rega Planar

**Endpoints Principales:**
```
GET  /crawler/status              # Estado completo del sistema
POST /crawler/trigger             # Crawl manual
GET  /crawler/seeds               # Ver seeds
GET  /crawler/logs                # Ver logs de crawling
GET  /crawler/listings/search     # Buscar listings indexados
GET  /crawler/statistics          # Estadísticas de crawling
POST /crawler/queues/:mp/pause    # Pausar cola
```

**Próximos Pasos:**
1. ✅ Migración a PostgreSQL (COMPLETADO)
2. ✅ Testing del crawler con PostgreSQL en local (COMPLETADO)
3. Completar implementación de workers (HTML parsing real)
4. Integrar eBayFetcher existente
5. Deployment a GCP (Cloud SQL + Memorystore)
6. Dashboard web de administración

**Documentación:**
- [CRAWLER_ARCHITECTURE.md](CRAWLER_ARCHITECTURE.md): Arquitectura completa
- [src/crawler/README.md](src/crawler/README.md): Quick start guide + PostgreSQL setup

---

## 📜 Historial - 4 de Marzo 2026

### 7. Debugging Profundo del Error 403 de MercadoLibre (4 de Marzo 2026 - Continuación)
- **Descubrimiento crítico**: MercadoLibre devuelve `"blocked_by":"PolicyAgent"` - no es un problema de OAuth sino de Políticas de Seguridad.
- Implementado logging mejorado en `MercadoLibreApi`:
  - Logs de headers de respuesta completos
  - Logs de datos de error de MercadoLibre
  - Detalles del Bearer token (primeros 20 caracteres) para auditoría
- Cache invalidado: `v6` → `v7` para forzar fresh requests sin cache antiguo
- **Raíz del problema identificada**: MercadoLibre tiene sistema de PolicyAgent que bloquea por:
  - IP no resgistrada en whitelist de la app
  - O restricción de IP configurada en DevCenter
  - O cuenta incompleta/no validada
- **Próximos pasos**: Verificar en DevCenter si existe IP Whitelist y agregar IP de Cloud Run

### 6. MercadoLibre OAuth Persistente + Refresh Automático (4 de Marzo 2026)
- Creado `src/auth/mercadolibre-auth.service.ts` con flujo completo de OAuth:
  - Exchange de `authorization_code` por tokens.
  - Persistencia de sesión OAuth en `CACHE_MANAGER` (Redis si está configurado).
  - Refresh automático con `refresh_token` cuando el access token está por vencer.
- Creado `src/auth/auth.module.ts` y modularizada la capa auth para reutilización.
- `GET /auth/mercadolibre/callback` ahora:
  - Procesa errores OAuth (`error`, `error_description`).
  - Persiste token al completar el flujo.
  - Devuelve metadata de sesión (sin exponer tokens sensibles).
- `MercadoLibreApi` actualizado para usar `Bearer token` en búsquedas (`/sites/MCO/search`).
- Implementado reintento automático ante `401`: refresca token y reintenta una vez.

### 1. ExchangeRateService - Consistencia del TRM
- Creado `src/pricing/exchange-rate.service.ts` para centralizar la conversión USD/COP.
- **Problema resuelto**: Antes cada cálculo podía usar un TRM diferente, causando inconsistencias en el análisis de arbitraje.
- **Solución**: Una única llamada al TRM por request, compartida entre PricingService y OpportunityService.
- Se agregó campo `exchangeRate` en la respuesta del endpoint `/search` con metadata (rate, source, timestamp).
- Se agregó campo `exchangeRateUsed` en cada oportunidad para trazabilidad.

### 2. Sistema de Clasificación de Oportunidades (REAL vs ESTIMATED)
- Implementado sistema de clasificación para distinguir matches reales de estimaciones.
- **3 tipos de LocalPriceSource**:
  - `ML_MATCH`: Match real con productos de MercadoLibre (Top 3 similares por Jaccard)
  - `FALLBACK_DICTIONARY`: Diccionario hardcodeado (backup)
  - `ESTIMATED_MARKUP`: Estimación con markup del 30%
- **OpportunityType**: `REAL` (basado en ML_MATCH o FALLBACK) o `ESTIMATED`
- Las oportunidades REAL se priorizan en el ordenamiento antes del buyScore.
- Se agregó `opportunitySummary` en respuesta con contadores de `realMatches` y `estimated`.

### 3. Matching por Producto con MercadoLibre
- Cambio de estrategia: Ahora se busca cada producto eBay individualmente en MercadoLibre.
- Usa algoritmo de **Jaccard Similarity** sobre títulos tokenizados (threshold: 15%).
- Toma los Top 3 matches más similares y calcula promedio ponderado.
- Genera `localPriceSource` específico por producto para mejor trazabilidad.

### 4. Diagnósticos de LocalMarketStatus
- Agregado interface `LocalMarketStatus` en `mercadolibre.api.ts`.
- Expone estado de la API: `ok | empty | forbidden | error` con httpStatus y mensaje.
- **Descubrimiento crítico**: MercadoLibre API está retornando HTTP 403 Forbidden.
- Como resultado, todas las oportunidades aparecen como `ESTIMATED` actualmente.

### 5. Mejoras Técnicas
- Refactorización de PricingService: métodos ahora síncronos con parámetro `trmOverride`.
- Corrección de errores de linting en `mercadolibre.api.ts` y `search.service.ts`.
- Cache key actualizado a `v4` para invalidar datos antiguos.
- Todos los tests pasando (6 suites, 13 tests).
- Build exitoso en producción.

---

## 📜 Historial - 2 de Marzo 2026

### 1. Deal Analysis "Modelo C"
- Se implementó la lógica de **3 escenarios** de estimación (Conservador, Balanceado, Agresivo).
- Cálculo de **Landed Cost** (impuestos + envío) para cada escenario.
- **Buy Score (0-100)**: Basado en Ahorro Ponderado (30/50/20), Confianza, Volatilidad y Bid Factor.

### 2. Integración MercadoLibre (Benchmark Local)
- Módulo: `src/local-market/mercadolibre.api.ts`
- Lógica:
  - Busca en API de MercadoLibre Colombia (`MLC`).
  - Filtra: `condition: new`, `currency: COP`.
  - Toma el Top 10 de precios más bajos.
  - Calcula la **Mediana**.
- **Cache**: Los precios locales se guardan en Redis por 30 minutos.
- **Fallback**: Si falla ML, usa la tabla hardcodeada en `PricingService`.

### 3. API Limpia
- Ruta simplificada de `/search/search` a `/search`.
- Endpoint final: `GET /search?q=iphone`

### 4. Infraestructura
- Despliegue exitoso en Google Cloud Run.
- Corrección de todos los errores de linting (`unsafe-member-access`, `any`) en `SearchService` y `MercadoLibreApi`.

---

## 📋 Pendientes para la próxima sesión
- [ ] **MercadoLibre PolicyAgent 403**: Resolver bloqueo por restricciones de IP o políticas
  - [ ] Verificar en DevCenter si hay "IP Whitelist" o "IPs permitidas" configuradas
  - [ ] Obtener IP estática de Cloud Run y agregarla a whitelist
  - [ ] Si no existe whitelist, verificar si validación de cuenta está completa
  - [ ] Testear endpoint `/users/me` con access token para confirmar que OAuth funciona
- [ ] **Validación con datos reales**: Una vez resuelto el 403, probar que `realMatches > 0` y verificar calidad de matches.
- [ ] **Confidence Engine** (opcional): Sistema de confianza con volatilidad y riskSpread para refinar buyScore.
- [ ] **Frontend**: Integrar nuevos campos (`exchangeRate`, `opportunityType`, `localPriceSource`, `opportunitySummary`) en Deal Scorecard.

---

## ✅ Sesión Abril 2026 — ProductResolverService: Normalización Avanzada + Cobertura 62%

### Logros

1. **4 nuevos métodos de normalización en `ProductResolverService`**
   - `expandCompactForms()` — expande aliases compactos (ej. "sl-1200mk2" → "sl 1200mk2")
   - `reorderAdjacentTokens()` — reordena tokens adyacentes (ej. "mk2 sl 1200" → "sl 1200mk2")
   - `guessWithKnownBrands()` — infiere marca a partir de lista de marcas conocidas
   - `generateAlternativeCandidates()` — genera candidatos alternativos para el pipeline

2. **Pipeline de 6 pasos** — cadena de resolución con confianza explícita:
   - Pass 1: match exacto normalizado
   - Pass 2: alias expandidos
   - Pass 3: tokens reordenados
   - Pass 4: marca inferida
   - Pass 5: generic fallback (confianza baja)
   - Pass 6: not_found con confidence: null

3. **Tests**: 136/136 pasando
4. **Cobertura**: 62% (885/1424 líneas relevantes)

### Limpieza de Errores ESLint

- Solucionados todos los errores `@typescript-eslint/no-unsafe-*` en `product-resolver.service.ts`
  - Reemplazado callback `String.replace(regex, (_, suffix, base) => {...})` con dos regexes estáticos sin callback (evita inferencia `any` vía `...args: any[]`)
- Solucionados todos los warnings/errores Prettier + `no-unsafe-argument` en `product-resolver.service.spec.ts`
  - 6 instancias `{} as any` → `{} as ProductResolverService['productsService']`
- Resultado final: **0 errores, 0 warnings** en ambos archivos

### Estado Staging
- Último deploy exitoso: revisión `landed-api-staging-00027-5bt` (con migraciones de catálogo aplicadas)
- Tablas de catálogo (`products`, `product_aliases`) operativas en staging
- Schedulers deshabilitados en staging (`CRAWLER_SCHEDULER_ENABLED=false`)

### Pendientes
- [ ] Deploy a staging con los cambios del ProductResolverService mejorado
- [ ] Backfill adicional con las nuevas reglas de normalización
- [ ] Ampliar catálogo con nuevos clusters de frecuencia ≥ 2
- [ ] Cobertura objetivo: 70%+ (requiere ~115 listings adicionales resueltos)

---
*Este archivo sirve como punto de control para retomar el desarrollo.*
