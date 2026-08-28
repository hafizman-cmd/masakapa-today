import { ClipboardList, Heart, Refrigerator, Search } from 'lucide-react'
import { translations } from '../data/translations'

export default function BottomNav({ screen, onNavigate, setScreen, groceryCount = 0, lang = 'ms' }) {
  const navigate = onNavigate || setScreen
  const items = [
    { id: 'matcher', label: translations[lang].nav.matcher, icon: Refrigerator },
    { id: 'discover', label: translations[lang].nav.discover, icon: Search },
    { id: 'grocery', label: translations[lang].nav.grocery, icon: ClipboardList },
    { id: 'favorites', label: translations[lang].nav.favorites, icon: Heart },
  ]

  return <nav className="bottom-nav w-full bg-white py-2 flex justify-around items-center">{items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={screen === id ? 'nav-item active' : 'nav-item'}><span className="nav-icon"><Icon size={21} strokeWidth={screen === id ? 2.5 : 2} />{id === 'grocery' && groceryCount > 0 && <b className="nav-badge">{groceryCount > 99 ? '99+' : groceryCount}</b>}</span><span>{label}</span></button>)}</nav>
}
