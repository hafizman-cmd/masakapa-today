const unitMap = {
  ketul: { ms: 'ketul', en: 'pieces' },
  biji: { ms: 'biji', en: 'whole' },
  ulas: { ms: 'ulas', en: 'cloves' },
  batang: { ms: 'batang', en: 'stalks' },
  helai: { ms: 'helai', en: 'leaves' },
  sudu: { ms: 'sudu', en: 'tbsp' },
  'sudu besar': { ms: 'sudu besar', en: 'tbsp' },
  'sudu kecil': { ms: 'sudu kecil', en: 'tsp' },
  'sudu teh': { ms: 'sudu teh', en: 'tsp' },
  secubit: { ms: 'secubit', en: 'pinch' },
  sedikit: { ms: 'sedikit', en: 'a dash of' },
  'secukup rasa': { ms: 'secukup rasa', en: 'to taste' },
  secukupnya: { ms: 'secukupnya', en: 'as needed' },
  mangkuk: { ms: 'mangkuk', en: 'bowls' },
  cawan: { ms: 'cawan', en: 'cups' },
  keping: { ms: 'keping', en: 'slices' },
  tangkai: { ms: 'tangkai', en: 'sprigs' },
  kuntum: { ms: 'kuntum', en: 'buds' },
  ikat: { ms: 'ikat', en: 'bunches' },
  ekor: { ms: 'ekor', en: 'whole' },
  papan: { ms: 'papan', en: 'slabs' },
  tongkol: { ms: 'tongkol', en: 'ears' },
  buku: { ms: 'buku', en: 'loaves' },
  paket: { ms: 'paket', en: 'packs' },
  bungkus: { ms: 'bungkus', en: 'packs' },
}

const unitPattern = new RegExp(
  `\\b(${Object.keys(unitMap).sort((a, b) => b.length - a.length).join('|')})\\b`,
  'gi',
)

export function translateUnit(amountStr, language) {
  const amount = String(amountStr || '')
  if (language !== 'en') return amount

  return amount.replace(unitPattern, unit => unitMap[unit.toLowerCase()].en)
}

export { unitMap }
