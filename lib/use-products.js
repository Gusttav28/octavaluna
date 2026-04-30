"use client"

import { useCallback, useEffect, useState } from "react"
import { defaultProducts, parseStoredProducts, PRODUCT_STORAGE_KEY } from "@/lib/products"

export function useProducts() {
  const [products, setProducts] = useState(defaultProducts)

  const persistProducts = useCallback((nextProducts) => {
    setProducts(nextProducts)
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(nextProducts))
  }, [])

  useEffect(() => {
    const stored = parseStoredProducts(window.localStorage.getItem(PRODUCT_STORAGE_KEY))
    if (stored) {
      setProducts(stored)
    }
  }, [])

  const saveProducts = useCallback((nextProducts) => {
    persistProducts(nextProducts)
  }, [persistProducts])

  const resetProducts = useCallback(() => {
    persistProducts(defaultProducts)
  }, [persistProducts])

  const recordProductSale = useCallback(
    (productId, quantity = 1) => {
      const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1))
      const nextProducts = products.map((product) => {
        if (product.id !== productId) return product
        const nextInventory = Math.max(0, Number(product.inventory || 0) - safeQuantity)
        return {
          ...product,
          inventory: nextInventory,
          unitsSoldTotal: Math.max(0, Number(product.unitsSoldTotal || 0) + safeQuantity),
        }
      })

      persistProducts(nextProducts)
    },
    [products, persistProducts],
  )

  return { products, saveProducts, resetProducts, recordProductSale }
}

