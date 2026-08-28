import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ingredientOptions, recipes, stapleIngredients } from '../src/data/recipes.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const mappingPath = resolve(__dirname, 'recipe-uuid-map.json')

function loadExistingMap() {
  try {
    const content = readFileSync(mappingPath, 'utf8')
    return new Map(Object.entries(JSON.parse(content)))
  } catch {
    return new Map()
  }
}

function saveMap(map) {
  const object = Object.fromEntries(map)
  writeFileSync(mappingPath, JSON.stringify(object, null, 2))
}

function isBilingual(value) {
  return value && typeof value === 'object' && ('ms' in value || 'en' in value)
}

function ms(value) {
  return isBilingual(value) ? value.ms : value
}

function en(value) {
  return isBilingual(value) ? value.en : value
}

async function seed() {
  const ingredientRows = [...stapleIngredients, ...ingredientOptions].map(item => ({
    id: item.id,
    name_ms: ms(item.name),
    name_en: en(item.name) || ms(item.name),
    group: item.group,
    is_staple: stapleIngredients.some(staple => staple.id === item.id),
  }))

  console.log(`Seeding ${ingredientRows.length} ingredients...`)
  const { error: ingredientError } = await supabase
    .from('ingredients')
    .upsert(ingredientRows, { onConflict: 'id' })

  if (ingredientError) {
    console.error('Failed to seed ingredients:', ingredientError)
    process.exit(1)
  }

  console.log('Resolving recipe UUIDs...')
  const { data: existingRecipes, error: fetchError } = await supabase
    .from('recipes')
    .select('id, slug')

  if (fetchError) {
    console.error('Failed to read existing recipes:', fetchError)
    process.exit(1)
  }

  const idMap = loadExistingMap()

  for (const row of existingRecipes || []) {
    if (row.slug) idMap.set(row.slug, row.id)
  }

  for (const recipe of recipes) {
    if (!idMap.has(recipe.id)) {
      idMap.set(recipe.id, randomUUID())
    }
  }

  saveMap(idMap)

  const recipeRows = recipes.map(recipe => {
    const pairingUuids = (recipe.pairings || [])
      .map(slug => idMap.get(slug))
      .filter(Boolean)

    return {
      id: idMap.get(recipe.id),
      slug: recipe.id,
      name_ms: ms(recipe.name),
      name_en: en(recipe.name) || ms(recipe.name),
      style_ms: ms(recipe.style),
      style_en: en(recipe.style) || ms(recipe.style),
      difficulty_ms: ms(recipe.difficulty),
      difficulty_en: en(recipe.difficulty) || ms(recipe.difficulty),
      time: recipe.time,
      servings: recipe.servings,
      default_servings: recipe.defaultServings,
      equipment: recipe.equipment.map(item => ({ ms: ms(item), en: en(item) || ms(item) })),
      air_fryer: Boolean(recipe.airFryer),
      accent: recipe.accent,
      pairings: pairingUuids,
      ingredients: recipe.ingredients.map(item => ({
        id: item.id,
        name: { ms: ms(item.name), en: en(item.name) || ms(item.name) },
        amount: item.amount,
        staple: Boolean(item.staple),
        optional: Boolean(item.optional),
      })),
      steps: recipe.steps.map(item => ({ ms: ms(item), en: en(item) || ms(item) })),
      tip_ms: ms(recipe.tip),
      tip_en: en(recipe.tip) || ms(recipe.tip),
      sides: recipe.sides.map(item => ({ ms: ms(item), en: en(item) || ms(item) })),
    }
  })

  console.log(`Seeding ${recipeRows.length} recipes...`)
  const { error: recipeError } = await supabase
    .from('recipes')
    .upsert(recipeRows, { onConflict: 'id' })

  if (recipeError) {
    console.error('Failed to seed recipes:', recipeError)
    process.exit(1)
  }

  console.log('Seed complete.')
}

seed().catch(error => {
  console.error(error)
  process.exit(1)
})
