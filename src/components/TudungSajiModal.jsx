import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { text } from "../data/translations";

function chooseRecipe(recipes) {
  const pool = Array.isArray(recipes) ? recipes.filter(Boolean) : [];
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function recipeName(recipe, language) {
  const localizedName = language === "en" ? recipe?.name_en : recipe?.name_ms;
  return localizedName || text(recipe?.name, language) || recipe?.name_en || recipe?.name_ms || "Recipe";
}

export default function TudungSajiModal({
  isOpen,
  onClose,
  recipes,
  language = "ms",
  onSelectRecipe,
}) {
  const activeLanguage = language === "en" ? "en" : "ms";
  const [isCoverLifted, setIsCoverLifted] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(() => chooseRecipe(recipes));
  const [isRerolling, setIsRerolling] = useState(false);
  const rerollTimerRef = useRef(null);
  const pendingRecipeRef = useRef(null);
  const hasRecipe = Boolean(selectedRecipe);

  const finishReroll = () => {
    if (!pendingRecipeRef.current) return;
    setSelectedRecipe(pendingRecipeRef.current);
    pendingRecipeRef.current = null;
    setIsRerolling(false);
    window.clearTimeout(rerollTimerRef.current);
  };

  useEffect(() => () => {
    window.clearTimeout(rerollTimerRef.current);
    pendingRecipeRef.current = null;
  }, []);

  if (!isOpen) return null;

  const time = selectedRecipe?.cookTimeMins ?? selectedRecipe?.time;
  const difficulty = text(selectedRecipe?.difficulty, activeLanguage) || selectedRecipe?.difficulty_en || selectedRecipe?.difficulty_ms;
  const matchPercentage = selectedRecipe?.matchPercentage ?? selectedRecipe?.match?.matchPercentage;
  const recipeTitle = recipeName(selectedRecipe, activeLanguage);
  const cookingTime = time != null ? `${time} ${activeLanguage === "en" ? "min" : "minit"}` : "";
  const titleLength = recipeTitle?.length || 0;
  const titleFontSize = titleLength > 32
    ? "text-xs"
    : titleLength > 22
      ? "text-sm"
      : "text-base font-serif";

  const reroll = () => {
    setIsCoverLifted(false);
    setIsRerolling(true);
    pendingRecipeRef.current = chooseRecipe(recipes);
    window.clearTimeout(rerollTimerRef.current);
    rerollTimerRef.current = window.setTimeout(finishReroll, 850);
  };

  const openRecipe = () => {
    if (!selectedRecipe) return;
    onClose?.();
    onSelectRecipe?.(selectedRecipe);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4">
      <section className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fffdf8] p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="tudung-saji-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="section-kicker">{activeLanguage === "en" ? "A SURPRISE FROM THE KITCHEN" : "KEJUTAN DARI DAPUR"}</span>
            <h2 id="tudung-saji-title" className="mt-1 text-xl font-bold text-stone-900">
              {activeLanguage === "en" ? "Today’s Mystery Dish" : "Sajian Rahsia Hari Ini"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label={activeLanguage === "en" ? "Close" : "Tutup"}>
            <X size={20} />
          </button>
        </div>

        <div className="relative mt-5 h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-[#f7e6bd] via-[#efd39a] to-[#c9955e]">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[#9d673e]/25" />
          <div className="absolute bottom-7 left-1/2 h-20 w-64 -translate-x-1/2 rounded-[50%] bg-[#fff8e5] shadow-[0_12px_20px_rgba(92,52,26,0.28)]" />
          <div className="absolute bottom-12 left-1/2 flex h-24 w-44 -translate-x-1/2 items-center justify-center rounded-[50%] bg-gradient-to-br from-[#d96f3f] to-[#8f422c] shadow-inner">
          </div>
          {hasRecipe && (
            <div onTransitionEnd={(event) => event.propertyName === "opacity" && finishReroll()} className={`absolute bottom-12 left-1/2 z-[5] flex w-[88%] max-w-[280px] -translate-x-1/2 flex-col items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-50/95 px-4 py-3 text-center shadow-md backdrop-blur-xs transition-all duration-700 ${isCoverLifted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
              <h3 className={`mb-2 break-words font-bold leading-snug tracking-tight text-amber-950 ${titleFontSize}`}>
                {recipeTitle}
              </h3>
              <div className="flex items-center gap-2">
                {cookingTime && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2 py-0.5 text-[11px] font-medium text-amber-800">⏱️ {cookingTime}</span>}
                {difficulty && <span className="inline-flex items-center rounded-full bg-amber-100/80 px-2 py-0.5 text-[11px] font-medium text-amber-800">{difficulty}</span>}
                {matchPercentage != null && <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700"><Check size={10} className="mr-0.5" /> {matchPercentage}%</span>}
              </div>
            </div>
          )}
          <div className={`absolute bottom-16 left-1/2 z-10 h-36 w-52 -translate-x-1/2 rounded-[52%_52%_42%_42%] border-4 border-[#9b5b2d] bg-[repeating-linear-gradient(25deg,transparent_0_9px,#f2bd69_10px_12px),repeating-linear-gradient(155deg,#c47737_0_10px,#8d4a29_11px_13px)] shadow-[0_12px_18px_rgba(77,42,20,0.35)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCoverLifted ? "-translate-y-36 scale-105 opacity-0" : ""}`}>
            <div className="absolute -top-5 left-1/2 h-8 w-14 -translate-x-1/2 rounded-full border-4 border-[#8d4a29] bg-[#d28a40] shadow-md" />
            <div className="absolute bottom-2 left-1/2 h-2 w-32 -translate-x-1/2 rounded-full bg-[#f3c77e]/60" />
          </div>
          {hasRecipe && <><Sparkles className={`absolute left-1/4 top-12 text-[#fff2c9] transition-opacity duration-700 ${isCoverLifted ? "animate-pulse opacity-100" : "animate-pulse opacity-70"}`} size={16} /><span className={`absolute right-1/4 top-16 h-2 w-2 rounded-full bg-white/80 transition-opacity duration-700 ${isCoverLifted ? "animate-ping opacity-100" : "animate-ping opacity-60"}`} /><span className={`absolute left-1/2 top-9 h-1.5 w-1.5 rounded-full bg-white/80 transition-opacity duration-700 ${isCoverLifted ? "animate-pulse opacity-100" : "animate-pulse opacity-70"}`} /></>}
          <div className="absolute bottom-2 left-4 text-2xl">🍽️</div><div className="absolute bottom-3 right-5 text-xl">🌿</div>
        </div>

        {!hasRecipe && <p className="mt-4 text-center text-sm text-stone-500">{activeLanguage === "en" ? "No recipes available right now." : "Tiada resipi buat masa ini."}</p>}

        {isCoverLifted ? (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button type="button" onClick={openRecipe} className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-amber-700">{activeLanguage === "en" ? "View Recipe" : "Lihat Resipi"}</button>
            <button type="button" onClick={reroll} className="rounded-xl border border-amber-300 bg-amber-50 px-6 py-3 font-semibold text-amber-900 hover:bg-amber-100">{activeLanguage === "en" ? "Try Again" : "Angkat Lagi"}</button>
          </div>
        ) : (
          <button type="button" onClick={() => setIsCoverLifted(true)} disabled={!hasRecipe || isRerolling} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50">{activeLanguage === "en" ? "Lift Food Cover 🍲" : "Buka Tudung Saji 🍲"}</button>
        )}
      </section>
    </div>
  );
}
