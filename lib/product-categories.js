export const PRODUCT_CATEGORIES_STORAGE_KEY = "octavaluna_product_categories"

export const defaultProductCategories = ["Necklaces", "Rings", "Earrings", "Bracelets"]

export function parseStoredCategories(value) {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return null
    return parsed.filter((item) => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
  } catch {
    return null
  }
}

export function normalizeCategoryName(name) {
  return String(name || "").trim()
}

export function mergeUniqueCategoryNames(lists) {
  const seen = new Set()
  const out = []
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const item of list) {
      const trimmed = typeof item === "string" ? item.trim() : ""
      const key = trimmed.toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      out.push(trimmed)
    }
  }
  return out.sort((a, b) => a.localeCompare(b))
}
