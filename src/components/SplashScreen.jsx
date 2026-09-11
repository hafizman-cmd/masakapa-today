import { CookingPot } from "lucide-react";
import "./SplashScreen.css";

export default function SplashScreen({ isFadingOut = false }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-amber-50 splash-screen transition-opacity duration-300 ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      role="status"
      aria-live="polite"
      aria-label="Masak Apa Hari Ini sedang dimuatkan"
    >
      <div className="splash-art" aria-hidden="true">
        <span className="steam-particle steam-particle-one" />
        <span className="steam-particle steam-particle-two" />
        <span className="steam-particle steam-particle-three" />
        <CookingPot className="splash-pan" size={112} strokeWidth={1.5} />
      </div>
      <h1 className="font-serif text-2xl font-bold text-amber-950 splash-title">
        Masak Apa Hari Ini
      </h1>
      <div className="splash-loader" aria-label="Memuatkan">
        <span className="splash-loader-track">
          <span className="splash-loader-fill" />
        </span>
        <span className="splash-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
