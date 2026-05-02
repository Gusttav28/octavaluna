"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"

type Currency = "USD" | "CRC"

interface SiteContextType {
  currency: Currency
  exchangeRate: number
  toggleCurrency: () => void
  setExchangeRate: (rate: number) => void
  formatPrice: (value: number | string) => string
  notify: (message: string) => void
}

const DEFAULT_CRC_RATE = 520
const EXCHANGE_RATE_STORAGE_KEY = "octavaluna_crc_exchange_rate"
const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD")
  const [exchangeRate, setExchangeRateState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_CRC_RATE
    const storedRate = Number(window.localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY))
    return Number.isFinite(storedRate) && storedRate > 0 ? storedRate : DEFAULT_CRC_RATE
  })
  const [notification, setNotification] = useState("")

  const notify = (message: string) => {
    setNotification(message)
    window.setTimeout(() => setNotification(""), 3200)
  }

  const value = useMemo(
    () => ({
      currency,
      exchangeRate,
      toggleCurrency: () => setCurrency((current) => (current === "USD" ? "CRC" : "USD")),
      setExchangeRate: (rate: number) => {
        const safeRate = Number(rate)
        if (!Number.isFinite(safeRate) || safeRate <= 0) return
        setExchangeRateState(safeRate)
        window.localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, String(safeRate))
      },
      formatPrice: (valueToFormat: number | string) => {
        const amount = Number(valueToFormat || 0)
        if (currency === "CRC") {
          return new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
            maximumFractionDigits: 0,
          }).format(amount * exchangeRate)
        }

        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(amount)
      },
      notify,
    }),
    [currency, exchangeRate],
  )

  return (
    <SiteContext.Provider value={value}>
      {notification ? (
        <div className="fixed left-1/2 top-5 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md border border-accent/30 bg-background px-4 py-3 text-sm shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <p className="font-medium text-foreground">{notification}</p>
          </div>
        </div>
      ) : null}
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) throw new Error("useSite must be used within a SiteProvider")
  return context
}
