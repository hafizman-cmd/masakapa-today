export function encodeGrocery(items) {
  const json = JSON.stringify(items)
  return btoa(unescape(encodeURIComponent(json)))
}

export function decodeGrocery(code) {
  const json = decodeURIComponent(escape(atob(code.trim())))
  const items = JSON.parse(json)
  return Array.isArray(items) ? items : []
}

export function parseGroceryText(value) {
  const items = value
    .split(/\r?\n/)
    .map(line => line.match(/^\s*-\s*(?:\[\s?\]\s*)?(.+?)\s*$/)?.[1])
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^(.*?)\s*\(([^()]*)\)\s*$/)
      const name = (match ? match[1] : line).trim()
      const amount = match ? match[2].trim() : ''
      return {
        id: `imported-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        ingredientId: name,
        name,
        amount,
        recipeTitle: '',
        recipeId: '',
        checked: false,
      }
    })
  if (!items.length) throw new Error('No grocery items found')
  return items
}
