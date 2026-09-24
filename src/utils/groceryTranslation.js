import { translateUnit } from './translateUnit'

export function translateGroceryAmount(amount, lang) {
  return translateUnit(amount, lang)
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
