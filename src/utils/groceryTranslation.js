const ENGLISH_AMOUNT_REPLACEMENTS = [
  [/\bsudu besar\b/gi, 'tbsp'],
  [/\bsudu teh\b/gi, 'tsp'],
  [/\bcawan\b/gi, 'cup'],
  [/\bsecubit\b/gi, 'pinch'],
  [/\bsedikit\b/gi, 'to taste'],
  [/\b(?:biji|ulas|batang|helai|keping)\b/gi, ''],
]

export function translateGroceryAmount(amount, lang) {
  const amountText = String(amount || '')
  if (lang !== 'en') return amountText
  return ENGLISH_AMOUNT_REPLACEMENTS.reduce(
    (translated, [pattern, replacement]) => translated?.replace(pattern, replacement),
    amountText,
  ).replace(/\s+/g, ' ').trim()
}

export function getGroceryIngredientName(item, ingredients = [], lang) {
  const matchedIng = Array.isArray(ingredients)
    ? ingredients.find(ing => ing?.id === item?.ingredientId)
    : null
  const itemName = typeof item?.name === 'object'
    ? (item.name?.[lang] || item.name?.ms || '')
    : String(item?.name || item?.ingredientId || 'Unknown')
  if (!matchedIng) return itemName
  const names = matchedIng.name || {}
  return lang === 'en'
    ? matchedIng.name_en || names.en || itemName
    : matchedIng.name_ms || names.ms || itemName
}
