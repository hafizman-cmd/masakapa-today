import { useEffect, useRef, useState } from "react";
import { Check, Dices, X } from "lucide-react";
import { text, translations } from "../data/translations";

const FILTERS = ["all", "quick", "express", "traditional", "kids"];

function recipeStyle(recipe) {
  return String(text(recipe?.style, "ms") || recipe?.style_ms || "").toLowerCase();
}

function isKidsFriendly(recipe) {
  return (Array.isArray(recipe?.ingredients) ? recipe.ingredients : [])
    .filter((item) => item && !item.staple && !item.optional)
    .every((item) => {
      const ingredient = `${item?.id || ""} ${text(item?.name, "ms") || ""}`.toLowerCase();
      return !ingredient.includes("cili-padi") && !ingredient.includes("chili-padi") && !ingredient.includes("bird-eye-chilli");
    });
}

function matchesFilter(recipe, filter) {
  if (!recipe) return false;
  const style = recipeStyle(recipe);
  if (filter === "quick") return (recipe.cookTimeMins ?? recipe.time) <= 20;
  if (filter === "express") return style.includes("express") || style.includes("bujang");
  if (filter === "traditional") return style.includes("kampung");
  if (filter === "kids") return isKidsFriendly(recipe);
  return true;
}

export default function RecipeSpinner({
  recipes,
  lang,
  language,
  onOpenRecipe,
  onSelectRecipe,
  onClose,
  open: controlledOpen,
  onOpen,
  showTrigger = true,
}) {
  const activeLanguage = language || lang || "ms";
  const availableRecipes = Array.isArray(recipes) ? recipes : [];
  const selectRecipe = onSelectRecipe || onOpenRecipe;
  const spinnerTranslations = translations?.[activeLanguage]?.ui?.spinner;
  const getTranslation = (key, defaultText) =>
    spinnerTranslations?.[key] ||
    translations?.spinner?.[key]?.[activeLanguage] ||
    defaultText;
  const getFilterTranslation = (key, defaultText) =>
    spinnerTranslations?.filters?.[key] ||
    translations?.spinner?.filters?.[key]?.[activeLanguage] ||
    defaultText;
  const [internalOpen, setInternalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [rotation, setRotation] = useState(0);
  const [displayRecipe, setDisplayRecipe] = useState(null);
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef(null);
  const pool = availableRecipes.filter((recipe) => matchesFilter(recipe, filter));
  const open = controlledOpen ?? internalOpen;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const close = () => {
    if (!spinning) {
      setInternalOpen(false);
      onClose?.();
    }
  };

  const spin = () => {
    if (!pool.length || spinning) return;
    const nextWinner = pool[Math.floor(Math.random() * pool.length)];
    setWinner(null);
    setDisplayRecipe(nextWinner);
    setSpinning(true);
    setRotation((value) => value + 1440 + Math.floor(Math.random() * 360));
    timerRef.current = window.setTimeout(() => {
      setWinner(nextWinner);
      setSpinning(false);
    }, 3000);
  };

  const resetFilter = (nextFilter) => {
    if (spinning) return;
    setFilter(nextFilter);
    setWinner(null);
    setDisplayRecipe(null);
  };

  const openWinner = () => {
    if (!winner || !selectRecipe) return;
    setInternalOpen(false);
    onClose?.();
    selectRecipe(winner);
  };

  const activeRecipe = displayRecipe || pool[0];
  const activeName = activeRecipe
    ? text(activeRecipe?.name, activeLanguage) || activeRecipe?.name_en || activeRecipe?.name_ms || "Selected Recipe"
    : "";
  const initials = activeName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          onClick={() => {
            setInternalOpen(true);
            onOpen?.();
          }}
          className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-xl border border-[#f0c66e] bg-[#fff8e7] px-4 py-3 text-sm font-bold text-[#99651b] shadow-sm transition hover:bg-[#fff1c9]"
        >
          <Dices size={18} /> {getTranslation("trigger", activeLanguage === "en" ? "Don't Know What to Cook?" : "Tak Tahu Nak Masak?")}
        </button>
      )}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && close()}
        >
          <section
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fffdf8] p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recipe-spinner-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="section-kicker">{getTranslation("kicker", activeLanguage === "en" ? "RANDOM PICK" : "PILIHAN RAWAK")}</span>
                <h2 id="recipe-spinner-title" className="mt-1 text-xl font-bold text-stone-900">
                  {getTranslation("title", activeLanguage === "en" ? "Don't Know What to Cook" : "Roda Tak Tahu Nak Masak Apa")}
                </h2>
              </div>
              <button type="button" onClick={close} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label={getTranslation("close", activeLanguage === "en" ? "Close" : "Tutup")}>
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {FILTERS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => resetFilter(value)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${filter === value ? "border-[#d6573a] bg-[#d6573a] text-white" : "border-stone-200 bg-white text-stone-600 hover:border-[#d6573a]"}`}
                >
                  {getFilterTranslation(value, value)}
                </button>
              ))}
            </div>

            <div className="my-6 flex justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-8 border-[#f5d58a] bg-[conic-gradient(#fce9ae_0deg_45deg,#fffaf0_45deg_90deg,#fce9ae_90deg_135deg,#fffaf0_135deg_180deg,#fce9ae_180deg_225deg,#fffaf0_225deg_270deg,#fce9ae_270deg_315deg,#fffaf0_315deg_360deg)] shadow-inner">
                <div className="absolute -top-4 z-10 h-0 w-0 border-x-[10px] border-t-[20px] border-x-transparent border-t-[#d6573a]" />
                <div
                  className="flex h-40 w-40 items-center justify-center rounded-full bg-white p-5 text-center shadow-lg"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: "transform 3s cubic-bezier(0.15, 0.85, 0.35, 1.2)",
                  }}
                >
                  {activeRecipe ? (
                    <div style={{ transform: `rotate(${-rotation}deg)` }}>
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#d6573a] text-sm font-bold text-white">
                        {initials}
                      </div>
                      <p className="line-clamp-2 text-sm font-bold text-stone-800">{activeName}</p>
                    </div>
                  ) : (
                    <Dices className="text-[#d6573a]" size={36} />
                  )}
                </div>
              </div>
            </div>

            {winner ? (
              <div className="rounded-2xl border border-[#f0c66e] bg-[#fff8e7] p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a66b1d]">{getTranslation("winner", activeLanguage === "en" ? "Today's Dish Is..." : "Menu Hari Ini Adalah...")}</p>
                <h3 className="mt-1 text-2xl font-bold text-stone-900">{text(winner?.name, activeLanguage) || winner?.name_en || winner?.name_ms || "Selected Recipe"}</h3>
                <p className="mt-2 text-sm text-stone-600">
                  {winner?.time ?? winner?.cookTimeMins ?? "-"} {translations?.[activeLanguage]?.ui?.minutes || (activeLanguage === "en" ? "min" : "minit")} <span className="mx-1">•</span> {text(winner?.difficulty, activeLanguage) || winner?.difficulty_en || winner?.difficulty_ms || "-"}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button type="button" onClick={openWinner} className="rounded-xl bg-[#d6573a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#bf4b31]">
                    {getTranslation("viewRecipe", activeLanguage === "en" ? "View Recipe" : "Lihat Resepi")}
                  </button>
                  <button type="button" onClick={spin} className="rounded-xl border border-[#d6573a] px-4 py-2.5 text-sm font-bold text-[#d6573a] hover:bg-white">
                    {getTranslation("spinAgain", activeLanguage === "en" ? "Spin Again" : "Putar Lagi")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={spin}
                disabled={spinning || !pool.length}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d6573a] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#bf4b31] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Dices size={18} /> {spinning ? getTranslation("spinning", activeLanguage === "en" ? "Spinning..." : "Sedang Memutar...") : getTranslation("spin", activeLanguage === "en" ? "Spin the Wheel" : "Putar Roda")}
              </button>
            )}
            {!pool.length && <p className="mt-3 text-center text-sm text-stone-500">{getTranslation("noRecipes", activeLanguage === "en" ? "No recipes match this filter." : "Tiada resipi untuk pilihan ini.")}</p>}
            {winner && <p className="mt-4 flex items-center justify-center gap-1 text-xs text-stone-500"><Check size={14} /> {getTranslation("ready", activeLanguage === "en" ? "Today's pick" : "Pilihan untuk hari ini")}</p>}
          </section>
        </div>
      )}
    </>
  );
}
