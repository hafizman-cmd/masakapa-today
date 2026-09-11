import { useEffect, useState } from "react";
import { SlidersHorizontal, Sparkles, Utensils, X } from "lucide-react";
import "./OnboardingModal.css";

const getSlides = (language) => [
  {
    icon: Utensils,
    title: language === "en" ? "Select Your Ingredients" : "Pilih Bahan Kamu",
    body:
      language === "en"
        ? "Pick items available in your kitchen, and we will find matching dishes."
        : "Tandakan bahan yang ada di dapur, kami carikan resipi yang padu.",
  },
  {
    icon: SlidersHorizontal,
    title: language === "en" ? "Express Filters" : "Penapis Ekspres",
    body:
      language === "en"
        ? "Quickly filter recipes by Air Fryer, Under 20 Mins, or Kid-Friendly meals."
        : "Tapis mengikut Air Fryer, Bawah 20 Minit, atau kegemaran sekeluarga.",
  },
  {
    icon: Sparkles,
    title: "Angkat Tudung Saji",
    body:
      language === "en"
        ? "Not sure what to cook? Tap the Tudung Saji cover for a mystery dish reveal!"
        : "Bingung nak masak apa? Tekan tudung saji untuk kejutan resipi harian.",
  },
];

export default function OnboardingModal({
  language = "ms",
  forceOpen = false,
  onClose,
}) {
  const [hasSeen, setHasSeen] = useState(() => {
    try {
      return window.localStorage.getItem("mahi_onboarding_seen") !== null;
    } catch {
      return false;
    }
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = getSlides(language);
  const isOpen = forceOpen || !hasSeen;

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen, language]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  const dismissOnboarding = () => {
    try {
      window.localStorage.setItem("mahi_onboarding_seen", "true");
    } catch {
      // Continue without persistence if storage is unavailable.
    }
    setHasSeen(true);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={
          language === "en" ? "Getting started guide" : "Panduan mula memasak"
      }
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/70 bg-[#fffdf8] p-6 text-center shadow-2xl shadow-stone-900/20 sm:p-8">
        <button
          type="button"
          onClick={dismissOnboarding}
          aria-label={language === "en" ? "Close guide" : "Tutup panduan"}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <X size={18} />
        </button>

        <div key={currentSlide} className="onboarding-slide pt-5">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 shadow-inner shadow-amber-200/60">
            <Icon size={40} strokeWidth={1.8} />
          </div>
          <h2 className="mt-6 font-serif text-2xl font-bold tracking-tight text-amber-950">
            {slide.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-stone-500">
            {slide.body}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={
                language === "en"
                  ? `Go to step ${index + 1}`
                  : `Pergi ke langkah ${index + 1}`
              }
              aria-current={currentSlide === index ? "step" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-6 bg-amber-500" : "w-2 bg-amber-200 hover:bg-amber-300"}`}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={dismissOnboarding}
            className="rounded-2xl px-4 py-3.5 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
          >
            {language === "en" ? "Got it" : "Faham"}
          </button>
          <button
            type="button"
            onClick={() =>
              isLastSlide
                ? dismissOnboarding()
                : setCurrentSlide((index) => index + 1)
            }
            className="flex-1 rounded-2xl bg-amber-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-[0.98]"
          >
            {language === "en"
              ? isLastSlide
                ? "Start Cooking! 🚀"
                : "Next"
              : isLastSlide
                ? "Mula Masak! 🚀"
                : "Seterusnya"}
          </button>
        </div>
      </div>
    </div>
  );
}
