# MASAK APA HARI INI Agent Notes

## Project
- React 19 + Vite application.
- Tailwind CSS v4 is loaded through `src/index.css` and `vite.config.js`.
- Lucide icons come from `lucide-react`.
- The app is a state-based mobile PWA; there is no router.

## Product Purpose
- MASAK APA HARI INI helps users choose Malaysian meals from ingredients available in their fridge.
- The app supports Bahasa Melayu (`ms`, displayed as BM) and English (`en`, displayed as EN).
- The primary user actions are selecting available ingredients, finding matching recipes, browsing the full recipe catalog, saving favorites, managing a grocery list, and opening recipe details.

## Usage Flow
1. The app starts on the Fridge screen (`screen: "matcher"`). The user can enable or disable pantry staples, search ingredients, filter by category or A-Z letter, and select ingredients.
2. The Fridge screen calculates recipe matches from the selected ingredients. Recipes with no more than two missing core ingredients and at least a 40% core match are shown in the recommendations pane.
3. The user can search recommended recipes, filter by category, open a recipe, favorite it, or tap a missing-ingredient action to add missing items to the grocery list.
4. The Search screen (`screen: "discover"`) shows the complete recipe catalog sorted alphabetically in the active language. Search, category filters, and the A-Z letter filter can be combined.
5. Selecting a recipe opens the detail view without a router. Browser history receives a `{ view: "detail" }` state so browser/Android back closes the detail view correctly.
6. Recipe Detail shows the bilingual recipe title/style, time, difficulty, serving controls, ingredient checklist, availability against the saved pantry selection, substitutions, cooking instructions, chef tip, and pairings.
7. The Grocery List screen displays unchecked and checked grocery items, supports sharing through WhatsApp, importing a shared list, clearing completed items, and clearing the entire list.
8. Favorites shows only recipes whose IDs are in the persisted favorites array. If there are no favorites, it links back to Search.
9. The bottom navigation switches between Fridge, Search, Grocery List, and Favorites. Switching screens clears the active recipe; moving to Search resets its category filter to All.
10. The BM/EN toggle is available in screen headers and Recipe Detail. It updates the active language immediately and re-renders UI labels, recipe content, sorting, search behavior, and grocery names.

## Application/System Flow
- `src/main.jsx` mounts the React application in `StrictMode`.
- `src/App.jsx` owns global screen state, active recipe state, language state, search/category state, favorites, grocery items, update notifications, and browser history behavior.
- `App` calls `useRecipes()` once and passes the resulting recipes and ingredient catalogs into the active view.
- The Fridge, Search, and Favorites view functions currently live inside `src/App.jsx`; they are not separate `Matcher.jsx` or `Discover.jsx` view files.
- `src/components/Matcher.jsx` contains shared ingredient matching plus active-language sorting helpers used by the embedded Fridge/Search views.
- `RecipeCard` is the shared compact recipe row/card used by Fridge, Search, and Favorites.
- `RecipeDetail` owns detail-specific serving, checklist, substitution, pairing, and recipe-content rendering.
- `BottomNav` is rendered outside the scrollable view area as the fixed flex-footer navigation surface.
- `App` resets the main scroll position when the active screen or active recipe changes.

## Data Flow
- Static catalog data is defined in `src/data/recipes.js`.
- Static data is stored in BM-first form and normalized into bilingual `{ ms, en }` values for recipe names, styles, difficulty, ingredients, equipment, steps, tips, and sides.
- `src/data/translations.js` contains UI translations plus English recipe, ingredient, instruction, tip, equipment, and side translations.
- `text(value, lang)` resolves bilingual values for rendering. New user-facing text must be added to both `translations.ms` and `translations.en` rather than hardcoded in JSX.
- Recipe filtering uses the active language for names and styles. Recipe sorting uses `localeCompare()` with the active language.
- Ingredient matching uses stable ingredient IDs, not translated names. Fish variants are handled by `matchesIngredient()` in `src/components/Matcher.jsx`.
- Favorites and grocery identity use stable recipe/ingredient IDs. Never replace these IDs with translated names.

