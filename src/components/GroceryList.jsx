import { useState } from 'react'
import { Check, Leaf } from 'lucide-react'
import { decodeGrocery, encodeGrocery, formatGrocery } from '../utils/groceryShare'
import { getGroceryIngredientName, translateGroceryAmount } from '../utils/groceryTranslation'
import { text, translations } from '../data/translations'

export default function GroceryList({ groceryList, ingredients, onToggleItem, onClearChecked, onClearAll, onMergeItems, lang, onToggleLanguage }) {
  const t = translations[lang]
  const [showShare, setShowShare] = useState(false)
  const [importCode, setImportCode] = useState('')
  const unchecked = groceryList.filter(item => !item.checked)
  const code = encodeGrocery(unchecked)
  const shareText = `${formatGrocery(unchecked, lang)}\n${window.location.origin}/?import_grocery=${encodeURIComponent(code)}`
  const importItems = () => {
    try {
      onMergeItems(decodeGrocery(importCode))
      setImportCode('')
      setShowShare(false)
    } catch {
      window.alert(lang === 'ms' ? 'Kod import tidak sah.' : 'Invalid import code.')
    }
  }

  return <div className="screen"><div className="shrink-0"><header className="page-header"><div className="header-mark"><Leaf size={15} fill="currentColor" /><span>{translations[lang].ui.pantryMark}</span><button className="language-toggle" onClick={onToggleLanguage} aria-label={lang === 'ms' ? 'Tukar ke English' : 'Switch to Bahasa Melayu'}><b className={lang === 'ms' ? 'active' : ''}>BM</b><span>|</span><b className={lang === 'en' ? 'active' : ''}>EN</b></button></div><h1>{t.headers.grocery[0]}</h1><p>{t.headers.grocery[1]}</p></header></div><main className="content grocery-content"><div className="grocery-toolbar"><span>{unchecked.length} {t.ui.groceryCount}</span><div className="flex items-center gap-3"><button onClick={() => navigator.share?.({ title: 'Senarai Pasar', text: shareText })}>{lang === 'ms' ? 'Kongsi ke WhatsApp' : 'Share to WhatsApp'}</button><button onClick={() => setShowShare(true)}>{lang === 'ms' ? 'Eksport / Import' : 'Export / Import'}</button>{groceryList.some(item => item.checked) && <button onClick={onClearChecked}>{t.ui.clearChecked}</button>}</div></div>{groceryList.length ? <><div className="grocery-items">{groceryList.map(item => <button key={item.id} className={item.checked ? 'grocery-item checked' : 'grocery-item'} onClick={() => onToggleItem(item.id)}><span className="check-box">{item.checked && <Check size={14} />}</span><span><strong>{getGroceryIngredientName(item, ingredients, lang)}</strong><small>{translateGroceryAmount(item.amount, lang)} | {text(item.recipeTitle, lang)}</small></span></button>)}</div><button className="clear-all-button" onClick={onClearAll}>{t.ui.clearAll}</button></> : <div className="empty-state"><span className="empty-list-icon"><Check size={22} /></span><p>{t.ui.emptyGrocery}</p><span>{t.ui.emptyGroceryHint}</span></div>}{showShare && <div className="fixed inset-0 z-30 flex items-center justify-center bg-stone-900/30 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><h2 className="text-lg font-bold text-stone-800">Eksport / Import</h2><textarea readOnly value={code} className="mt-2 h-24 w-full rounded-lg border border-stone-200 p-2 text-[10px]" onFocus={event => event.target.select()} /><textarea value={importCode} onChange={event => setImportCode(event.target.value)} className="mt-2 h-24 w-full rounded-lg border border-stone-200 p-2 text-[10px]" placeholder="Paste code here" /><div className="mt-3 flex justify-end gap-2"><button onClick={() => setShowShare(false)}>Cancel</button><button className="rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white" onClick={importItems}>Import</button></div></div></div>}</main></div>
}
