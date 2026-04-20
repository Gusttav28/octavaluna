"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language, type TranslationKeys } from "./translations"


interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en")

    useEffect(() => {
        // Load saved language from localStorage
        const savedLang = localStorage.getItem("octava-luna-lang") as Language
        if (savedLang && (savedLang === "en" || savedLang === "es")) {
            setLanguageState(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("octava-luna-lang", lang)
        // Update html lang attribute
        document.documentElement.lang = lang
    }

    const t = translations[language]

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
