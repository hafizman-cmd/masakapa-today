import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Heart,
  Leaf,
  MessageSquarePlus,
  RotateCcw,
  Search,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { registerSW } from "virtual:pwa-register";
import BottomNav from "./components/BottomNav";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./components/RecipeDetail";
import TudungSajiModal from "./components/TudungSajiModal";
import GroceryListView from "./components/GroceryList";
import FeedbackModal from "./components/FeedbackModal";
import Admin from "./components/Admin";
import SplashScreen from "./components/SplashScreen";
import { text, translations } from "./data/translations";
import useRecipes from "./hooks/useRecipes";
import useFavorites from "./hooks/useFavorites";
import {
  decodeGrocery,
  encodeGrocery,
  formatGrocery,
  readUrlGrocery,
} from "./utils/groceryShare";
import {
  activeName,
  matchesIngredient,
  sortByActiveName,
} from "./components/Matcher";

const readStorage = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    const stored = value === null ? fallback : JSON.parse(value);
    return key === "masakapa-grocery-list"
      ? sanitizeGroceryList(readUrlGrocery(sanitizeGroceryList(stored)))
      : stored;
  } catch {
    return fallback;
  }
};
const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage may be unavailable. */
  }
};
const sanitizeGroceryList = (items) =>
  Array.isArray(items) ? items.filter((item) => item && item.id) : [];
function matchesFilter(recipe, query, filter, favorites, lang) {
  const name = text(recipe.name, lang);
  const style = text(recipe.style, lang);
  const rawStyle = text(recipe.style, "ms");
  const searchable = `${name} ${style}`.toLowerCase();
  const category =
    filter === "Semua" || filter === "All"
      ? true
      : filter === "Favorite" ||
          filter === "Kegemaran" ||
          filter === "Favorites"
          ? favorites.some((favorite) => favorite.id === recipe.id)
        : filter === "Bujang Express" || filter === "Express"
          ? rawStyle === "Bujang/Express"
          : filter === "Masakan Kampung" || filter === "Traditional"
            ? rawStyle === "Masakan Kampung"
            : filter === "Air Fryer Only" || filter === "Air Fryer"
              ? recipe.airFryer
              : rawStyle === filter;
  return searchable.includes(query.toLowerCase()) && category;
}
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const QUICK_FILTERS = [
  { id: "all", labelMs: "Semua", labelEn: "All" },
  { id: "air_fryer", labelMs: "Air Fryer 🌀", labelEn: "Air Fryer 🌀" },
  { id: "tanpa_santan", labelMs: "Tanpa Santan 🥥", labelEn: "Coconut-Free 🥥" },
  { id: "quick", labelMs: "Bawah 20 Min ⏱️", labelEn: "Under 20 Min ⏱️" },
  { id: "kid_friendly", labelMs: "Budak Suka 👶", labelEn: "Kid-Friendly 👶" },
];
function matchesQuickFilter(recipe, filter) {
  if (filter === "all") return true;
  const tags = Array.isArray(recipe.tags)
    ? recipe.tags.map((tag) => String(tag).toLowerCase())
    : [];
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const ingredientText = ingredients
    .map((item) => `${item.id || ""} ${text(item.name, "ms") || ""}`)
    .join(" ")
    .toLowerCase();
  if (filter === "air_fryer") {
    return tags.includes("air_fryer") || recipe.appliance === "air_fryer" || recipe.airFryer === true;
  }
  if (filter === "tanpa_santan") {
    return tags.includes("tanpa_santan") || !ingredientText.includes("santan");
  }
  if (filter === "quick") {
    return recipe.cooking_time <= 20 || recipe.prep_time <= 20 || recipe.time <= 20;
  }
  if (filter === "kid_friendly") {
    return tags.includes("kid_friendly") || tags.includes("budak_suka") || recipe.is_spicy === false;
  }
  return true;
}
const isAdminRoute = () =>
  window.location.pathname.toLowerCase().replace(/\/$/, "") === "/admin";

