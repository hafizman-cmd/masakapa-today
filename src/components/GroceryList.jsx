import { useEffect, useRef, useState } from 'react'
import { ArrowLeftRight, Check, Leaf, MessageCircle, MessageSquarePlus, Shield } from 'lucide-react'
import { decodeGrocery, parseGroceryText } from '../utils/groceryShare'
import { getGroceryIngredientName, translateGroceryAmount } from '../utils/groceryTranslation'
import { text, translations } from '../data/translations'
import { decodeCompactGrocery, shareGroceryToWhatsApp } from '../utils/whatsappShare'

export default function GroceryList({ groceryList = [], ingredients = [], onToggleItem, onClearChecked, onClearAll, onMergeItems, lang, onToggleLanguage, onOpenAdmin, onOpenFeedback }) {
  const t = translations[lang]
  const [showShare, setShowShare] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const toastTimerRef = useRef(null)
  const validList = (groceryList || []).filter(Boolean)
  const unchecked = validList.filter(item => !item.checked)

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), [])

  const showToast = message => {
    setToast(message)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 2400)
  }

  const shareToWhatsApp = () => {
    if (!unchecked.length) {
      showToast(t.ui.shareEmpty)
      return
    }
    shareGroceryToWhatsApp(unchecked, lang)
  }

  const importItems = () => {
    if (!importCode.trim()) {
      setError(t.ui.pasteGroceryCode)
      return
    }
    if (typeof onMergeItems !== 'function') {
      setError(t.ui.invalidImportDetail)
      return
    }
    try {
      let items
      try {
        items = decodeGrocery(importCode)
      } catch {
        try {
          items = decodeCompactGrocery(importCode)
        } catch {
          items = parseGroceryText(importCode)
        }
      }
      onMergeItems(items)
      setImportCode('')
      setError('')
      setShowShare(false)
    } catch {
      setError(t.ui.invalidImportDetail)
    }
  }

  return (
    <div className="screen">
      <div className="shrink-0">
        <header className="page-header">
          <div className="header-mark">
            <Leaf size={15} fill="currentColor" />
            <span>{t.ui.pantryMark}</span>
            <button className="language-toggle" onClick={onToggleLanguage} aria-label={lang === 'ms' ? 'Tukar ke English' : 'Switch to Bahasa Melayu'}>
              <b className={lang === 'ms' ? 'active' : ''}>BM</b><span>|</span><b className={lang === 'en' ? 'active' : ''}>EN</b>
            </button>
            {onOpenAdmin && <button type="button" onClick={onOpenAdmin} className="p-2 text-gray-400 hover:text-amber-600 rounded-full hover:bg-amber-50 transition-colors" title="Admin Dashboard" aria-label="Admin Dashboard"><Shield className="w-5 h-5" /></button>}
            <button type="button" onClick={() => onOpenFeedback()} className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all" title="Maklum Balas" aria-label="Maklum Balas">
              <MessageSquarePlus size={17} />
            </button>
          </div>
          <h1>{t.headers.grocery[0]}</h1>
          <p>{t.headers.grocery[1]}</p>
        </header>
      </div>
      <main className="content grocery-content">
        <div className="mt-2 mb-4 w-full max-w-full">
          <span className="block min-w-0 truncate text-xs font-medium text-gray-500">
            {unchecked.length} {t.ui.groceryCount}
          </span>
          <div className="my-3 grid w-full max-w-full grid-cols-2 gap-2">
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="flex min-w-0 w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50 px-2.5 py-2.5 text-xs font-semibold text-emerald-800 shadow-xs transition-all hover:bg-emerald-100 active:scale-95 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="truncate">{t.ui.shareWhatsApp}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="flex min-w-0 w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-2.5 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 sm:text-sm"
            >
              <ArrowLeftRight className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="truncate">{t.ui.importTitle}</span>
            </button>
          </div>
          {validList.some(item => item.checked) && (
            <button
              type="button"
              onClick={onClearChecked}
              className="ml-auto block rounded-xl px-3 py-2 text-xs font-semibold text-[#d6573a] transition-colors hover:bg-red-50 active:scale-95"
            >
              {t.ui.clearChecked}
            </button>
          )}
        </div>
        {validList.length ? (
          <>
            <div className="grocery-items">
              {validList.map(item => <button key={item.id} className={item.checked ? 'grocery-item checked' : 'grocery-item'} onClick={() => onToggleItem(item.id)}><span className="check-box">{item.checked && <Check size={14} />}</span><span><strong>{getGroceryIngredientName(item, ingredients, lang)}</strong><small>{translateGroceryAmount(item.amount, lang)} | {text(item.recipeTitle || item.recipeName, lang)}</small></span></button>)}
            </div>
            <button className="clear-all-button" onClick={onClearAll}>{t.ui.clearAll}</button>
          </>
        ) : <div className="empty-state"><span className="empty-list-icon"><Check size={22} /></span><p>{t.ui.emptyGrocery}</p><span>{t.ui.emptyGroceryHint}</span></div>}
         {showShare && <div className="fixed inset-0 z-30 flex items-center justify-center bg-stone-900/30 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><h2 className="text-lg font-semibold">{t.ui.importTitle}</h2><div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{t.ui.importGuide}</div>{error && <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn"><span>{error}</span><button onClick={() => setError('')} className="ml-2 font-bold hover:text-red-900">✕</button></div>}<textarea value={importCode} onChange={event => { setImportCode(event.target.value); setError('') }} className="mt-3 min-h-32 w-full rounded-xl border border-stone-200 p-3" placeholder={t.ui.pasteCode} /><div className="mt-3 flex justify-end gap-2"><button className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 font-medium text-sm transition-all" onClick={() => { setError(''); setShowShare(false) }}>{t.ui.cancel}</button><button className="px-5 py-2.5 rounded-xl bg-[#E05A47] text-white font-medium text-sm shadow-sm hover:bg-[#c84e3c] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#E05A47] transition-all" disabled={!importCode.trim()} onClick={importItems}>{t.ui.importList}</button></div></div></div>}
        {toast && <div className="pointer-events-none fixed md:absolute bottom-24 left-1/2 z-40 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-stone-800/90 px-4 py-2 text-center text-xs font-semibold text-white shadow-lg animate-fadeIn">{toast}</div>}
      </main>
    </div>
  )
}
