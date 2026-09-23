import { supabase } from "../lib/supabase";

const VISITOR_ID_KEY = "masakapa-visitor-id";

function getVisitorId() {
  try {
    const stored = window.localStorage.getItem(VISITOR_ID_KEY);
    if (stored) return stored;

    const visitorId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch {
    return null;
  }
}

function getDeviceContext() {
  const userAgent = navigator.userAgent || "";
  const isIos =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) || isIos;
  const isPwa = window.matchMedia?.("(display-mode: standalone)").matches === true;

  let os = "Other";
  if (isIos) os = "iOS";
  else if (/Android/i.test(userAgent)) os = "Android";
  else if (/Macintosh|Mac OS X/i.test(userAgent)) os = "macOS";
  else if (/Windows/i.test(userAgent)) os = "Windows";

  let browser = "Other";
  if (/SamsungBrowser/i.test(userAgent)) browser = "Samsung Browser";
  else if (/Firefox|FxiOS/i.test(userAgent)) browser = "Firefox";
  else if (/CriOS|Chrome|Chromium/i.test(userAgent)) browser = "Chrome";
  else if (/Safari/i.test(userAgent)) browser = "Safari";

  return {
    device_type: isMobile ? "Mobile" : "Desktop",
    os,
    browser,
    is_pwa: isPwa,
  };
}

export async function logVisit() {
  try {
    if (!supabase || typeof window === "undefined" || typeof navigator === "undefined") return;
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const { error } = await supabase.from("app_analytics").insert({
      visitor_id: visitorId,
      ...getDeviceContext(),
    });
    if (error) throw error;
  } catch {
    // Analytics must never prevent the application from starting.
  }
}
