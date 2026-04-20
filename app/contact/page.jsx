"use client"

import React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function ContactPage() {
  const { t } = useLanguage()

  const contactInfo = [
    {
      icon: MapPin,
      title: t.contact.visitUs,
      details: ["123 Luxury Lane", "Barcelona, Spain 08001"],
    },
    {
      icon: Phone,
      title: t.contact.callUs,
      details: ["+34 123 456 789", "+34 987 654 321"],
    },
    {
      icon: Mail,
      title: t.contact.emailUs,
      details: ["hello@octavaluna.com", "support@octavaluna.com"],
    },
    {
      icon: Clock,
      title: t.contact.openingHours,
      details: [t.contact.monSat, t.contact.sunday],
    },
  ]

  const inquiryTypes = [
    { key: "general", label: t.contact.generalInquiry },
    { key: "custom", label: t.contact.customDesign },
    { key: "product", label: t.contact.productQuestion },
    { key: "wholesale", label: t.contact.wholesale },
    { key: "press", label: t.contact.pressMedia },
    { key: "other", label: t.contact.other },
  ]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  })

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Handle form submission
  //   console.log("Form submitted:", formData)
  // }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.contact.badge}</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.contact.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.contact.description}
          </p>
          <div className="mx-auto mt-6 h-0.5 w-16 bg-accent" />
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-card p-6 text-center border border-border hover:border-accent/50 transition-colors"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-accent/30">
                  <info.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-4 font-serif text-lg text-foreground">{info.title}</h3>
                <div className="mt-2 space-y-1">
                  {info.details.map((detail, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-8 bg-accent" />
                {t.contact.sendMessage}
              </span>
              <h2 className="mt-6 font-serif text-3xl tracking-tight text-foreground">
                {t.contact.loveToHear}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t.contact.formDescription}
              </p>

              <form className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      {t.contact.fullName}
                    </label>
                    <Input
                      id="name"
                      placeholder={t.contact.yourName}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-border focus:border-accent focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      {t.contact.emailAddress}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-border focus:border-accent focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      {t.contact.phoneNumber} <span className="text-muted-foreground">({t.contact.optional})</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+34 123 456 789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-border focus:border-accent focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="inquiry" className="text-sm font-medium text-foreground">
                      {t.contact.inquiryType}
                    </label>
                    <select
                      id="inquiry"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">{t.contact.selectOption}</option>
                      {inquiryTypes.map((type) => (
                        <option key={type.key} value={type.key}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    {t.contact.yourMessage}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t.contact.messagePlaceholder}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-border focus:border-accent focus:ring-accent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t.contact.sendMessageBtn}
                </Button>
              </form>
            </div>

            {/* Map / Image */}
            <div className="relative">
              <div className="sticky top-28">
                <div className="aspect-square bg-secondary overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.5799859843147!2d2.1686!3d41.3874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIzJzE0LjYiTiAywrAxMCcwNy4wIkU!5e0!3m2!1sen!2ses!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Octava Luna Location"
                    className="grayscale"
                  />
                </div>
                <div className="mt-6 p-6 bg-accent text-accent-foreground">
                  <h3 className="font-serif text-xl">{t.contact.visitBoutique}</h3>
                  <p className="mt-2 text-accent-foreground/80 text-sm">
                    {t.contact.boutiqueDescription}
                  </p>
                  <p className="mt-4 text-sm font-medium">
                    {t.contact.bookAppointment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.contact.faqBadge}</span>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            {t.contact.faqTitle}
          </h2>
          <div className="mt-8 space-y-6 text-left">
            {[
              {
                q: t.contact.faq1Q,
                a: t.contact.faq1A,
              },
              {
                q: t.contact.faq2Q,
                a: t.contact.faq2A,
              },
              {
                q: t.contact.faq3Q,
                a: t.contact.faq3A,
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h3 className="font-serif text-lg text-foreground">{faq.q}</h3>
                <p className="mt-2 text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
