function localizedValue(value, language) {
  if (value && typeof value === "object") {
    return value[language] || value.ms || value.en || "";
  }
  return value || "";
}

function openWhatsApp(text) {
  const encodedText = encodeURIComponent(text);
  window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank", "noopener,noreferrer");
}

function compactGroceryItems(items, language) {
  return items
    .map((item) => {
      const name = localizedValue(item.name, language) || item.ingredientId || "";
      return `${name}|${item.amount || ""}`;
    })
    .join("~");
}

export function encodeCompactGrocery(items = [], language = "ms") {
  return btoa(encodeURIComponent(compactGroceryItems(items, language)));
}

function sharedItem(name, amount, index) {
  const safeName = name.trim();
  return {
    id: `imported-${index}-${safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    ingredientId: safeName,
    name: safeName,
    amount: amount.trim(),
    recipeTitle: "",
    recipeId: "",
    checked: false,
  };
}

export function decodeCompactGrocery(value) {
  const match = String(value || "").match(/[?&]g=([^&\s)]+)/);
  const payload = match ? match[1] : String(value || "").trim();
  const compact = decodeURIComponent(atob(decodeURIComponent(payload)));
  const items = compact
    .split("~")
    .map((entry) => {
      const separator = entry.indexOf("|");
      return separator < 0
        ? [entry, ""]
        : [entry.slice(0, separator), entry.slice(separator + 1)];
    })
    .filter(([name]) => name.trim())
    .map(([name, amount], index) => sharedItem(name, amount, index));
  if (!items.length) throw new Error("No grocery items found");
  return items;
}

export function shareRecipeToWhatsApp(recipe, language = "ms") {
  const isEnglish = language === "en";
  const title = localizedValue(recipe.title || recipe.name, language);
  const rawCookTime = recipe.cookTime || recipe.time;
  const cookTime = rawCookTime ? `${rawCookTime}${typeof rawCookTime === "number" ? " min" : ""}` : "20 min";
  const servings = recipe.servings || 2;
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || recipe.steps || [];
  const ingredientLabel = isEnglish ? "Ingredients" : "Bahan-bahan";
  const instructionLabel = isEnglish ? "Instructions" : "Langkah-langkah";
  const text = [
    `*${isEnglish ? "Recipe" : "Resipi"}: ${title}*`,
    `${isEnglish ? "Time" : "Masa"}: ${cookTime} | ${isEnglish ? "Servings" : "Hidangan"}: ${servings}`,
    "",
    `*${ingredientLabel}:*`,
    ingredients
      .map((item) => `- ${item.amount ? `${item.amount} ` : ""}${localizedValue(item.name, language)}`.trim())
      .join("\n"),
    "",
    `*${instructionLabel}:*`,
    instructions
      .map((step, index) => `${index + 1}. ${localizedValue(step, language)}`)
      .join("\n"),
    "",
    `${isEnglish ? "Open recipe" : "Buka resipi"}: https://masakapa-today.vercel.app/?recipe=${recipe.id}`,
  ].join("\n");

  openWhatsApp(text);
}

export function shareGroceryToWhatsApp(groceryItems = [], language = "ms") {
  const isEnglish = language === "en";
  const title = isEnglish
    ? "Grocery List (Masak Apa Hari Ini)"
    : "Senarai Barang Dapur (Masak Apa Hari Ini)";
  const payload = encodeCompactGrocery(groceryItems, language);
  const text = [
    `*${title}*`,
    "",
    groceryItems
      .map((item) => {
        const name = localizedValue(item.name, language) || item.ingredientId || "";
        const amount = item.amount ? ` (${localizedValue(item.amount, language)})` : "";
        return `- ${name}${amount}`;
    })
      .join("\n"),
    "",
    `${isEnglish ? "Import to app" : "Import ke app"}: https://masakapa-today.vercel.app/?g=${encodeURIComponent(payload)}`,
  ].join("\n");

  openWhatsApp(text);
}
