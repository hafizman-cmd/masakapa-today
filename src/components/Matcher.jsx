const FISH_INGREDIENT_IDS = new Set([
  'fish', 'ikan-merah', 'siakap', 'ikan-siakap', 'ikan-kerapu', 'ikan-jenahak',
  'ikan-bawal', 'ikan-tongkol', 'ikan-senangin', 'ikan-haruan', 'ikan-terubuk',
  'mackerel', 'cencaru', 'tilapia', 'stingray', 'patin', 'catfish',
  'spanish-mackerel', 'ikan-tenggiri', 'salted-fish', 'anchovy',
])

export function isFishIngredient(id) {
  return FISH_INGREDIENT_IDS.has(id)
}

export function matchesIngredient(id, availableIds) {
  return availableIds.has(id) || (isFishIngredient(id) && [...availableIds].some(isFishIngredient))
}

export function activeName(item, language) {
  if (language === 'en' && item.name_en) return item.name_en
  if (language !== 'en' && item.name_ms) return item.name_ms
  const value = item.name ?? item
  if (typeof value === 'object') return value[language] || value.ms || value.en || ''
  return language === 'en' ? item.name_en || value : item.name_ms || value
}

export function sortByActiveName(items, language) {
  return [...items].sort((a, b) =>
    activeName(a, language).localeCompare(activeName(b, language), language),
  )
}
