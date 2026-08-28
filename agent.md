# MASAK APA HARI INI Agent Notes

## Project
- React 19 + Vite application.
- Tailwind CSS v4 is loaded through `src/index.css` and `vite.config.js`.
- Lucide icons come from `lucide-react`.
- The app is a state-based mobile PWA; there is no router.

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
- Opening a recipe pushes `{ view: 'detail' }` into browser history; the `popstate` listener closes the detail view for browser and Android back actions.
