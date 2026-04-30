"use client"

import { useCallback, useEffect, useState } from "react"
import {
  COLLECTION_STORAGE_KEY,
  defaultCollections,
  defaultFeaturedCollection,
  parseStoredCollections,
  parseStoredFeaturedCollection,
} from "@/lib/collections"

const FEATURED_COLLECTION_STORAGE_KEY = `${COLLECTION_STORAGE_KEY}_featured`

export function useCollections() {
  const [collections, setCollections] = useState(defaultCollections)
  const [featuredCollection, setFeaturedCollection] = useState(defaultFeaturedCollection)

  useEffect(() => {
    const storedCollections = parseStoredCollections(window.localStorage.getItem(COLLECTION_STORAGE_KEY))
    if (storedCollections) {
      setCollections(storedCollections)
    }

    const storedFeatured = parseStoredFeaturedCollection(window.localStorage.getItem(FEATURED_COLLECTION_STORAGE_KEY))
    if (storedFeatured) {
      setFeaturedCollection(storedFeatured)
    }
  }, [])

  const saveCollections = useCallback((nextCollections) => {
    setCollections(nextCollections)
    window.localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(nextCollections))
  }, [])

  const saveFeaturedCollection = useCallback((nextFeaturedCollection) => {
    setFeaturedCollection(nextFeaturedCollection)
    window.localStorage.setItem(FEATURED_COLLECTION_STORAGE_KEY, JSON.stringify(nextFeaturedCollection))
  }, [])

  const resetCollections = useCallback(() => {
    setCollections(defaultCollections)
    setFeaturedCollection(defaultFeaturedCollection)
    window.localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(defaultCollections))
    window.localStorage.setItem(FEATURED_COLLECTION_STORAGE_KEY, JSON.stringify(defaultFeaturedCollection))
  }, [])

  return {
    collections,
    featuredCollection,
    saveCollections,
    saveFeaturedCollection,
    resetCollections,
  }
}

