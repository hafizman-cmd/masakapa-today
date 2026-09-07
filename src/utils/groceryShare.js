export function encodeGrocery(items) {
  const json = JSON.stringify(items)
  return btoa(unescape(encodeURIComponent(json)))
}

export function decodeGrocery(code) {
  const json = decodeURIComponent(escape(atob(code.trim())))
  const items = JSON.parse(json)
  return Array.isArray(items) ? items : []
}

export function formatGrocery(items, language = 'ms') {
  const lines = items.map(item => {
    const itemName = typeof item.name === 'object' ? (item.name[language] || item.name.ms) : (item.name || item.ingredientId)
    const recipeTitle = typeof item.recipeTitle === 'object' ? (item.recipeTitle[language] || item.recipeTitle.ms) : (item.recipeTitle || '')
    return `[ ] ${itemName} (${item.amount}) — ${recipeTitle}`
  })
  const guide = language === 'en'
    ? ['🛒 *Grocery List — WHAT TO COOK TODAY*', '💡 *HOW TO IMPORT THIS LIST:*', '1. Tap the link below for automatic import:', "2. OR copy the code above, open the app -> Grocery List -> tap 'Export/Import' & paste the code."]
    : ['🛒 *Senarai Pasar — MASAK APA HARI INI*', '💡 *CARA IMPORT SENARAI INI:*', '1. Tekan pautan di bawah untuk import automatik:', "2. ATAU salin kod di atas, buka aplikasi -> Senarai Pasar -> tekan butang 'Eksport/Import' dan tampal kod tersebut."]
  return `${guide[0]}\n\n${lines.join('\n')}\n\n----------------------------------\n${guide[1]}\n${guide[2]}`
}

export function readUrlGrocery(fallback) {
  const code = new URLSearchParams(window.location.search).get('import_grocery')
  if (!code) return fallback
  try {
    const imported = decodeGrocery(code)
    const isEnglish = window.localStorage.getItem('masakapa-language') === '"en"'
    const message = window.confirm(isEnglish
      ? `Accept Grocery List?\n\nImport shared grocery list with ${imported.length} items?`
      : `Terima Senarai Pasar?\n\nImport senarai pasar yang dikongsi dengan ${imported.length} barang?`)
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`)
    if (!message) return fallback
    const existing = Array.isArray(fallback) ? fallback : []
    const ids = new Set(existing.map(item => item.id))
    return [...existing, ...imported.filter(item => item && !ids.has(item.id))]
  } catch {
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`)
    return fallback
  }
}