## Backend And Offline System
- Supabase is optional. `src/lib/supabase.js` creates the client only when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured.
- `src/hooks/useRecipes.js` loads `ingredients` and `recipes` from Supabase in parallel when credentials exist and the browser is online.
- Supabase rows are transformed into the same runtime shape as the static catalog. Supabase recipe UUID pairings are resolved back to stable recipe slugs.
- Successful Supabase responses are cached in `localStorage` under `masakapa-recipes-cache` with a cache version.
- Startup order is cached data first, then static fallback data, followed by a background Supabase request when available.
- If Supabase is not configured, the device is offline, or the request fails, the app continues with cached/static data and remains usable.
- `scripts/seed-supabase.js` seeds ingredients and recipes from `src/data/recipes.js`, generates stable recipe UUID mappings, remaps pairings, and upserts the database rows.
- Runtime IDs remain recipe slugs even when the database uses UUID primary keys. This preserves favorites, grocery references, and pairing navigation.

## Persistence
- `masakapa-language`: selected language; defaults to `ms`.
- `masakapa-selected-ingredients`: selected fridge ingredient IDs.
- `masakapa-staples-on`: pantry-staples toggle.
- `masakapa-favorites`: favorited recipe IDs.
- `masakapa-grocery-list`: grocery items.
- `masakapa-recipes-cache`: versioned cached backend/catalog data.
- Storage helpers are defensive and tolerate unavailable or malformed localStorage data.

## Backend Environment And Schema
- Required optional environment variables are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- The `ingredients` table stores `id`, `name_ms`, `name_en`, `group`, and `is_staple`.
- The `recipes` table stores `id`, `slug`, bilingual names/styles/difficulty, time/serving fields, equipment, flags, accent, pairings, ingredients, steps, tips, sides, and `created_at`.
- JSON fields must preserve the shapes expected by `useRecipes.js`; especially `pairings`, `ingredients`, `steps`, and `sides`.
- Database seed changes should be made from the static source catalog first, then applied with `node scripts/seed-supabase.js`.

## Supabase Backend
- `src/lib/supabase.js`: initializes the Supabase JS client from `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. Exports `isSupabaseConfigured` and a nullable `supabase` client so the UI can degrade gracefully.
- `src/hooks/useRecipes.js`: React hook that loads recipes and ingredients from Supabase on mount, caches the last successful response in `localStorage` under `masakapa-recipes-cache`, and falls back to `src/data/recipes.js` when offline or when Supabase credentials are missing.
- `scripts/seed-supabase.js`: Node seed script that reads `src/data/recipes.js`, upserts all ingredients into the `ingredients` table, generates 36-character UUIDs for every recipe, remaps `pairings` to those UUIDs, and upserts recipes into the `recipes` table.

### Database Schema
```sql
create table ingredients (
  id text primary key,
  name_ms text not null,
  name_en text not null,
  group text not null,
  is_staple boolean not null default false
);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ms text not null,
  name_en text not null,
  style_ms text not null,
  style_en text not null,
  difficulty_ms text not null,
  difficulty_en text not null,
  time int not null,
  servings int not null,
  default_servings int not null,
  equipment jsonb not null default '[]',
  air_fryer boolean not null default false,
  accent text not null,
  pairings jsonb not null default '[]',
  ingredients jsonb not null default '[]',
  steps jsonb not null default '[]',
  tip_ms text not null,
  tip_en text not null,
  sides jsonb not null default '[]',
  created_at timestamp with time zone default now()
);
```

### Seeding
Run `node scripts/seed-supabase.js` after creating the tables above and ensuring `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are available in `.env`. The script persists the slug-to-UUID mapping in `scripts/recipe-uuid-map.json` (gitignored) so re-runs stay idempotent and pairings remain consistent.

