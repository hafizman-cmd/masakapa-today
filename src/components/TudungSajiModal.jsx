import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { text, translations } from "../data/translations";

function chooseRecipe(recipes) {
  const pool = Array.isArray(recipes) ? recipes.filter(Boolean) : [];
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function recipeName(recipe, language) {
  const localizedName = language === "en" ? recipe?.name_en : recipe?.name_ms;
  return localizedName || text(recipe?.name, language) || recipe?.name_en || recipe?.name_ms || "Recipe";
}

const SPARKLES = [
  { left: "20%", bottom: "5.5rem", size: "text-xs", delay: "0s" },
  { left: "33%", bottom: "7rem", size: "text-[10px]", delay: "1.1s" },
  { left: "50%", bottom: "8rem", size: "text-[11px]", delay: ".6s" },
  { left: "67%", bottom: "7rem", size: "text-[10px]", delay: "1.8s" },
  { left: "79%", bottom: "5.5rem", size: "text-xs", delay: ".3s" },
];

const VAPORS = [
  { left: "27%", delay: "0s" },
  { left: "40%", delay: "1.4s" },
  { left: "58%", delay: ".8s" },
  { left: "71%", delay: "2.2s" },
];

export default function TudungSajiModal({
  isOpen,
  onClose,
  recipes,
  language = "ms",
  onSelectRecipe,
}) {
  const activeLanguage = language === "en" ? "en" : "ms";
  const t = translations[activeLanguage].ui.tudung;
  const [isCoverLifted, setIsCoverLifted] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(() => chooseRecipe(recipes));
  const [isRerolling, setIsRerolling] = useState(false);
  const rerollTimerRef = useRef(null);
  const pendingRecipeRef = useRef(null);
  const hasRecipe = Boolean(selectedRecipe);
  const showSuspense = hasRecipe && !isCoverLifted && !isRerolling;

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <section className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-amber-100/60 bg-[#fdf6ea]/60 p-5 shadow-2xl backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="tudung-saji-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-amber-800 font-bold tracking-wider text-[11px] uppercase">{t.kicker}</span>
            <h2 id="tudung-saji-title" className="mt-1.5 font-serif text-2xl font-bold leading-tight text-[#5b3a1d]">
              {t.title}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-amber-200/70 bg-white/50 p-2 text-amber-800/70 backdrop-blur-sm transition hover:bg-amber-100/80 hover:text-amber-900" aria-label={t.close}>
            <X size={18} />
          </button>
        </div>

        <div className="relative mt-5 h-72 overflow-hidden rounded-2xl">
          <div className="tudung-scene absolute inset-0" />
          <div className="absolute -left-7 bottom-0 h-24 w-24 rounded-full bg-[#4a2a12]/70 blur-[5px]" />
          <div className="absolute -right-8 bottom-3 h-28 w-28 rounded-2xl bg-[#3d200c]/60 blur-[6px]" />
          <div className="absolute left-1/4 top-0 h-20 w-44 -rotate-12 bg-gradient-to-b from-[#ffd98c]/25 to-transparent blur-md" />
          <div className="absolute bottom-2 left-3 text-xl opacity-30">🌿</div>
          <div className="absolute bottom-3 right-4 text-lg opacity-25">🫖</div>

          {showSuspense && (
            <>
              <div className="tudung-glow absolute bottom-[4.5rem] left-1/2 h-48 w-72 -translate-x-1/2" />
              {SPARKLES.map((sparkle) => (
                <span
                  key={`${sparkle.left}-${sparkle.delay}`}
                  className={`sparkle-particle absolute ${sparkle.size}`}
                  style={{ left: sparkle.left, bottom: sparkle.bottom, animationDelay: sparkle.delay }}
                >
                  ✨
                </span>
              ))}
              {VAPORS.map((vapor) => (
                <span key={`wisp-${vapor.left}`}>
                  <span
                    className="vapor-wisp absolute bottom-14 h-8 w-8"
                    style={{ left: vapor.left, animationDelay: vapor.delay }}
                  />
                  <span
                    className="vapor-particle absolute bottom-[4.6rem] text-xs text-amber-100/50"
                    style={{ left: vapor.left, animationDelay: vapor.delay }}
                  >
                    ♨️
                  </span>
                </span>
              ))}
            </>
          )}

          {hasRecipe && (
            <div onTransitionEnd={(event) => event.propertyName === "opacity" && finishReroll()} className={`absolute bottom-[4.7rem] left-1/2 z-[5] flex w-[88%] max-w-[280px] -translate-x-1/2 flex-col items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-50/95 px-4 py-3 text-center shadow-md backdrop-blur-xs transition-all duration-700 ${isCoverLifted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
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

          <div className="absolute bottom-6 left-1/2 z-[3] h-14 w-64 -translate-x-1/2 rounded-[50%]">
            <div className="tudung-plate absolute inset-0 rounded-[50%]" />
          </div>

          <div className={`absolute bottom-[3.6rem] left-1/2 z-10 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCoverLifted ? "-translate-y-40 scale-105 opacity-0" : ""}`}>
            <div className="tudung-dome h-36 w-52">
              <div className="tudung-knob absolute -top-4 left-1/2 h-7 w-14 -translate-x-1/2 rounded-full" />
              <div className="absolute bottom-2.5 left-1/2 h-2 w-32 -translate-x-1/2 rounded-full bg-[#ffe1a6]/50 blur-[2px]" />
            </div>
          </div>

          {showSuspense && (
            <div className="absolute bottom-1.5 left-1/2 z-10 -translate-x-1/2">
              <div className="bg-amber-600 text-white text-xs font-semibold px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{t.ready}</span>
              </div>
            </div>
          )}
        </div>

        {!hasRecipe && <p className="mt-4 text-center text-sm text-amber-900/60">{t.noRecipes}</p>}

        {isCoverLifted ? (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button type="button" onClick={openRecipe} className="rounded-xl bg-gradient-to-r from-[#d9973b] to-[#b06a24] px-6 py-3 font-semibold text-white shadow-[0_8px_20px_rgba(180,110,40,.4)] transition hover:brightness-110">{t.viewRecipe}</button>
            <button type="button" onClick={reroll} className="rounded-xl border border-amber-300/80 bg-amber-50/80 px-6 py-3 font-semibold text-amber-900 transition hover:bg-amber-100">{t.tryAgain}</button>
          </div>
        ) : (
          <button type="button" onClick={() => setIsCoverLifted(true)} disabled={!hasRecipe || isRerolling} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d9973b] to-[#b06a24] px-6 py-3 font-semibold text-white shadow-[0_8px_20px_rgba(180,110,40,.4)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{t.liftCover}</button>
        )}
      </section>
    </div>
  );
}
