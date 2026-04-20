"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/lib/language-context"

export default function AccountPage() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    } else {
      setActiveTab("login")
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/30 py-12 border-b border-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.account.backToHome}
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            {activeTab === "login" ? t.account.welcomeBack : t.account.joinUs}
          </h1>
          <div className="h-0.5 w-16 bg-accent mt-4" />
        </div>
      </div>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          {/* Tab Switcher */}
          <div className="flex mb-10 border border-muted rounded-sm overflow-hidden">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === "login"
                ? "bg-accent text-accent-foreground"
                : "bg-background text-foreground hover:bg-secondary/50"
                }`}
            >
              {t.account.signIn}
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === "register"
                ? "bg-accent text-accent-foreground"
                : "bg-background text-foreground hover:bg-secondary/50"
                }`}
            >
              {t.account.register}
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">
                  {t.account.emailAddress}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={t.account.emailPlaceholder}
                    className="pl-10 bg-background border-muted focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">
                  {t.account.password}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.account.enterPassword}
                    className="pl-10 pr-10 bg-background border-muted focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" className="border-muted data-[state=checked]:bg-accent" />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    {t.account.rememberMe}
                  </Label>
                </div>
                <Link href="/account/forgot-password" className="text-sm text-accent hover:underline">
                  {t.account.forgotPassword}
                </Link>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest">
                {t.account.signIn}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground tracking-widest">{t.account.orContinueWith}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="bg-transparent border-muted hover:bg-secondary/50 text-foreground">
                  Google
                </Button>
                <Button variant="outline" className="bg-transparent border-muted hover:bg-secondary/50 text-foreground">
                  Apple
                </Button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-foreground">
                    {t.account.firstName}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="first-name"
                      type="text"
                      placeholder={t.account.firstName}
                      className="pl-10 bg-background border-muted focus:border-accent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-foreground">
                    {t.account.lastName}
                  </Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder={t.account.lastName}
                    className="bg-background border-muted focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-foreground">
                  {t.account.emailAddress}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={t.account.emailPlaceholder}
                    className="pl-10 bg-background border-muted focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  {t.account.phoneNumber} <span className="text-muted-foreground">({t.account.optional})</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="pl-10 bg-background border-muted focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-foreground">
                  {t.account.password}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.account.createPassword}
                    className="pl-10 pr-10 bg-background border-muted focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{t.account.passwordRequirement}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground">
                  {t.account.confirmPassword}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t.account.confirmYourPassword}
                    className="pl-10 pr-10 bg-background border-muted focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" className="border-muted data-[state=checked]:bg-accent mt-0.5" />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    {t.account.agreeToTerms}{" "}
                    <Link href="/terms" className="text-accent hover:underline">
                      {t.account.termsOfService}
                    </Link>{" "}
                    {t.account.and}{" "}
                    <Link href="/privacy" className="text-accent hover:underline">
                      {t.account.privacyPolicy}
                    </Link>
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="newsletter" className="border-muted data-[state=checked]:bg-accent mt-0.5" />
                  <Label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    {t.account.subscribeNewsletter}
                  </Label>
                </div>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest">
                {t.account.createAccount}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground tracking-widest">{t.account.orSignUpWith}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="bg-transparent border-muted hover:bg-secondary/50 text-foreground">
                  Google
                </Button>
                <Button variant="outline" className="bg-transparent border-muted hover:bg-secondary/50 text-foreground">
                  Apple
                </Button>
              </div>
            </form>
          )}

          {/* Benefits */}
          <div className="mt-12 pt-8 border-t border-muted">
            <h3 className="font-serif text-lg text-foreground mb-4">{t.account.memberBenefits}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t.account.benefit1}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t.account.benefit2}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t.account.benefit3}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t.account.benefit4}
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t.account.benefit5}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
