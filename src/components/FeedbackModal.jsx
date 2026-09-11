import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Send, X } from "lucide-react";
import { supabase } from "../lib/supabase";

const CATEGORIES = [
  { id: "missing_ingredient", labelMs: "Bahan Tak Cukup", labelEn: "Missing Ingredient", icon: "🥬" },
  { id: "recipe_issue", labelMs: "Langkah / Resipi Salah", labelEn: "Recipe Issue", icon: "📖" },
  { id: "app_bug", labelMs: "Aplikasi Bug", labelEn: "App Bug", icon: "🐛" },
  { id: "suggestion", labelMs: "Cadangan Baru", labelEn: "Suggestion", icon: "💡" },
];

const PRESETS = {
  missing_ingredient: {
    ms: ["Bahan penting tiada dalam senarai peti", "Nama bahan mengelirukan", "Kumpulan kategori salah"],
    en: ["Important ingredient missing from fridge list", "Confusing ingredient name", "Wrong category grouping"],
  },
  recipe_issue: {
    ms: ["Sukatan bahan tidak tepat", "Langkah memasak terpotong / konfius", "Masa memasak tidak tepat"],
    en: ["Incorrect ingredient amounts", "Confusing / cut-off cooking step", "Inaccurate cooking time"],
  },
  app_bug: {
    ms: ["Aplikasi perlahan atau tergendala", "Paparan skrin bertindih", "Butang tidak berfungsi"],
    en: ["App runs slow or freezes", "Screen layout overlapping", "Buttons not responding"],
  },
  suggestion: {
    ms: ["Cadangan resipi baru", "Cadangan fungsi baru", "Penambahbaikan paparan"],
    en: ["Request a new recipe", "Request a new feature", "General UI/UX improvement"],
  },
};

export default function FeedbackModal({
  isOpen,
  onClose,
  initialRecipeId,
  recipeTitle,
  language,
}) {
  const activeLang = language === "en" ? "en" : "ms";
  const [selectedCategory, setSelectedCategory] = useState("missing_ingredient");
  const [selectedPresets, setSelectedPresets] = useState([]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("idle");
  const closeTimerRef = useRef(null);
  const requestControllerRef = useRef(null);
  const mountedRef = useRef(true);
  const currentPresets = PRESETS[selectedCategory]?.[activeLang] || [];

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      window.clearTimeout(closeTimerRef.current);
      requestControllerRef.current?.abort();
    };
  }, []);

  if (!isOpen) return null;

  const togglePreset = (preset) => {
    setSelectedPresets((selected) =>
      selected.includes(preset)
        ? selected.filter((item) => item !== preset)
        : [...selected, preset],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    const controller = new AbortController();
    requestControllerRef.current = controller;
    try {
      if (supabase) {
        const { error } = await supabase.from("feedbacks").insert([
          {
            type: selectedCategory,
            recipe_id: initialRecipeId || null,
            issue_template: selectedPresets,
            description: description || "",
            user_language: activeLang,
            contact: contact || "",
            status: "new",
          },
        ]).abortSignal(controller.signal);
        if (error) throw error;
      }
       if (!mountedRef.current) return;
       setStatus("success");
       closeTimerRef.current = window.setTimeout(onClose, 1500);
    } catch (error) {
      console.error("Feedback submit error:", error);
      if (mountedRef.current && error?.name !== "AbortError") setStatus("error");
    } finally {
      if (requestControllerRef.current === controller) requestControllerRef.current = null;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-stone-900/35 p-3 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fffdf9] p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="section-kicker">{activeLang === "en" ? "FEEDBACK" : "MAKLUM BALAS"}</span>
            <h2 id="feedback-title" className="mt-1 text-2xl font-bold text-stone-800">
              {activeLang === "en" ? "Help us make it better" : "Bantu kami tingkatkan aplikasi"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label={activeLang === "en" ? "Close" : "Tutup"} className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        {(recipeTitle || initialRecipeId) && (
          <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            {activeLang === "en" ? "Reporting for" : "Melaporkan untuk"}: {recipeTitle || initialRecipeId}
          </div>
        )}

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center text-green-800">
            <CheckCircle2 size={44} />
            <p className="font-semibold">
              {activeLang === "en" ? "Thank you! Your feedback has been submitted" : "Terima Kasih! Maklum balas anda telah dihantar"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <fieldset>
              <legend className="text-sm font-bold text-stone-700">
                {activeLang === "en" ? "1. What would you like to report?" : "1. Apakah yang ingin anda laporkan?"}
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedPresets([]);
                    }}
                    className={`rounded-xl border px-3 py-3 text-left text-xs font-semibold transition ${selectedCategory === category.id ? "border-amber-500 bg-amber-50 text-amber-900" : "border-stone-200 bg-white text-stone-600 hover:border-amber-300"}`}
                  >
                    <span className="mr-1.5">{category.icon}</span>
                    {activeLang === "en" ? category.labelEn : category.labelMs}
                  </button>
                ))}
              </div>
            </fieldset>

            {Array.isArray(currentPresets) && currentPresets.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-gray-700">
                  {activeLang === "en" ? "2. Select what applies" : "2. Pilih yang berkenaan"}
                </p>
                {currentPresets.map((preset) => (
                   <label key={`${selectedCategory}-${preset}`} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100">
                    <input type="checkbox" checked={selectedPresets.includes(preset)} onChange={() => togglePreset(preset)} className="rounded text-amber-600 focus:ring-amber-500" />
                    <span>{preset}</span>
                  </label>
                ))}
              </div>
            )}

            <div>
              <label htmlFor="feedback-description" className="text-sm font-bold text-stone-700">
                {activeLang === "en" ? "3. Extra notes (optional)" : "3. Nota tambahan (pilihan)"}
              </label>
              <textarea id="feedback-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={activeLang === "en" ? "Tell us what happened..." : "Terangkan apa yang berlaku..."} rows={4} className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white p-3 text-sm outline-none transition focus:border-amber-400" />
            </div>
            <div>
              <label htmlFor="feedback-contact" className="text-sm font-bold text-stone-700">
                {activeLang === "en" ? "Email or WhatsApp number (optional)" : "E-mel atau nombor WhatsApp (pilihan)"}
              </label>
              <input id="feedback-contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder={activeLang === "en" ? "Email or WhatsApp number (optional)" : "E-mel atau nombor WhatsApp (pilihan)"} className="mt-2 w-full rounded-xl border border-stone-200 bg-white p-3 text-sm outline-none transition focus:border-amber-400" />
            </div>
            {status === "error" && <p className="text-xs font-semibold text-red-600">{activeLang === "en" ? "Feedback could not be sent. Please try again." : "Maklum balas tidak dapat dihantar. Sila cuba lagi."}</p>}
            <button type="submit" disabled={status === "submitting"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d6573a] py-3 text-sm font-bold text-white transition hover:bg-[#c84e3c] disabled:cursor-not-allowed disabled:opacity-50">
              <Send size={17} />
              {status === "submitting" ? (activeLang === "en" ? "Sending..." : "Menghantar...") : activeLang === "en" ? "Send Feedback" : "Hantar Maklum Balas"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
