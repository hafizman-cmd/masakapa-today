import { useEffect, useState } from 'react'
import {
  groups as staticGroups,
  ingredientOptions as staticIngredientOptions,
  recipes as staticRecipes,
  stapleIngredients as staticStapleIngredients,
} from '../data/recipes.js'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

const CACHE_KEY = 'masakapa-recipes-cache'
const CACHE_VERSION = 2

function bilingual(ms, en) {
  return { ms, en: en || ms }
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.version !== CACHE_VERSION) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ version: CACHE_VERSION, data }),
    )
  } catch {
    // Storage may be unavailable.
  }
}

function transformIngredients(rows) {
  return rows.map(row => ({
    id: row.id,
    name: bilingual(row.name_ms, row.name_en),
    group: row.group,
  }))
}

function transformRecipes(rows) {
  const slugById = new Map(rows.map(row => [row.id, row.slug]))

  return rows.map(row => ({
    id: row.slug,
    name: bilingual(row.name_ms, row.name_en),
    style: bilingual(row.style_ms, row.style_en),
    difficulty: bilingual(row.difficulty_ms, row.difficulty_en),
    time: row.time,
    servings: row.servings,
    defaultServings: row.default_servings,
    equipment: row.equipment.map(item => bilingual(item.ms, item.en)),
    airFryer: Boolean(row.air_fryer),
    accent: row.accent,
    pairings: (row.pairings || [])
      .map(uuid => slugById.get(uuid))
      .filter(Boolean),
    ingredients: (row.ingredients || []).map(item => ({
      name: bilingual(item.name.ms, item.name.en),
      amount: item.amount,
      id: item.id,
      staple: Boolean(item.staple),
      optional: Boolean(item.optional),
    })),
    steps: row.steps.map(step => bilingual(step.ms, step.en)),
    tip: bilingual(row.tip_ms, row.tip_en),
    sides: row.sides.map(side => bilingual(side.ms, side.en)),
  }))
}

function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine !== false : true
}

export default function useRecipes() {
  const [state, setState] = useState(() => {
    const cached = readCache()
    return {
      recipes: cached?.recipes ?? staticRecipes,
      ingredientOptions: cached?.ingredientOptions ?? staticIngredientOptions,
      stapleIngredients: cached?.stapleIngredients ?? staticStapleIngredients,
      groups: cached?.groups ?? staticGroups,
      loading: isSupabaseConfigured && isOnline(),
      error: null,
      isOffline: !isOnline(),
    }
  })

  useEffect(() => {
    if (!isSupabaseConfigured || !isOnline()) return

    let cancelled = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)

    async function load() {
      try {
        const [ingredientsResult, recipesResult] = await Promise.all([
          supabase.from('ingredients').select('*').abortSignal(controller.signal),
          supabase.from('recipes').select('*').abortSignal(controller.signal),
        ])

        if (cancelled) return

        if (ingredientsResult.error || recipesResult.error) {
          setState(current => ({
            ...current,
            loading: false,
            error: ingredientsResult.error || recipesResult.error,
            isOffline: false,
          }))
          return
        }

        const ingredientRows = Array.isArray(ingredientsResult.data)
          ? ingredientsResult.data
          : []
        const recipeRows = Array.isArray(recipesResult.data)
          ? recipesResult.data
          : []
        const stapleIngredients = ingredientRows.length
          ? transformIngredients(ingredientRows.filter(row => row.is_staple))
          : staticStapleIngredients
        const ingredientOptions = ingredientRows.length
          ? transformIngredients(ingredientRows.filter(row => !row.is_staple))
          : staticIngredientOptions
        const recipes = recipeRows.length ? transformRecipes(recipeRows) : staticRecipes

        const nextState = {
          recipes,
          ingredientOptions,
          stapleIngredients,
          groups: staticGroups,
          loading: false,
          error: null,
          isOffline: false,
        }

        writeCache(nextState)
        setState(nextState)
      } catch (error) {
        if (!cancelled) {
          setState(current => ({
            ...current,
            loading: false,
            error,
            isOffline: !isOnline(),
          }))
        }
      }
    }

    load()

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return state
}
