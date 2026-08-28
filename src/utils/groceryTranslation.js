const ENGLISH_AMOUNT_REPLACEMENTS = [
  [/\bsudu besar\b/gi, 'tbsp'],
  [/\bsudu teh\b/gi, 'tsp'],
  [/\bcawan\b/gi, 'cup'],
  [/\bsecubit\b/gi, 'pinch'],
  [/\bsedikit\b/gi, 'to taste'],
  [/\b(?:biji|ulas|batang|helai|keping)\b/gi, ''],
]

export function translateGroceryAmount(amount, lang) {
  if (lang !== 'en' || typeof amount !== 'string') return amount
  return ENGLISH_AMOUNT_REPLACEMENTS.reduce(
    (translated, [pattern, replacement]) => translated.replace(pattern, replacement),
    amount,
  ).replace(/\s+/g, ' ').trim()
}

export function getGroceryIngredientName(item, ingredients, lang) {
  const ingredient = ingredients.find(option => option.id === item.ingredientId)
  if (!ingredient) return item.name
  const names = ingredient.name || {}
  return lang === 'en'
    ? ingredient.name_en || names.en || item.name
    : ingredient.name_ms || names.ms || item.name
}
