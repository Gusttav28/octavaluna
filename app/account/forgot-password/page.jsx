"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"

export default function ForgotPasswordPage() {
    const { t } = useLanguage()
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     setIsLoading(true)
    //     // Simulate API call
    //     await new Promise((resolve) => setTimeout(resolve, 1500))
    //     setIsLoading(false)
    //     setIsSubmitted(true)
    // }

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-secondary/30 py-12 border-b border-muted">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/account?tab=login"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t.account.backToSignIn}
                    </Link>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground">{t.account.forgotPasswordTitle}</h1>
                    <div className="h-0.5 w-16 bg-accent mt-4" />
                </div>
            </div>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
                    {!isSubmitted ? (
                        <>
                            {/* Instructions */}
                            <div className="mb-10 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                                    <Mail className="h-8 w-8 text-accent" />
                                </div>
                                <h2 className="font-serif text-2xl text-foreground mb-3">{t.account.forgotPassword}</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t.account.forgotPasswordDesc}
                                </p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">
                                        {t.account.emailAddress}
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-10 bg-background border-muted focus:border-accent"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        t.account.sendResetLink
                                    )}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-10">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-muted" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-4 text-muted-foreground tracking-widest">Or</span>
                                </div>
                            </div>

                            {/* Alternative Options */}
                            <div className="space-y-4">
                                <Link href="/account?tab=login">
                                    <Button
                                        variant="outline"
                                        className="w-full bg-transparent border-muted hover:bg-secondary/50 text-foreground"
                                    >
                                        {t.account.backToSignIn}
                                    </Button>
                                </Link>
                                <p className="text-center text-sm text-muted-foreground">
                                    {t.account.rememberPassword}{" "}
                                    <Link href="/account?tab=register" className="text-accent hover:underline">
                                        {t.account.createAccount}
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        /* Success State */
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-8">
                                <CheckCircle className="h-10 w-10 text-accent" />
                            </div>
                            <h2 className="font-serif text-2xl text-foreground mb-4">Check your inbox</h2>
                            <p className="text-muted-foreground leading-relaxed mb-2">
                                We've sent a password reset link to:
                            </p>
                            <p className="text-foreground font-medium mb-6">{email}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-10">
                                Click the link in the email to reset your password. If you don't see the email, check your spam folder.
                            </p>

                            {/* Actions */}
                            <div className="space-y-4">
                                <Button
                                    onClick={() => setIsSubmitted(false)}
                                    variant="outline"
                                    className="w-full bg-transparent border-muted hover:bg-secondary/50 text-foreground"
                                >
                                    Try a different email
                                </Button>
                                <Link href="/account?tab=login">
                                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest">
                                        Return to Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Help */}
                            <div className="mt-12 pt-8 border-t border-muted">
                                <h3 className="font-serif text-lg text-foreground mb-4">Need Help?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    If you're having trouble resetting your password, our support team is here to help.
                                </p>
                                <Link href="/contact" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                                    Contact Support
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Security Note */}
                    {!isSubmitted && (
                        <div className="mt-12 pt-8 border-t border-muted">
                            <h3 className="font-serif text-lg text-foreground mb-4">Security Tips</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                    The reset link will expire in 24 hours for your security
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                    Choose a strong password with at least 8 characters
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                    Never share your password with anyone
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