function LetterFilter({ value, onChange }) {
  return (
    <div className="flex overflow-x-auto flex-nowrap scrollbar-none gap-1 px-4 py-2">
      {["All", ...ALPHABET].map((letter) => (
        <button
          key={letter}
          type="button"
          onClick={() => onChange(letter === "All" ? "" : letter)}
          className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-all ${
            (value || "All") === letter
              ? "border-[#d6573a] bg-[#d6573a] text-white"
              : "border-stone-200 bg-white text-stone-600 hover:border-[#d6573a]"
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

function Filters({ query, setQuery, filter, setFilter, lang, letter, setLetter }) {
  const t = translations[lang];
  const options = [
    [t.categories.all, "Semua"],
    [t.categories.express, "Bujang Express"],
    [t.categories.traditional, "Masakan Kampung"],
    [t.categories.airFryer, "Air Fryer Only"],
  ];
  return (
    <>
      <div className="search-box">
        <Search size={19} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.ui.searchPlaceholder}
        />
        <kbd>/</kbd>
      </div>
      {setLetter && <LetterFilter value={letter} onChange={setLetter} />}
      <div className="filter-row flex overflow-x-auto flex-nowrap scrollbar-none px-4 pr-8 py-2 space-x-2 w-full items-center">
        {options.map(([label, value]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={filter === value ? "filter-chip active" : "filter-chip"}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
function Header({ title, subtitle, lang, onToggleLanguage, onOpenFeedback }) {
  return (
    <div className="shrink-0">
      <header className="page-header">
        <div className="header-mark">
          <Leaf size={15} fill="currentColor" />
          <span>{translations[lang].ui.pantryMark}</span>
          <button
            className="language-toggle"
            onClick={onToggleLanguage}
            aria-label={
              lang === "ms" ? "Tukar ke English" : "Switch to Bahasa Melayu"
            }
          >
            <b className={lang === "ms" ? "active" : ""}>BM</b>
            <span>|</span>
            <b className={lang === "en" ? "active" : ""}>EN</b>
          </button>
          <button
            type="button"
            onClick={() => onOpenFeedback()}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
            title="Maklum Balas"
            aria-label="Maklum Balas"
          >
            <MessageSquarePlus size={17} />
          </button>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
    </div>
  );
}

function IngredientSelector({
  stapleIngredients,
  ingredientOptions,
  selected,
  setSelected,
  lang,
  selectedQuickFilter,
  setSelectedQuickFilter,
}) {
  const isMalay = lang === "ms";
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const selectableIngredients = [...stapleIngredients, ...ingredientOptions];
  const tabs = [
    ["all", isMalay ? "Semua" : "All"],
    ["Protein", "Protein"],
    ["Vegetables", isMalay ? "Sayur-sayuran" : "Vegetables"],
    ["Seafood", isMalay ? "Makanan Laut" : "Seafood"],
    ["Spices", isMalay ? "Rempah & Tumis" : "Spices & Aromatics"],
    ["Sauces", isMalay ? "Sos & Perasa" : "Sauces"],
    ["Carbs", isMalay ? "Karbo & Mi" : "Carbs & Noodles"],
  ];
  const categoryFor = (item) =>
    item.group === "Dapur Staples"
      ? item.id === "onion"
        ? "Aromatics"
        : "Sauces"
      : item.group;
  const sortedIngredients = sortByActiveName(selectableIngredients, lang);
  const visibleIngredients = sortedIngredients.filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesCategory =
      query ||
      category === "all" ||
      (category === "Spices"
        ? ["Spices", "Aromatics"].includes(categoryFor(item))
        : categoryFor(item) === category);
    return (
      matchesCategory &&
      text(item.name, lang).toLowerCase().includes(query) &&
      (!letter || activeName(item, lang).trim().toLocaleUpperCase().startsWith(letter))
    );
  });
  const quickStapleIds = [
    "red-onion",
    "garlic",
    "ginger",
    "salt",
    "palm-sugar",
    "soy-sauce",
    "oil",
  ];
  const allQuickSelected = quickStapleIds.every((id) => selected.includes(id));
  const toggleQuickStaples = () =>
    setSelected((items) =>
      allQuickSelected
        ? items.filter((id) => !quickStapleIds.includes(id))
        : [...new Set([...items, ...quickStapleIds])],
    );
  const toggleIngredient = (id) =>
    setSelected((items) =>
      items.includes(id)
        ? items.filter((value) => value !== id)
        : [...items, id],
    );
  const selectedIngredients = selectableIngredients.filter((item) =>
    selected.includes(item.id),
  );
  const unselectedIngredients = visibleIngredients.filter(
    (item) => !selected.includes(item.id),
  );
  const ingredientGridLimit = 12;
  const remainingCount = Math.max(
    0,
    unselectedIngredients.length - ingredientGridLimit,
  );
  const ingredientsToShow = isExpanded
    ? unselectedIngredients
    : unselectedIngredients.slice(0, ingredientGridLimit);
  const handleClearAll = () => {
    setSelected([]);
    setSelectedQuickFilter("all");
  };
  return (
    <section className="ingredient-section">
      <div className="mt-1 mb-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800/70">
            {translations[lang].ui.fridge}
          </span>
          <h2 className="font-serif text-xl font-bold text-amber-950">
            {translations[lang].ui.chooseIngredients}
          </h2>
        </div>
        {(selectedIngredients.length > 0 || selectedQuickFilter !== "all") && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm transition-all duration-150 hover:bg-rose-100 active:scale-95"
            title={lang === "en" ? "Clear all selections" : "Kosongkan semua pilihan"}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>
              {lang === "en"
                ? `Clear (${selectedIngredients.length})`
                : `Kosongkan (${selectedIngredients.length})`}
            </span>
          </button>
        )}
      </div>
      <div className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-3 pt-1 sm:mx-0 sm:px-0">
        {QUICK_FILTERS.map((quickFilter) => {
          const isActive = selectedQuickFilter === quickFilter.id;
          return (
            <button
              key={quickFilter.id}
              type="button"
              onClick={() =>
                setSelectedQuickFilter(
                  isActive && quickFilter.id !== "all" ? "all" : quickFilter.id,
                )
              }
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "scale-[1.02] bg-amber-600 text-white shadow-sm"
                  : "border border-amber-200/70 bg-amber-50/80 text-amber-900 hover:bg-amber-100/60"
              }`}
            >
              {lang === "en" ? quickFilter.labelEn : quickFilter.labelMs}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-3 -mx-1 px-1">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={
              category === value
                ? "filter-chip active whitespace-nowrap"
                : "filter-chip whitespace-nowrap"
            }
          >
            {label}
          </button>
        ))}
      </div>
      <div className="search-box">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={
            isMalay ? "Cari bahan dalam peti..." : "Search fridge ingredients..."
          }
        />
      </div>
      <LetterFilter value={letter} onChange={setLetter} />
      <button
        className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700"
        onClick={toggleQuickStaples}
      >
        {"⚡"} {translations[lang].ui.autoStaples}
      </button>
      <div className="mt-4 flex items-center justify-between">
        <span className="selected-count">
          {translations[lang].ui.selectedCount(selected.length)}
        </span>
        <span className="text-[10px] text-stone-400">
          {translations[lang].ui.shownCount(selectedIngredients.length)}
        </span>
      </div>
      {selectedIngredients.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none pb-2">
          {selectedIngredients.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleIngredient(item.id)}
              className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-700"
            >
              {text(item.name, lang)}
              <X size={12} />
            </button>
          ))}
        </div>
      )}
      <div className={`relative ${isExpanded ? "" : "max-h-56 overflow-hidden"}`}>
        <div className="chip-grid">
          {ingredientsToShow.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleIngredient(item.id)}
              className="ingredient-chip"
            >
              {text(item.name, lang)}
            </button>
          ))}
        </div>
        {!isExpanded && remainingCount > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
        )}
      </div>
      {remainingCount > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2.5 mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 rounded-xl transition-all"
        >
          {isExpanded
            ? translations[lang].ui.showLess
            : translations[lang].ui.showAllIngredients(remainingCount)}
        </button>
      )}
    </section>
  );
}

function GroceryListLegacy({
  groceryList,
  _ingredients,
  onToggleItem,
  onClearChecked,
  onClearAll,
  onMergeItems = (items) => {
    const ids = new Set(groceryList.map((item) => item.id));
    window.localStorage.setItem(
      "masakapa-grocery-list",
      JSON.stringify([
        ...groceryList,
        ...items.filter((item) => item && !ids.has(item.id)),
      ]),
    );
    window.location.reload();
  },
  lang,
  onToggleLanguage,
  onOpenFeedback,
}) {
  const t = translations[lang];
  const [showShare, setShowShare] = useState(false);
  const [importCode, setImportCode] = useState("");
  const unchecked = groceryList.filter((item) => !item.checked);
  const code = encodeGrocery(unchecked);
  const shareText = `${formatGrocery(unchecked, lang)}\n${window.location.origin}/?import_grocery=${encodeURIComponent(code)}`;
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Senarai Pasar", text: shareText });
      } catch {
        /* User cancelled sharing. */
      }
    } else
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
        "_blank",
        "noopener,noreferrer",
      );
  };
  const importItems = () => {
    try {
      const items = decodeGrocery(importCode);
      onMergeItems(items);
      setImportCode("");
      setShowShare(false);
    } catch {
      window.alert(
        lang === "ms" ? "Kod import tidak sah." : "Invalid import code.",
      );
    }
  };
  return (
    <div className="screen">
      <Header
        title={t.headers.grocery[0]}
        subtitle={t.headers.grocery[1]}
        lang={lang}
        onToggleLanguage={onToggleLanguage}
        onOpenFeedback={onOpenFeedback}
      />
      <main className="content grocery-content">
        <div className="grocery-toolbar">
          <span>
            {unchecked.length} {t.ui.groceryCount}
          </span>
          <div className="flex items-center gap-3">
            <button onClick={share}>
              {lang === "ms" ? "Kongsi ke WhatsApp" : "Share to WhatsApp"}
            </button>
            <button onClick={() => setShowShare(true)}>
              {lang === "ms" ? "Eksport / Import" : "Export / Import"}
            </button>
            {groceryList.some((item) => item.checked) && (
              <button onClick={onClearChecked}>{t.ui.clearChecked}</button>
            )}
          </div>
        </div>
        {groceryList.length ? (
          <>
            <div className="grocery-items">
              {groceryList.map((item) => (
                <button
                  key={item.id}
                  className={
                    item.checked ? "grocery-item checked" : "grocery-item"
                  }
                  onClick={() => onToggleItem(item.id)}
                >
                  <span className="check-box">
                    {item.checked && <Check size={14} />}
                  </span>
                  <span>
                    <strong>{text(item.name, lang)}</strong>
                    <small>
                      {item.amount} | {text(item.recipeTitle, lang)}
                    </small>
                  </span>
                </button>
              ))}
            </div>
            <button className="clear-all-button" onClick={onClearAll}>
              {t.ui.clearAll}
            </button>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-list-icon">
              <Check size={22} />
            </span>
            <p>{t.ui.emptyGrocery}</p>
            <span>{t.ui.emptyGroceryHint}</span>
          </div>
        )}
        {showShare && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-stone-900/30 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-800">
                  Eksport / Import
                </h2>
                <button onClick={() => setShowShare(false)}>X</button>
              </div>
              <p className="mt-4 text-xs font-bold text-stone-600">
                Export code
              </p>
              <textarea
                readOnly
                value={code}
                className="mt-2 h-24 w-full rounded-lg border border-stone-200 p-2 text-[10px]"
                onFocus={(event) => event.target.select()}
              />
              <button
                className="mt-2 rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white"
                onClick={() => navigator.clipboard?.writeText(code)}
              >
                Copy code
              </button>
              <p className="mt-5 text-xs font-bold text-stone-600">
                Import code
              </p>
              <textarea
                value={importCode}
                onChange={(event) => setImportCode(event.target.value)}
                placeholder="Paste export code"
                className="mt-2 h-20 w-full rounded-lg border border-stone-200 p-2 text-[10px]"
              />
              <button
                className="mt-2 rounded-lg bg-[#d6573a] px-3 py-2 text-xs font-bold text-white"
                onClick={importItems}
              >
                Import
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Matcher({
  recipes,
  stapleIngredients,
  ingredientOptions,
  openRecipe,
  query,
  setQuery,
  filter,
  setFilter,
  favorites,
  toggleFavorite,
  lang,
  onToggleLanguage,
  onOpenFeedback,
}) {
  const t = translations[lang];
  const allStapleIds = stapleIngredients.map((item) => item.id);
  const [staplesOn, setStaplesOn] = useState(() =>
    readStorage("masakapa-staples-on", true),
  );
  const [selected, setSelected] = useState(() =>
    readStorage("masakapa-selected-ingredients", [
      "chicken",
      "potato",
      "turmeric",
    ]),
  );
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState("all");
  useEffect(() => writeStorage("masakapa-staples-on", staplesOn), [staplesOn]);
  useEffect(
    () => writeStorage("masakapa-selected-ingredients", selected),
    [selected],
  );
  const matches = useMemo(
    () =>
      recipes
        .map((recipe) => {
          const core = recipe.ingredients.filter(
            (item) => !item.staple && !item.optional,
          );
          const available = new Set(
            staplesOn ? [...selected, ...allStapleIds] : selected,
          );
          const missingCore = core.filter((item) => !matchesIngredient(item.id, available));
          const matchedCoreCount = core.length - missingCore.length;
          const matchPercentage = core.length
            ? Math.round((matchedCoreCount / core.length) * 100)
            : 100;
          return {
            recipe,
            missingCore,
            missingOptional: recipe.ingredients.filter(
              (item) => item.optional && !matchesIngredient(item.id, available),
            ),
            matchPercentage,
          };
        })
        .filter(
          (match) =>
            match.missingCore.length <= 2 &&
            match.matchPercentage >= 40 &&
            matchesQuickFilter(match.recipe, selectedQuickFilter),
        )
        .sort(
          (a, b) =>
            b.matchPercentage - a.matchPercentage ||
            (a.recipe.cookTimeMins ?? a.recipe.time) -
              (b.recipe.cookTimeMins ?? b.recipe.time),
        ),
    [selected, staplesOn, recipes, allStapleIds, selectedQuickFilter],
  );
  const visible = matches.filter((match) =>
    matchesFilter(match.recipe, query, filter, favorites, lang),
  );
  const hasSelected = selected.length > 0;
  const showMatchCta = selected.length > 0 && visible.length > 0;
  return (
    <div className="screen">
      <Header
        title={t.headers.matcher[0]}
        subtitle={t.headers.matcher[1]}
        lang={lang}
        onToggleLanguage={onToggleLanguage}
        onOpenFeedback={onOpenFeedback}
      />
      <main className="content pb-24">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <TudungSajiModal
              recipes={recipes}
              language={lang}
              onSelectRecipe={openRecipe}
              isOpen={showSpinner}
              onClose={() => setShowSpinner(false)}
            />
            <section className="staples-panel">
              <div>
                <span className="section-kicker">{t.ui.pantryMark}</span>
                <h2>{t.ui.pantry}</h2>
                <p>{t.ui.pantryHint}</p>
              </div>
              <button
                aria-label={t.ui.pantry}
                onClick={() => setStaplesOn((on) => !on)}
                className="toggle"
              >
                {staplesOn ? (
                  <ToggleRight size={40} />
                ) : (
                  <ToggleLeft size={40} />
                )}
                <b>{staplesOn ? t.ui.on : t.ui.off}</b>
              </button>
              <div className="staple-list">
                {stapleIngredients.map((item) => (
                  <span
                    key={item.id}
                    className={staplesOn ? "mini-pill on" : "mini-pill"}
                  >
                    {text(item.name, lang)}
                  </span>
                ))}
              </div>
            </section>
            <IngredientSelector
              stapleIngredients={stapleIngredients}
              ingredientOptions={ingredientOptions}
              selected={selected}
              setSelected={setSelected}
              lang={lang}
              selectedQuickFilter={selectedQuickFilter}
              setSelectedQuickFilter={setSelectedQuickFilter}
            />
          </div>
          <section
            id="recipe-results"
            className="results-section md:col-span-5 md:sticky md:top-4 md:self-start"
          >
            <Filters
              query={query}
              setQuery={setQuery}
              filter={filter}
              setFilter={setFilter}
              lang={lang}
            />
            <div className="section-heading results-heading">
              <div>
                <span className="section-kicker">{t.ui.recommendations}</span>
                <h2>
                  {visible.length} {t.ui.matches}
                </h2>
              </div>
              <Sparkles size={21} className="sparkle" />
            </div>
            <div className="recipe-list flex flex-col space-y-2 px-4 pb-24">
              {visible.map((match) => (
                <RecipeCard
                  key={match.recipe.id}
                  recipe={match.recipe}
                  match={match}
                  isFavorite={favorites.some((favorite) => favorite.id === match.recipe.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={openRecipe}
                  lang={lang}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      {showMatchCta && (
        <button
          type="button"
          onClick={() => {
            document
              .getElementById("recipe-results")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="fixed md:absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2.5 bg-[#E05A47] hover:bg-[#c84e3c] text-white rounded-full shadow-xl font-bold text-xs tracking-wide animate-bounce transition-all"
        >
          <span className="max-w-[85vw] truncate">
            {t.ui.viewMatchedRecipes(visible.length)}
          </span>
        </button>
      )}
        <button
          type="button"
          onClick={() => setShowSpinner(true)}
          title={lang === "en" ? "Surprise Me!" : "Tak Tahu Nak Masak?"}
           className={`fixed md:absolute bottom-24 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center justify-center rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out ${hasSelected ? "w-12 h-12 p-0" : "gap-2 px-4 py-3"}`}
        >
          {hasSelected ? (
            <Sparkles className="w-6 h-6 text-yellow-100" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-yellow-200" />
              <span className="font-bold text-sm tracking-wide">
                {lang === "en" ? "Surprise Me!" : "Tak Tahu Nak Masak?"}
              </span>
            </>
          )}
        </button>
    </div>
  );
}

function Discover({
  recipes,
  openRecipe,
  query,
  setQuery,
  filter,
  setFilter,
  favorites,
  toggleFavorite,
  lang,
  onToggleLanguage,
  onOpenFeedback,
}) {
  const t = translations[lang];
  const [letter, setLetter] = useState("");
  const visible = sortByActiveName(recipes, lang).filter(
    (recipe) =>
      matchesFilter(recipe, query, filter, favorites, lang) &&
      (!letter || activeName(recipe, lang).trim().toLocaleUpperCase().startsWith(letter)),
  );
  const favoriteFilter =
    filter === "Favorite" || filter === "Kegemaran" || filter === "Favorites";
  return (
    <div className="screen">
      <Header
        title={t.headers.discover[0]}
        subtitle={t.headers.discover[1]}
        lang={lang}
        onToggleLanguage={onToggleLanguage}
        onOpenFeedback={onOpenFeedback}
      />
      <main className="content pb-24">
        <Filters
          query={query}
          setQuery={setQuery}
          filter={filter}
          setFilter={setFilter}
          lang={lang}
          letter={letter}
          setLetter={setLetter}
        />
        <div className="discover-intro">
          <div>
            <span className="section-kicker">{t.ui.today}</span>
            <h2>
              {visible.length} {t.ui.choices}
            </h2>
          </div>
          <span className="sort-label">
            {t.ui.easiest} <ChevronRight size={16} />
          </span>
        </div>
        {favoriteFilter && visible.length === 0 ? (
          <div className="empty-state">
            <p>
              {lang === "ms"
                ? "Tiada resipi kegemaran lagi."
                : "No favorited recipes yet."}
            </p>
          </div>
        ) : (
          <div className="recipe-list grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-24">
            {visible.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.some((favorite) => favorite.id === recipe.id)}
                onToggleFavorite={toggleFavorite}
                onClick={openRecipe}
                lang={lang}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
function Favorites({
  openRecipe,
  favorites,
  toggleFavorite,
  lang,
  onToggleLanguage,
  onOpenFeedback,
  onExplore,
}) {
  const [isOffline, setIsOffline] = useState(() => navigator.onLine === false);
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <div className="screen">
      {isOffline && (
        <div className="fixed left-0 right-0 top-0 z-50 bg-stone-800/90 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm">
          {lang === "en"
            ? "⚡ Offline Mode: Your favorites are saved"
            : "⚡ Mod Luar Talian: Resipi kegemaran tersimpan"}
        </div>
      )}
      <Header
         title={translations[lang].ui.favoriteTitle}
         subtitle={translations[lang].ui.favoriteSubtitle}
        lang={lang}
        onToggleLanguage={onToggleLanguage}
        onOpenFeedback={onOpenFeedback}
      />
      <main className="content pb-24">
        {favorites.length ? (
          <div className="recipe-list grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-24">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onClick={openRecipe}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          <div className="mx-4 mt-8 rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Heart size={24} fill="currentColor" />
            </span>
            <p className="text-sm leading-6 text-stone-600">
              {lang === "en" ? "No favorites yet" : "Belum ada kegemaran"}
            </p>
            <button
              className="mt-5 rounded-lg bg-[#d6573a] px-4 py-2 text-xs font-bold text-white"
              onClick={onExplore}
            >
              {translations[lang].ui.exploreRecipes}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const mainRef = useRef(null);
  const { recipes, ingredientOptions, stapleIngredients, loading } =
    useRecipes();
  const [lang, setLang] = useState(() =>
    readStorage("masakapa-language", "ms") === "en" ? "en" : "ms",
  );
  const [currentScreen, setCurrentScreen] = useState(() =>
    isAdminRoute() ? "admin" : "main",
  );
  const [screen, setScreen] = useState(() =>
    "matcher",
  );
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [feedbackState, setFeedbackState] = useState({
    isOpen: false,
    recipeId: null,
    recipeTitle: "",
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [groceryList, setGroceryList] = useState(() =>
    readStorage("masakapa-grocery-list", []),
  );
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateSW] = useState(() =>
    registerSW({
      immediate: true,
      onNeedRefresh: () => setUpdateAvailable(true),
    }),
  );
  useEffect(() => writeStorage("masakapa-language", lang), [lang]);
  useEffect(
    () => writeStorage("masakapa-grocery-list", groceryList),
    [groceryList],
  );
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [screen, activeRecipe]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isAdminRoute()) setCurrentScreen("admin");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const addMissing = (recipe, ingredients) =>
    setGroceryList((items) => {
      const recipeName = recipe.name_ms || recipe.name || "";
      const additions = ingredients
        .filter(
          (ing) =>
            !items.some(
              (item) =>
                item?.ingredientId === ing.id && item?.recipeName === recipeName,
            ),
        )
        .map((ing) => ({
          id: `${ing.id}-${Date.now()}`,
          ingredientId: ing.id,
          name: ing.name || ing.id,
          amount: ing.amount || "",
          recipeName,
          checked: false,
        }));
      return [...items.filter(Boolean), ...additions];
    });
  const openRecipe = (recipe, missingCore) => {
    window.history.pushState({ view: "detail" }, "");
    setActiveRecipe({
      ...recipe,
      ...(missingCore === undefined ? {} : { missingCore }),
      onAddMissing: addMissing,
    });
  };
  useEffect(() => {
    const handlePopState = () => setActiveRecipe(null);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const handleNavigate = (nextScreen) => {
    if (activeRecipe) {
      setActiveRecipe(null);
      if (window.history.state?.view === "detail") window.history.back();
    }
    if (nextScreen === "discover") setFilter("Semua");
    setScreen(nextScreen);
  };
  const onToggleLanguage = () =>
    setLang((value) => (value === "ms" ? "en" : "ms"));
  const openFeedback = (recipeId = null, recipeTitle = "") => {
    setFeedbackState({ isOpen: true, recipeId, recipeTitle });
  };
  const closeFeedback = () => {
    setFeedbackState({ isOpen: false, recipeId: null, recipeTitle: "" });
  };
  const goToApp = () => {
    window.history.pushState({}, "", "/");
    setCurrentScreen("main");
    setScreen("matcher");
  };
  const language = lang;
  const t = translations[lang];
  const nav = (
    <BottomNav
      screen={screen}
      onNavigate={handleNavigate}
      groceryCount={groceryList.length}
      lang={lang}
    />
  );
  const toast = updateAvailable && (
    <div className="update-toast">
      <span>{t.ui.update}</span>
      <button onClick={() => updateSW(true)}>{t.ui.refresh}</button>
    </div>
  );
  if (currentScreen === "admin" || isAdminRoute()) {
    return <Admin onBackToApp={goToApp} />;
  }
  if (loading) return <SplashScreen />;
  const view = activeRecipe ? (
    <RecipeDetail
      recipe={activeRecipe}
      recipes={recipes}
       isFavorite={isFavorite(activeRecipe.id)}
      onToggleFavorite={toggleFavorite}
      onOpenRecipe={openRecipe}
      onBack={() =>
        window.history.state?.view === "detail"
          ? window.history.back()
          : setActiveRecipe(null)
      }
      onAddMissing={addMissing}
      lang={lang}
      onToggleLanguage={onToggleLanguage}
      onOpenFeedback={openFeedback}
    />
  ) : screen === "matcher" ? (
    <Matcher
      recipes={recipes}
      stapleIngredients={stapleIngredients}
      ingredientOptions={ingredientOptions}
      openRecipe={openRecipe}
      query={query}
      setQuery={setQuery}
      filter={filter}
      setFilter={setFilter}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      lang={lang}
      onToggleLanguage={onToggleLanguage}
      onOpenFeedback={openFeedback}
    />
  ) : screen === "grocery" ? (
    <GroceryList
      groceryList={groceryList}
      ingredients={[...stapleIngredients, ...ingredientOptions]}
      onToggleItem={(id) =>
        setGroceryList((items) =>
          items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        )
      }
      onClearChecked={() =>
        setGroceryList((items) => items.filter((item) => !item.checked))
      }
      onClearAll={() => setGroceryList([])}
      lang={lang}
      onToggleLanguage={onToggleLanguage}
      onOpenFeedback={openFeedback}
    />
  ) : screen === "favorites" ? (
    <Favorites
      openRecipe={openRecipe}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      lang={lang}
      onToggleLanguage={onToggleLanguage}
      onOpenFeedback={openFeedback}
      onExplore={() => handleNavigate("discover")}
    />
  ) : (
    <Discover
      recipes={recipes}
      openRecipe={openRecipe}
      query={query}
      setQuery={setQuery}
      filter={filter}
      setFilter={setFilter}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      lang={lang}
      onToggleLanguage={onToggleLanguage}
      onOpenFeedback={openFeedback}
    />
  );
  return (
    <div className="app-shell">
      <div className="relative flex flex-col max-w-md md:max-w-4xl lg:max-w-6xl mx-auto h-screen md:h-[92vh] md:my-[4vh] md:rounded-2xl md:shadow-2xl overflow-hidden bg-[#FAF7F2]">
        <main ref={mainRef} className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-3">
          {view}
        </main>
        <footer className="shrink-0 border-t border-stone-200 bg-white z-50">
          {nav}
        </footer>
        {toast}
        {feedbackState.isOpen && (
          <FeedbackModal
            isOpen={feedbackState.isOpen}
            onClose={closeFeedback}
            initialRecipeId={feedbackState.recipeId}
            recipeTitle={feedbackState.recipeTitle}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
function GroceryList({ ingredients, ...props }) {
  const { ingredientOptions, stapleIngredients } = useRecipes();
  const View = GroceryListView || GroceryListLegacy;
  return (
    <View
      {...props}
      ingredients={ingredients || [...stapleIngredients, ...ingredientOptions]}
    />
  );
}
