export function scaleIngredientAmount(amount, defaultServings, selectedServings) {
  const match = amount.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)(.*)$/)
  if (!match) return amount
  const value = match[1].includes('/') ? match[1].split('/').reduce((total, part, index, parts) => index === 0 ? Number(part) / Number(parts[1]) : total, 0) : Number(match[1])
  const scaled = value * selectedServings / defaultServings
  const whole = Math.floor(scaled)
  const fraction = scaled - whole
  const fractions = [[1 / 3, '1/3'], [1 / 2, '1/2'], [2 / 3, '2/3']]
  const nearest = fractions.find(([number]) => Math.abs(number - fraction) < 0.04)
  const formatted = nearest ? `${whole ? `${whole} ` : ''}${nearest[1]}` : String(Math.round(scaled * 100) / 100).replace(/\.0+$/, '')
  return `${formatted}${match[2]}`
}
