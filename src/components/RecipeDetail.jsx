import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  CookingPot,
  Flame,
  Heart,
  Lightbulb,
  Plus,
  Soup,
  Sparkles,
  Utensils,
} from "lucide-react";
import { text, translations } from "../data/translations";
import { SUBSTITUTIONS } from "../data/substitutions";
import { scaleIngredientAmount } from "../utils/portion";

const formatAmount = (amountStr, lang) => {
  if (!amountStr || lang !== "en") return amountStr;

  return amountStr
    .replace(/sudu besar/gi, "tbsp")
    .replace(/sudu teh/gi, "tsp")
    .replace(/biji/gi, "pcs")
    .replace(/ulas/gi, "cloves")
    .replace(/batang/gi, "stalks")
    .replace(/keping/gi, "slices")
    .replace(/helai/gi, "leaves")
    .replace(/cawan/gi, "cups")
    .replace(/paket|bungkus/gi, "pack")
    .replace(/secubit/gi, "pinch")
    .replace(/sedikit/gi, "to taste")
    .replace(/mangkuk/gi, "bowl");
};

const accents = {
  sunset: "from-[#ff9f68] to-[#e85d3f]",
  lime: "from-[#b5cc67] to-[#49734b]",
  coral: "from-[#ee8069] to-[#a83242]",
  chilli: "from-[#f27657] to-[#b92931]",
  gold: "from-[#f2c15f] to-[#d77736]",
  yellow: "from-[#f3d067] to-[#d89231]",
  orange: "from-[#e8a45d] to-[#c65e33]",
  brown: "from-[#b88865] to-[#754538]",
  honey: "from-[#e8b55a] to-[#bd682f]",
  pepper: "from-[#879d91] to-[#364f48]",
};

function readStoredIds(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readStoredBoolean(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return typeof value === "boolean" ? value : fallback;
  } catch {
    return fallback;
  }
}

function HeroIcon({ recipe }) {
  const searchable =
    `${text(recipe.name, "ms")} ${text(recipe.style, "ms")}`.toLowerCase();
  if (
    searchable.includes("sup") ||
    searchable.includes("soto") ||
    searchable.includes("laksa")
  )
    return <Soup size={46} strokeWidth={1.8} />;
  if (
    searchable.includes("ayam") ||
    searchable.includes("daging") ||
    searchable.includes("kambing")
  )
    return <CookingPot size={46} strokeWidth={1.8} />;
  if (
    searchable.includes("sambal") ||
    searchable.includes("cili") ||
    searchable.includes("kari")
  )
    return <Flame size={46} strokeWidth={1.8} />;
  return <Utensils size={46} strokeWidth={1.8} />;
}

export function MissingIngredients({
  ingredients,
  onAddMissing,
  servingCount,
  lang,
}) {
  if (!ingredients.length) return null;
  return (
    <button
      className="grocery-add-button detail-grocery-add"
      onClick={() => onAddMissing(ingredients, servingCount)}
    >
      <Plus size={14} /> {translations[lang].ui.addMissing(ingredients.length)}
    </button>
  );
}