### Offline Fallback Strategy
- `useRecipes()` starts from cached Supabase data or the static `src/data/recipes.js` catalog.
- If credentials are missing or `navigator.onLine` is false, it skips the network request and keeps the static/local data.
- On successful fetch it writes the transformed dataset to `localStorage` for faster subsequent starts.
- Runtime IDs remain the stable recipe slugs (e.g. `ayam-goreng-kunyit`) so persisted favorites and grocery items continue to work; the seed script stores UUIDs only in Supabase and resolves them back to slugs inside the hook.

## Important Files
- `src/App.jsx`: screen state, pantry persistence, matching, filters, favorites, grocery list, and the global master layout container. Loads recipe data through `useRecipes()` and passes it down to `Matcher`, `Discover`, `Favorites`, and `RecipeDetail`.
- `src/data/recipes.js`: ingredient catalog, staple definitions, and recipe data.
- `src/data/translations.js`: shared Bahasa Melayu/English UI dictionary, recipe title/style translations, and bilingual text helpers.
- Recipe catalog currently contains 98 unique recipes: the original 70 plus 28 iconic Malaysian recipes covering rice, noodles, curries, seafood, kerabu, sides, kuih, and desserts.
- `src/components/RecipeCard.jsx`: reusable recipe card and favorite action.
- `src/components/RecipeDetail.jsx`: `RecipeDetail` plus `PairingSection` and `MissingIngredients` exports.
- `src/utils/portion.js`: pure ingredient quantity scaling and clean fraction formatting.
- `src/components/BottomNav.jsx`: mobile navigation.
- `src/components/OnboardingModal.jsx`: first-run onboarding slides; opening the modal or changing language resets it to slide 1, and dot buttons use zero-based slide indexes.
- `src/index.css`: visual system and responsive mobile frame.
- `vite.config.js`: VitePWA manifest, precache, runtime font caching, and prompt update registration.
- `capacitor.config.json`: mobile packaging identity and `dist` web directory.

## Layout Rule (Important)
- ALL views (Matcher, Discover, RecipeDetail, GroceryList) render inside ONE responsive flex container in `src/App.jsx`:
  `max-w-md md:max-w-4xl lg:max-w-6xl mx-auto h-screen md:h-[92vh] md:my-[4vh] md:rounded-2xl md:shadow-2xl overflow-hidden`.
- Mobile remains a full-height `max-w-md` frame. At `md` the frame becomes an iPad-friendly `max-w-4xl` surface with a 92vh rounded presentation; at `lg` it expands to `max-w-6xl` for desktop.
- Matcher uses a `grid md:grid-cols-12 gap-6` split view: ingredient selection occupies `md:col-span-7`, while live results occupy a sticky `md:col-span-5` pane.
- Discover and Favorites use one-column cards on mobile and a two-column `md` grid. Recipe detail content uses a two-column `md` grid for ingredients and instructions/tips.
- The active view renders inside the sole `flex-1 overflow-y-auto px-4 py-3` main region; the bottom navigation is outside it in a `shrink-0` footer.
- `App` resets that main region's `scrollTop` to `0` whenever the active tab or selected recipe view state changes.
- Do NOT use viewport-relative widths or root-level absolute/fixed positioning in new views.
- Anchor sticky/absolute elements to this container: the update toast is `position: absolute` within the container. Bottom navigation positioning comes from the locked flex footer, not sticky or fixed positioning.
- Never add `w-screen`, `100vw`, or root-level `position: fixed` in new views — they must stay within the responsive app frame.

