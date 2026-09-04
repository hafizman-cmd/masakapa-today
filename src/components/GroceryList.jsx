import { useState } from 'react'
import { Check, Leaf } from 'lucide-react'
import { decodeGrocery, encodeGrocery, formatGrocery } from '../utils/groceryShare'
import { getGroceryIngredientName, translateGroceryAmount } from '../utils/groceryTranslation'
import { text, translations } from '../data/translations'

export default function GroceryList({ groceryList = [], ingredients = [], onToggleItem, onClearChecked, onClearAll, onMergeItems, lang, onToggleLanguage }) {
  const t = translations[lang]
  const [showShare, setShowShare] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [error, setError] = useState('')
  const validList = (groceryList || []).filter(Boolean)
  const unchecked = validList.filter(item => !item.checked)
  const code = encodeGrocery(unchecked)
  const shareText = `${formatGrocery(unchecked, lang)}\n${window.location.origin}/?import_grocery=${encodeURIComponent(code)}`

  const importItems = () => {
    if (!importCode.trim()) {
      setError(lang === 'en' ? 'Please paste your grocery code into the box above.' : 'Sila tampal kod senarai pasar anda dalam ruang di atas.')
      return
    }
    try {
      onMergeItems(decodeGrocery(importCode))
      setImportCode('')
      setError('')
      setShowShare(false)
    } catch {
      setError(lang === 'en' ? "Oops! That code doesn't seem valid. Please make sure you copied the full message from WhatsApp." : 'Alamak! Kod tidak sah. Sila pastikan anda menyalin keseluruhan mesej dari WhatsApp.')
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
          </div>
          <h1>{t.headers.grocery[0]}</h1>
          <p>{t.headers.grocery[1]}</p>
        </header>
      </div>
      <main className="content grocery-content">
        <div className="grocery-toolbar">
          <span>{unchecked.length} {t.ui.groceryCount}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => navigator.share?.({ title: 'Senarai Pasar', text: shareText })}>{lang === 'ms' ? 'Kongsi ke WhatsApp' : 'Share to WhatsApp'}</button>
            <button onClick={() => setShowShare(true)}>{lang === 'ms' ? 'Eksport / Import' : 'Export / Import'}</button>
            {validList.some(item => item.checked) && <button onClick={onClearChecked}>{t.ui.clearChecked}</button>}
          </div>
        </div>
        {validList.length ? (
          <>
            <div className="grocery-items">
              {validList.map(item => <button key={item.id} className={item.checked ? 'grocery-item checked' : 'grocery-item'} onClick={() => onToggleItem(item.id)}><span className="check-box">{item.checked && <Check size={14} />}</span><span><strong>{getGroceryIngredientName(item, ingredients, lang)}</strong><small>{translateGroceryAmount(item.amount, lang)} | {text(item.recipeTitle || item.recipeName, lang)}</small></span></button>)}
            </div>
            <button className="clear-all-button" onClick={onClearAll}>{t.ui.clearAll}</button>
          </>
        ) : <div className="empty-state"><span className="empty-list-icon"><Check size={22} /></span><p>{t.ui.emptyGrocery}</p><span>{t.ui.emptyGroceryHint}</span></div>}
        {showShare && <div className="fixed inset-0 z-30 flex items-center justify-center bg-stone-900/30 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><h2 className="text-lg font-semibold">{lang === 'en' ? 'Export / Import' : 'Eksport / Import'}</h2><div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{lang === 'en' ? 'Import Tip: Paste the grocery list code copied from WhatsApp into the text area below, then tap Import.' : 'Petua Import: Tampal (paste) kod senarai pasar yang disalin dari WhatsApp ke dalam ruang di bawah, kemudian tekan Import Senarai.'}</div>{error && <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn"><span>{error}</span><button onClick={() => setError('')} className="ml-2 font-bold hover:text-red-900">✕</button></div>}<textarea value={importCode} onChange={event => { setImportCode(event.target.value); setError('') }} className="mt-3 min-h-32 w-full rounded-xl border border-stone-200 p-3" placeholder={lang === 'en' ? 'Paste code here...' : 'Tampal kod di sini...'} /><div className="mt-3 flex justify-end gap-2"><button className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 font-medium text-sm transition-all" onClick={() => { setError(''); setShowShare(false) }}>{lang === 'en' ? 'Cancel' : 'Batal'}</button><button className="px-5 py-2.5 rounded-xl bg-[#E05A47] text-white font-medium text-sm shadow-sm hover:bg-[#c84e3c] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#E05A47] transition-all" disabled={!importCode.trim()} onClick={importItems}>{lang === 'en' ? 'Import List' : 'Import Senarai'}</button></div></div></div>}
      </main>
    </div>
  )
}
