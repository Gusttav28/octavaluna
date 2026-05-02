"use client"

import { useCallback, useEffect, useState } from "react"
import {
  COLLECTION_CATEGORIES_STORAGE_KEY,
  defaultCollectionCategories,
  mergeUniqueCollectionCategoryNames,
  normalizeCollectionCategoryName,
  parseStoredCollectionCategories,
} from "@/lib/collection-categories"

export function useCollectionCategories() {
  const [categories, setCategories] = useState(defaultCollectionCategories)

  useEffect(() => {
    const stored = parseStoredCollectionCategories(window.localStorage.getItem(COLLECTION_CATEGORIES_STORAGE_KEY))
    const base = stored && stored.length > 0 ? stored : defaultCollectionCategories
    const nextCategories = mergeUniqueCollectionCategoryNames([base])
    window.queueMicrotask(() => setCategories(nextCategories))
  }, [])

  const persist = useCallback((next) => {
    const merged = mergeUniqueCollectionCategoryNames([next])
    setCategories(merged)
    window.localStorage.setItem(COLLECTION_CATEGORIES_STORAGE_KEY, JSON.stringify(merged))
  }, [])

  const addCategory = useCallback(
    (rawName) => {
      const name = normalizeCollectionCategoryName(rawName)
      if (!name) return { ok: false, message: "Category name cannot be empty." }
      const exists = categories.some((category) => category.toLowerCase() === name.toLowerCase())
      if (exists) return { ok: false, message: "That category already exists." }
      persist([...categories, name])
      return { ok: true, message: null, name }
    },
    [categories, persist],
  )

  const resetCategories = useCallback(() => {
    persist(defaultCollectionCategories)
  }, [persist])

  const ensureCategoriesExist = useCallback(
    (names) => {
      const list = Array.isArray(names) ? names : []
      const next = mergeUniqueCollectionCategoryNames([categories, list])
      persist(next)
    },
    [categories, persist],
  )

  return { categories, addCategory, resetCategories, setCategories: persist, ensureCategoriesExist }
}