## Conventions
- Use `apply_patch` for manual edits.
- Keep recipe IDs stable because favorites are persisted by ID.
- Core ingredients are non-staple, non-optional ingredients.
- Use `npm run lint` and `npm run build` after changes.
- LocalStorage keys begin with `masakapa-`.
- Recipe `pairings` values must reference stable recipe IDs in `src/data/recipes.js`; pairing navigation passes the resolved recipe back to `App`.
- Grocery items use `{ id, ingredientId, name, amount, recipeTitle, checked }` and persist under `masakapa-grocery-list`.
- `addMissing` deduplicates recipe/ingredient pairs; use `npm run lint` and `npm run build` after changes.
- PWA updates use `registerSW` in `src/App.jsx`; keep the update toast gentle and call the returned updater on refresh.
- Recipe detail portion controls use `defaultServings` and `scaleIngredientAmount`; grocery additions must receive the currently selected serving count.
- The product title displayed in headers and manifests is `MASAK APA HARI INI`; the short title remains `MasakApa`.
- Matcher results use the explicit `flex flex-col space-y-2 px-4 pb-24` layout with compact horizontal recipe rows; filter chips use a padded non-wrapping horizontal scroller.
- Discovery uses the same single-column compact horizontal row list and horizontally scrollable filter row.
- The Fridge view includes `src/components/RecipeSpinner.jsx`, a bilingual random-recipe modal. It filters the recipe pool by All, under 20 minutes, Bujang/Express, Masakan Kampung, or kids-friendly core ingredients, then spins for a random result and opens the normal Recipe Detail flow.
- Recipe Spinner filter logic uses runtime recipe fields (`recipe.time`, bilingual `recipe.style`, and core ingredient IDs/names), not translated display labels. Keep stable ingredient IDs when extending kids-friendly detection.
- The dedicated Favorites screen renders only recipes whose IDs are in the persisted `favorites` array (`favorites.includes(recipe.id)`), without the Search bar or category chips.
- Search filter chips are limited to All/Semua, Express/Bujang Express, Traditional/Masakan Kampung, and Air Fryer/Air Fryer Only; the chip scroller uses `flex overflow-x-auto flex-nowrap scrollbar-none px-4 pr-8 py-2 space-x-2 w-full items-center`.
- Ingredient options include the expanded poultry/meat proteins plus Rempah & Bahan Tumis and Sos & Perasa groups.
- Ingredient options also include Siakap, Pari, Tilapia, Cencaru, Kembung, Sotong, Petai, seafood seasonings, and seafood garnishes.
- Ingredient options include Karbo & Mi items, stir-fry vegetables, noodles/rice sauces, and express recipe complements.
- Ingredient options also include minced chicken, minced beef, beef lungs, salted fish, eggplant, spinach, corn, kailan, green mango, rice cubes, glass noodles, tofu puffs, curry powder, Thai basil, dried shrimp, and peanuts.
- Ingredient options also include cockles, crab, regional fish, snails, clams, venison, chicken offal, local vegetables, regional condiments, curry aromatics, and Malaysian flours and pantry staples.
- Matcher ingredient selection uses horizontal category tabs, text search across all categories, a pantry-staples quick toggle, a removable selected-ingredient tray, and a Clear All action.
- Compact recipe rows use a colored initials avatar, truncated title, metadata subtitle, optional missing-ingredient note, match percentage pill, favorite toggle, and right chevron.
- `BottomNav` calls `App.handleNavigate`, which clears the active recipe before switching tabs.
- `BottomNav` is a frame-bound shrink-to-content footer bar with exactly four evenly spaced tabs: Peti Sejuk, Cari Resepi, Senarai Pasar, and Kegemaran. The grocery tab shows the persisted item count badge; Kegemaran opens the dedicated Favorites view.
- Language state is stored under `masakapa-language`, defaults to `ms`, and flows from `App` through headers, navigation, recipe cards/details, and grocery content. The header BM/EN toggle updates it immediately.
- UI copy is centralized in `src/data/translations.js`; recipe equipment, sides, steps, tips, ingredients, and metadata are normalized with BM/EN values so changing language does not fall back to the other language.
- Onboarding slide state starts at index `0` and resets whenever the modal is open and the language changes; keep dot navigation aligned directly with `currentSlide`.
- Opening a recipe pushes `{ view: 'detail' }` into browser history; the `popstate` listener closes the detail view for browser and Android back actions.
- Fridge ingredients and Search recipes use `sortByActiveName` for locale-aware A-Z ordering in the active BM/EN language. Both views expose a horizontally scrollable All/A-Z letter filter below their search input.
