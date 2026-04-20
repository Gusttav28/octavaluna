"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Award, Heart, Gem, Leaf } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  const values = [
    {
      icon: Gem,
      title: t.about.valueQuality,
      description: t.about.valueQualityDesc,
    },
    {
      icon: Heart,
      title: t.about.valueCraftsmanship,
      description: t.about.valueCraftsmanshipDesc,
    },
    {
      icon: Award,
      title: t.about.valueDesign,
      description: t.about.valueDesignDesc,
    },
    {
      icon: Leaf,
      title: t.about.valueEthical,
      description: t.about.valueEthicalDesc,
    },
  ]

  const milestones = [
    { year: "2015", event: t.about.milestone2015 },
    { year: "2017", event: t.about.milestone2017 },
    { year: "2019", event: t.about.milestone2019 },
    { year: "2021", event: t.about.milestone2021 },
    { year: "2023", event: t.about.milestone2023 },
    { year: "2024", event: t.about.milestone2024 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.about.badge}</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.about.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.about.subtitle}
          </p>
          <div className="mx-auto mt-6 h-0.5 w-16 bg-accent" />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-8 bg-accent" />
                {t.about.beginningBadge}
              </span>
              <h2 className="mt-6 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                {t.about.beginningTitle}
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {t.about.beginningP1}
                </p>
                <p>
                  {t.about.beginningP2}
                </p>
                <p>
                  {t.about.beginningP3}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-card">
                <img
                  src="/jewelry-artisan-crafting-gold-necklace-workshop-ha.jpg"
                  alt="Artisan crafting jewelry"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 border border-accent" />
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-accent/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.about.valuesBadge}</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              {t.about.valuesTitle}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-accent/30 group-hover:border-accent group-hover:bg-accent/5 transition-colors">
                  <value.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mt-6 font-serif text-xl text-foreground">{value.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.about.journeyBadge}</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              {t.about.journeyTitle}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <span className="font-serif text-2xl text-accent">{milestone.year}</span>
                    <p className="mt-1 text-foreground">{milestone.event}</p>
                  </div>
                  <div className="relative z-10 flex h-4 w-4 items-center justify-center">
                    <div className="h-4 w-4 rotate-45 bg-accent" />
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-accent">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl tracking-tight text-accent-foreground sm:text-4xl">
            {t.about.teamTitle}
          </h2>
          <p className="mt-4 text-lg text-accent-foreground/80">
            {t.about.teamDescription}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-background text-foreground px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
          >
            {t.about.visitWorkshop}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
