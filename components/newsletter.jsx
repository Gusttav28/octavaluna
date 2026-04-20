"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const { t } = useLanguage()

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Handle newsletter signup
  //   setEmail("")
  // }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-accent">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl tracking-tight text-accent-foreground sm:text-4xl">{t.newsletter.title}</h2>
        <p className="mt-4 text-accent-foreground/80">
          {t.newsletter.description}
        </p>
        <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3">
          <Input
            type="email"
            placeholder={t.newsletter.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/60 focus:border-accent-foreground"
          />
          <Button
            type="submit"
            className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 uppercase tracking-widest text-xs px-8"
          >
            {t.newsletter.subscribe}
          </Button>
        </form>
        <p className="mt-4 text-xs text-accent-foreground/60">
          {t.newsletter.disclaimer}
        </p>
      </div>
    </section>
  )
}
