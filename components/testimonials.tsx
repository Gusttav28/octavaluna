import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "The craftsmanship is absolutely stunning. My Luna necklace has become my everyday staple.",
    author: "Sarah M.",
    location: "New York",
  },
  {
    quote: "Exceptional quality and the most elegant packaging. Truly a luxury experience from start to finish.",
    author: "Emma L.",
    location: "Los Angeles",
  },
  {
    quote: "I've received so many compliments on my Celestial ring. It's become a treasured heirloom.",
    author: "Michelle K.",
    location: "Chicago",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Testimonials</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">What Our Clients Say</h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative text-center p-8 bg-card">
              <Quote className="mx-auto h-8 w-8 text-accent/40 mb-6" />
              <blockquote className="font-serif text-lg italic leading-relaxed text-foreground">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-6 mb-4 mx-auto h-px w-12 bg-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
