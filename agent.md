# MASAK APA HARI INI Agent Notes

## Project
- React 19 + Vite application.
- Tailwind CSS v4 is loaded through `src/index.css` and `vite.config.js`.
- Lucide icons come from `lucide-react`.
- The app is a state-based mobile PWA; there is no router.

## Important Files
- `src/App.jsx`: screen state, pantry persistence, matching, filters, favorites, grocery list, and the global master layout container.
- `src/data/recipes.js`: ingredient catalog, staple definitions, and recipe data.
- `src/data/translations.js`: shared Bahasa Melayu/English UI dictionary, recipe title/style translations, and bilingual text helpers.
- Recipe catalog currently contains 53 unique recipes: the original 20 plus 12 Ayam, Daging & Kambing recipes, 12 Seafood & Fish recipes, and a 12-dish Express Noodles & Rice batch with three existing recipes refreshed rather than duplicated.
- `src/components/RecipeCard.jsx`: reusable recipe card and favorite action.
- `src/components/RecipeDetail.jsx`: `RecipeDetail` plus `PairingSection` and `MissingIngredients` exports.
- `src/utils/portion.js`: pure ingredient quantity scaling and clean fraction formatting.
- `src/components/BottomNav.jsx`: mobile navigation.
- `src/index.css`: visual system and responsive mobile frame.
- `vite.config.js`: VitePWA manifest, precache, runtime font caching, and prompt update registration.
- `capacitor.config.json`: mobile packaging identity and `dist` web directory.

## Layout Rule (Important)
- ALL views (Matcher, Discover, RecipeDetail, GroceryList) render inside ONE locked flex mobile container in `src/App.jsx`:
  `h-screen max-w-md mx-auto flex flex-col overflow-hidden bg-[#FDFBF7] shadow-2xl relative`.
- The active view renders inside the sole `flex-1 overflow-y-auto px-4 py-3` main region; the bottom navigation is outside it in a `shrink-0` footer.
- `App` resets that main region's `scrollTop` to `0` whenever the active tab or selected recipe view state changes.
- Do NOT use viewport-relative widths or root-level absolute/fixed positioning in new views.
- Anchor sticky/absolute elements to this container: the update toast is `position: absolute` within the container. Bottom navigation positioning comes from the locked flex footer, not sticky or fixed positioning.
- Never add `w-screen`, `100vw`, or root-level `position: fixed` in new views — they must stay within the `max-w-md` frame.

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
- Matcher ingredient selection uses horizontal category tabs, text search across all categories, a pantry-staples quick toggle, a removable selected-ingredient tray, and a Clear All action.
- Compact recipe rows use a colored initials avatar, truncated title, metadata subtitle, optional missing-ingredient note, match percentage pill, favorite toggle, and right chevron.
- `BottomNav` calls `App.handleNavigate`, which clears the active recipe before switching tabs.
- `BottomNav` is a frame-bound shrink-to-content footer bar with exactly four evenly spaced tabs: Peti Sejuk, Cari Resepi, Senarai Pasar, and Kegemaran. The grocery tab shows the persisted item count badge; Kegemaran opens the dedicated Favorites view.
- Language state is stored under `masakapa-language`, defaults to `ms`, and flows from `App` through headers, navigation, recipe cards/details, and grocery content. The header BM/EN toggle updates it immediately.
- Opening a recipe pushes `{ view: 'detail' }` into browser history; the `popstate` listener closes the detail view for browser and Android back actions.
