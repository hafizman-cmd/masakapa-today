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
