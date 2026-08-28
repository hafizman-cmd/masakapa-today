import { useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Clock3, CookingPot, Flame, Heart, Plus, Soup, Sparkles, Utensils } from 'lucide-react'
import { text, translations } from '../data/translations'
import { scaleIngredientAmount } from '../utils/portion'

const accents = { sunset: 'from-[#ff9f68] to-[#e85d3f]', lime: 'from-[#b5cc67] to-[#49734b]', coral: 'from-[#ee8069] to-[#a83242]', chilli: 'from-[#f27657] to-[#b92931]', gold: 'from-[#f2c15f] to-[#d77736]', yellow: 'from-[#f3d067] to-[#d89231]', orange: 'from-[#e8a45d] to-[#c65e33]', brown: 'from-[#b88865] to-[#754538]', honey: 'from-[#e8b55a] to-[#bd682f]', pepper: 'from-[#879d91] to-[#364f48]' }

function HeroIcon({ recipe }) {
  const searchable = `${text(recipe.name, 'ms')} ${text(recipe.style, 'ms')}`.toLowerCase()
  if (searchable.includes('sup') || searchable.includes('soto') || searchable.includes('laksa')) return <Soup size={46} strokeWidth={1.8} />
  if (searchable.includes('ayam') || searchable.includes('daging') || searchable.includes('kambing')) return <CookingPot size={46} strokeWidth={1.8} />
  if (searchable.includes('sambal') || searchable.includes('cili') || searchable.includes('kari')) return <Flame size={46} strokeWidth={1.8} />
  return <Utensils size={46} strokeWidth={1.8} />
}

export function MissingIngredients({ ingredients, onAddMissing, servingCount, lang }) {
  if (!ingredients.length) return null
  return <button className="grocery-add-button detail-grocery-add" onClick={() => onAddMissing(ingredients, servingCount)}><Plus size={14} /> {translations[lang].ui.addToGrocery}</button>
}

export function PairingSection({ pairings, onOpenRecipe, lang }) {
  const t = translations[lang]
  if (!pairings.length) return null
  return <section className="pairings-section md:col-span-2"><div className="section-heading"><div><span className="section-kicker">{t.ui.pairings}</span><h2>{t.ui.completeMeal}</h2></div><span className="sort-label">{pairings.length} {t.ui.pairingsCount}</span></div><p className="pairings-copy">{t.ui.pairingHint}</p><div className="pairings-row">{pairings.map(pairing => <button className="pairing-card" key={pairing.id} onClick={() => onOpenRecipe(pairing)}><div className={`pairing-art bg-gradient-to-br ${accents[pairing.accent] || accents.sunset}`}><span>{text(pairing.name, lang).split(' ').slice(0, 2).map(word => word[0]).join('')}</span></div><div><strong>{text(pairing.name, lang)}</strong><small><Clock3 size={12} /> {pairing.time} min</small></div><ChevronRight size={16} /></button>)}</div></section>
}

export default function RecipeDetail({ recipe, recipes, onBack, isFavorite, onToggleFavorite, onOpenRecipe, onAddMissing, lang = 'ms', onToggleLanguage }) {
  const t = translations[lang]
  const [checked, setChecked] = useState([])
  const [selectedServings, setSelectedServings] = useState(recipe.defaultServings)
  const name = text(recipe.name, lang)
  const toggle = id => setChecked(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id])
  const pairings = (recipe.pairings || []).map(id => recipes.find(item => item.id === id)).filter(Boolean)
  const missingCore = recipe.missingCore ?? recipe.ingredients.filter(item => !item.staple && !item.optional)
  return <div className="screen detail-screen">
    <div className={`detail-hero hero-${recipe.accent}`}>
      {recipe.image ? <img className="absolute inset-0 h-full w-full object-cover" src={recipe.image} alt={name} /> : <div className="absolute inset-0 flex items-center justify-center"><div className="rounded-full bg-white/20 p-4 shadow-lg backdrop-blur-md"><HeroIcon recipe={recipe} /></div></div>}
      <button className="detail-back" onClick={onBack} aria-label={lang === 'ms' ? 'Kembali' : 'Back'}><ArrowLeft size={20} /></button>
      {onToggleLanguage && <button className="language-toggle detail-language-toggle" onClick={onToggleLanguage}><b className={lang === 'ms' ? 'active' : ''}>BM</b><span>|</span><b className={lang === 'en' ? 'active' : ''}>EN</b></button>}
      <button className="like-button" onClick={() => onToggleFavorite(recipe.id)} aria-label={isFavorite ? t.ui.removeFavorite : t.ui.saveRecipe}><Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} /></button>
      <div className="hero-caption"><span>{text(recipe.style, lang)}</span><h1>{name}</h1></div>
    </div>
    <main className="content detail-content grid md:grid-cols-2 gap-6">
      <div className="detail-meta md:col-span-2"><span><Clock3 size={16} /> {recipe.time} min</span><span><Flame size={16} /> {text(recipe.difficulty, lang)}</span><span>{selectedServings} {t.ui.servings}</span></div>
      <section className="detail-section"><div className="section-heading"><div><span className="section-kicker">{t.ui.needed}</span><h2>{t.ui.ingredients}</h2></div><span className="progress">{checked.length}/{recipe.ingredients.length}</span></div><div className="portion-bar"><span>{t.ui.portion}</span><div>{t.ui.pax.map((label, index) => { const count = [1, 2, 4][index]; return <button key={count} onClick={() => setSelectedServings(count)} className={selectedServings === count ? 'portion-button active' : 'portion-button'}>{label}</button> })}</div></div><div className="checklist">{recipe.ingredients.map((item, index) => <button key={`${item.id}-${index}`} onClick={() => toggle(index)} className={checked.includes(index) ? 'check-row checked' : 'check-row'}><span className="check-box">{checked.includes(index) && <Check size={14} />}</span><span>{text(item.name, lang)}</span><small>{scaleIngredientAmount(item.amount, recipe.defaultServings, selectedServings)}</small></button>)}</div><MissingIngredients ingredients={missingCore} servingCount={selectedServings} onAddMissing={(ingredients, servings) => onAddMissing(recipe, ingredients, servings)} lang={lang} /></section>
      <section className="detail-section"><h2>{lang === 'ms' ? 'Cara memasak' : 'Instructions'}</h2><ol className="mt-5 space-y-4">{recipe.steps.map((step, index) => <li className="flex items-start gap-3" key={index}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E05A47] text-xs font-bold text-white">{index + 1}</span><span className="pt-1 text-sm leading-6 text-stone-700">{text(step, lang)}</span></li>)}</ol><div className="mt-6 flex items-start space-x-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><Sparkles size={18} className="mt-0.5 shrink-0" /><div><h3 className="text-sm font-bold">{lang === 'ms' ? 'Petua Chef' : 'Chef Tip'}</h3><p className="mt-1 text-sm leading-6">{text(recipe.tip, lang)}</p></div></div></section>
      <PairingSection pairings={pairings} onOpenRecipe={onOpenRecipe} lang={lang} />
    </main>
  </div>
}
