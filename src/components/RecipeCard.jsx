import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Clock3, Heart, Sparkles, Utensils } from 'lucide-react'
import { text, translations } from '../data/translations'

const accents = { sunset: 'from-[#ff9f68] to-[#e85d3f]', lime: 'from-[#b5cc67] to-[#49734b]', coral: 'from-[#ee8069] to-[#a83242]', chilli: 'from-[#f27657] to-[#b92931]', gold: 'from-[#f2c15f] to-[#d77736]', yellow: 'from-[#f3d067] to-[#d89231]', orange: 'from-[#e8a45d] to-[#c65e33]', brown: 'from-[#b88865] to-[#754538]', honey: 'from-[#e8b55a] to-[#bd682f]', pepper: 'from-[#879d91] to-[#364f48]' }

export function AnimatedMatchBadge({ targetPercentage }) {
  const target = Math.max(0, Math.min(100, Number(targetPercentage) || 0))
  const [displayPercentage, setDisplayPercentage] = useState(target)
  const [isSparkling, setIsSparkling] = useState(false)
  const previousTargetRef = useRef(target)

  useEffect(() => {
    const start = previousTargetRef.current
    previousTargetRef.current = target
    if (start === target) return undefined

    const startedAt = performance.now()
    let frameId
    const animate = (now) => {
      const progress = Math.min((now - startedAt) / 300, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplayPercentage(Math.round(start + (target - start) * eased))
      if (progress < 1) frameId = window.requestAnimationFrame(animate)
    }
    frameId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frameId)
  }, [target])

  useEffect(() => {
    if (target !== 100) return undefined
    const startTimer = window.setTimeout(() => setIsSparkling(true), 0)
    const endTimer = window.setTimeout(() => setIsSparkling(false), 1000)
    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(endTimer)
    }
  }, [target])

  const badgeClass = target === 100
    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-bold shadow-md shadow-amber-300/50 ring-2 ring-yellow-300 transform-gpu animate-pulse-once'
    : target >= 70
      ? 'bg-emerald-100 text-emerald-800 font-semibold'
      : 'bg-amber-100/80 text-amber-900 font-medium'

  return (
    <span className={`relative inline-flex rounded-full px-2 py-1 text-[10px] ${badgeClass}`}>
      {isSparkling && target === 100 && (
        <>
          <Sparkles size={10} className="absolute -right-1 -top-2 animate-sparkle-float" />
          <Sparkles size={9} className="absolute -bottom-2 -left-1 animate-sparkle-float" />
        </>
      )}
      {displayPercentage}%
    </span>
  )
}

export default function RecipeCard({ recipe, match, isFavorite = false, onToggleFavorite, onClick, lang = 'ms' }) {
  const t = translations[lang]; const name = text(recipe.name, lang); const initials = name.split(' ').slice(0, 2).map(word => word[0]).join('')
  const optionalNote = match?.missingOptional?.length ? `${t.ui.missingLabel}: ${match.missingOptional.map(item => text(item.name, lang)).join(', ')}` : ''
  const percentage = match?.matchPercentage ?? 100

  return <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100 shadow-sm gap-3 hover:bg-stone-50 transition-colors text-left w-full" role="button" tabIndex="0" onClick={() => onClick(recipe, match?.missingCore)} onKeyDown={event => event.key === 'Enter' && onClick(recipe, match?.missingCore)}>
    <span className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br ${accents[recipe.accent] || accents.sunset}`}>{initials}</span>
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-stone-900 truncate">{name}</h3>
      <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5 whitespace-nowrap overflow-hidden">
        <span className="flex items-center gap-1 shrink-0"><Clock3 size={12} /> {recipe.time} {t.ui.minutes}</span>
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 font-medium ${recipe.difficulty.ms === 'Simple' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{text(recipe.difficulty, lang)}</span>
        <span className="flex items-center gap-1 truncate"><Utensils size={12} /> {recipe.equipment.map(item => text(item, lang)).join(' / ')}</span>
      </div>
      {optionalNote && <p className="text-[10px] text-stone-400 truncate mt-0.5">{optionalNote}</p>}
    </div>
    <div className="flex items-center gap-2 shrink-0">
       <AnimatedMatchBadge targetPercentage={percentage} />
       <button className={`card-heart ${isFavorite ? 'text-rose-500' : ''}`} onClick={event => { event.stopPropagation(); onToggleFavorite(recipe) }} aria-label={isFavorite ? t.ui.removeFavorite : t.ui.saveRecipe}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /></button>
      <ChevronRight size={16} className="text-stone-400" />
    </div>
  </div>
}
