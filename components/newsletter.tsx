"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-accent">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl tracking-tight text-accent-foreground sm:text-4xl">Join Our World</h2>
        <p className="mt-4 text-accent-foreground/80">
          Subscribe for exclusive access to new collections, special offers, and the stories behind our designs.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/60 focus:border-accent-foreground"
          />
          <Button
            type="submit"
            className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 uppercase tracking-widest text-xs px-8"
          >
            Subscribe
          </Button>
        </form>
        <p className="mt-4 text-xs text-accent-foreground/60">
          By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
