"use client"

import { useCallback, useEffect, useState } from "react"
import {
  defaultProductCategories,
  parseStoredCategories,
  PRODUCT_CATEGORIES_STORAGE_KEY,
  normalizeCategoryName,
  mergeUniqueCategoryNames,
} from "@/lib/product-categories"

export function useProductCategories() {
  const [categories, setCategories] = useState(defaultProductCategories)

  useEffect(() => {
    const stored = parseStoredCategories(window.localStorage.getItem(PRODUCT_CATEGORIES_STORAGE_KEY))
    const base = stored && stored.length > 0 ? stored : defaultProductCategories
    setCategories(mergeUniqueCategoryNames([base]))
  }, [])

  const persist = useCallback((next) => {
    const merged = mergeUniqueCategoryNames([next])
    setCategories(merged)
    window.localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(merged))
  }, [])

  const addCategory = useCallback(
    (rawName) => {
      const name = normalizeCategoryName(rawName)
      if (!name) return { ok: false, message: "Category name cannot be empty." }
      const exists = categories.some((c) => c.toLowerCase() === name.toLowerCase())
      if (exists) return { ok: false, message: "That category already exists." }
      persist([...categories, name])
      return { ok: true, message: null, name }
    },
    [categories, persist],
  )

  const resetCategories = useCallback(() => {
    persist(defaultProductCategories)
  }, [persist])

  const ensureCategoriesExist = useCallback(
    (names) => {
      const list = Array.isArray(names) ? names : []
      const next = mergeUniqueCategoryNames([categories, list])
      persist(next)
    },
    [categories, persist],
  )

  return { categories, addCategory, resetCategories, setCategories: persist, ensureCategoriesExist }
}
