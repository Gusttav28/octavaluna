"use client"

import React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Luxury Lane", "Barcelona, Spain 08001"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+34 123 456 789", "+34 987 654 321"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@octavaluna.com", "support@octavaluna.com"],
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Mon - Sat: 10:00 - 19:00", "Sunday: By Appointment"],
  },
]

const inquiryTypes = [
  "General Inquiry",
  "Custom Design Request",
  "Product Question",
  "Wholesale Partnership",
  "Press & Media",
  "Other",
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Get In Touch</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We would love to hear from you. Whether you have a question about our collections, 
            need assistance with an order, or want to discuss a custom design, we are here to help.
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
                Send a Message
              </span>
              <h2 className="mt-6 font-serif text-3xl tracking-tight text-foreground">
                We&apos;d Love to Hear From You
              </h2>
              <p className="mt-4 text-muted-foreground">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-border focus:border-accent focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
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
                      Phone Number <span className="text-muted-foreground">(Optional)</span>
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
                      Inquiry Type
                    </label>
                    <select
                      id="inquiry"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">Select an option</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
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
                  Send Message
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
                  <h3 className="font-serif text-xl">Visit Our Boutique</h3>
                  <p className="mt-2 text-accent-foreground/80 text-sm">
                    Experience our collections in person. Our knowledgeable staff is ready to help 
                    you find the perfect piece or discuss a custom creation.
                  </p>
                  <p className="mt-4 text-sm font-medium">
                    Book a private appointment for a personalized experience.
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
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Common Questions</span>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-6 text-left">
            {[
              {
                q: "Do you offer custom jewelry design?",
                a: "Yes, we specialize in creating bespoke pieces. Contact us to discuss your vision and we'll work together to bring it to life.",
              },
              {
                q: "What is your return policy?",
                a: "We offer a 30-day return policy for unworn items in their original packaging. Custom pieces are final sale.",
              },
              {
                q: "How long does shipping take?",
                a: "Standard shipping within Spain takes 2-3 business days. International shipping varies by location, typically 5-10 business days.",
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
