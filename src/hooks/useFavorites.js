import { useEffect, useState } from "react";

const FAVORITES_KEY = "masakapa-favorites";

function readFavorites() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(stored)
      ? stored.filter((recipe) => recipe && typeof recipe === "object" && recipe.id)
      : [];
  } catch {
    return [];
  }
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Storage may be unavailable or full; the in-memory list remains usable.
    }
  }, [favorites]);

  const toggleFavorite = (recipe) => {
    if (!recipe?.id) return;
    setFavorites((items) =>
      items.some((item) => item.id === recipe.id)
        ? items.filter((item) => item.id !== recipe.id)
        : [...items, recipe],
    );
  };

  const isFavorite = (recipeId) =>
    favorites.some((recipe) => recipe.id === recipeId);

  return { favorites, toggleFavorite, isFavorite };
}