export function PairingSection({ pairings, onOpenRecipe, lang }) {
  const t = translations[lang];
  if (!pairings.length) return null;
  return (
    <section className="pairings-section md:col-span-2 min-w-0">
      <div className="section-heading">
        <div>
          <span className="section-kicker">{t.ui.pairings}</span>
          <h2>{t.ui.completeMeal}</h2>
        </div>
        <span className="sort-label">
          {pairings.length} {t.ui.pairingsCount}
        </span>
      </div>
      <p className="pairings-copy">{t.ui.pairingHint}</p>
      <div className="w-full max-w-full min-w-0 overflow-x-auto scrollbar-none py-2">
        <div className="flex gap-3 w-max">
          {pairings.map((pairing) => (
          <button
            className="pairing-card"
            key={pairing.id}
            onClick={() => onOpenRecipe(pairing)}
          >
            <div
              className={`pairing-art bg-gradient-to-br ${accents[pairing.accent] || accents.sunset}`}
            >
              <span>
                {text(pairing.name, lang)
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </span>
            </div>
            <div>
              <strong>{text(pairing.name, lang)}</strong>
              <small>
                <Clock3 size={12} /> {pairing.time} min
              </small>
            </div>
            <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function RecipeDetail({
  recipe,
  recipes,
  onBack,
  isFavorite,
  onToggleFavorite,
  onOpenRecipe,
  onAddMissing,
  lang = "ms",
  onToggleLanguage,
  selectedIngredients = [],
  stapleIngredients = [],
}) {
  const t = translations[lang];
  const [checked, setChecked] = useState([]);
  const [selectedServings, setSelectedServings] = useState(
    recipe.defaultServings,
  );
  const [openSubstitution, setOpenSubstitution] = useState(null);
  const name = text(recipe.name, lang);
  const storedSelected = selectedIngredients.length
    ? selectedIngredients
    : readStoredIds("masakapa-selected-ingredients");
  const activeStaples = stapleIngredients.length
    ? stapleIngredients
    : recipe.ingredients.filter((item) => item.staple);
  const staplesEnabled = readStoredBoolean("masakapa-staples-on", true);
  const pantryIds = new Set([
    ...storedSelected.map((item) =>
      typeof item === "string" ? item : item.id,
    ),
    ...(staplesEnabled
      ? activeStaples.map((item) => (typeof item === "string" ? item : item.id))
      : []),
  ]);
  const availableIngredients = recipe.ingredients.filter((item) =>
    pantryIds.has(item.id),
  );
  const missingIngredients = recipe.ingredients.filter(
    (item) => !pantryIds.has(item.id),
  );
  const toggle = (id) =>
    setChecked((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  const pairings = (recipe.pairings || [])
    .map((id) => recipes.find((item) => item.id === id))
    .filter(Boolean);
  return (
    <div className="screen detail-screen w-full max-w-full overflow-x-hidden box-border px-4 sm:px-6">
      <div className={`detail-hero hero-${recipe.accent}`}>
        {recipe.image ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={recipe.image}
            alt={name}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/20 p-4 shadow-lg backdrop-blur-md">
              <HeroIcon recipe={recipe} />
            </div>
          </div>
        )}
        <button
          className="detail-back"
          onClick={onBack}
          aria-label={lang === "ms" ? "Kembali" : "Back"}
        >
          <ArrowLeft size={20} />
        </button>
        {onToggleLanguage && (
          <button
            className="language-toggle detail-language-toggle"
            onClick={onToggleLanguage}
          >
            <b className={lang === "ms" ? "active" : ""}>BM</b>
            <span>|</span>
            <b className={lang === "en" ? "active" : ""}>EN</b>
          </button>
        )}
        <button
          className="like-button"
          onClick={() => onToggleFavorite(recipe.id)}
          aria-label={isFavorite ? t.ui.removeFavorite : t.ui.saveRecipe}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <div className="hero-caption">
          <span>{text(recipe.style, lang)}</span>
          <h1>{name}</h1>
        </div>
      </div>
      <main className="content detail-content grid md:grid-cols-2 gap-6 w-full max-w-full min-w-0 overflow-hidden">
        <div className="detail-meta md:col-span-2 min-w-0">
          <span>
            <Clock3 size={16} /> {recipe.time} min
          </span>
          <span>
            <Flame size={16} /> {text(recipe.difficulty, lang)}
          </span>
          <span>
            {selectedServings} {t.ui.servings}
          </span>
        </div>
        <section className="detail-section min-w-0">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t.ui.needed}</span>
              <h2>{t.ui.ingredients}</h2>
            </div>
            <span className="progress">
              {checked.length}/{recipe.ingredients.length}
            </span>
          </div>
          <div className="portion-bar">
            <span>{t.ui.portion}</span>
            <div>
              {t.ui.pax.map((label, index) => {
                const count = [1, 2, 4][index];
                return (
                  <button
                    key={count}
                    onClick={() => setSelectedServings(count)}
                    className={
                      selectedServings === count
                        ? "portion-button active"
                        : "portion-button"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between rounded-xl bg-amber-50/70 p-3 text-xs font-medium text-amber-900">
            <span>
              {lang === "ms"
                ? `Ada ${availableIngredients.length} daripada ${recipe.ingredients.length} bahan dalam peti kamu`
                : `You have ${availableIngredients.length} of ${recipe.ingredients.length} ingredients`}
            </span>
          </div>
          <div className="checklist">
            {recipe.ingredients.map((item, index) => {
              const substitution = SUBSTITUTIONS[item.id];
              const substitutionKey = `${item.id}-${index}`;
              const isSubstitutionOpen = openSubstitution === substitutionKey;
              const isAvailable = pantryIds.has(item.id);
              const rowClass = `${checked.includes(index) ? "check-row checked" : "check-row"}${!isAvailable ? " bg-orange-50/50" : ""}`;
              return (
                <div key={substitutionKey}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggle(index)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && toggle(index)
                    }
                    className={rowClass}
                  >
                    <span className="check-box">
                      {checked.includes(index) && <Check size={14} />}
                    </span>
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <span>{text(item.name, lang)}</span>
                      <span
                        className={
                          isAvailable
                            ? "shrink-0 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700"
                            : "shrink-0 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700"
                        }
                      >
                        {isAvailable
                          ? lang === "ms"
                            ? "✓ Ada"
                            : "✓ In Pantry"
                          : lang === "ms"
                            ? "✕ Tiada"
                            : "✕ Missing"}
                      </span>
                      {substitution && (
                        <button
                          type="button"
                          className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700"
                          aria-expanded={isSubstitutionOpen}
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenSubstitution(
                              isSubstitutionOpen ? null : substitutionKey,
                            );
                          }}
                        >
                          {lang === "ms"
                            ? "💡 Tiada bahan ini?"
                            : "💡 No stock?"}
                        </button>
                      )}
                    </span>
                    <small>
                      {formatAmount(
                        scaleIngredientAmount(
                          item.amount,
                          recipe.defaultServings,
                          selectedServings,
                        ),
                        lang,
                      )}
                    </small>
                  </div>
                  {substitution && isSubstitutionOpen && (
                    <div className="ml-9 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                      <Lightbulb size={15} className="mt-0.5 shrink-0" />{" "}
                      <span>{text(substitution, lang)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <MissingIngredients
            ingredients={missingIngredients}
            servingCount={selectedServings}
            onAddMissing={(ingredients, servings) =>
              onAddMissing(recipe, ingredients, servings)
            }
            lang={lang}
          />
        </section>
        <section className="detail-section min-w-0">
          <h2>{lang === "ms" ? "Cara memasak" : "Instructions"}</h2>
          <ol className="mt-5 space-y-4">
            {recipe.steps.map((step, index) => (
              <li className="flex items-start gap-3 w-full max-w-full min-w-0 mb-4" key={index}>
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#E05A47] text-white font-bold text-xs flex items-center justify-center mt-0.5">
                  {index + 1}
                </div>
                <p className="flex-1 min-w-0 w-0 break-words whitespace-normal text-sm text-gray-700 leading-relaxed">
                  {text(step, lang)}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-start space-x-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 w-full min-w-0 break-words">
            <Sparkles size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 break-words">
              <h3 className="text-sm font-bold">
                {lang === "ms" ? "Petua Chef" : "Chef Tip"}
              </h3>
              <p className="mt-1 text-sm leading-6 break-words">
                {text(recipe.tip, lang)}
              </p>
            </div>
          </div>
        </section>
        <PairingSection
          pairings={pairings}
          onOpenRecipe={onOpenRecipe}
          lang={lang}
        />
      </main>
    </div>
  );
}
