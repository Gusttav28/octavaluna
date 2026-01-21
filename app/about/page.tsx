import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Award, Heart, Gem, Leaf } from "lucide-react"

const values = [
  {
    icon: Gem,
    title: "Exceptional Quality",
    description: "We source only the finest materials and gemstones, ensuring each piece meets our exacting standards.",
  },
  {
    icon: Heart,
    title: "Artisan Craftsmanship",
    description: "Every piece is handcrafted by skilled artisans who have dedicated their lives to the jewelry arts.",
  },
  {
    icon: Award,
    title: "Timeless Design",
    description: "Our designs transcend trends, creating pieces that will be treasured for generations.",
  },
  {
    icon: Leaf,
    title: "Ethical Sourcing",
    description: "We are committed to responsible practices, using ethically sourced materials and sustainable methods.",
  },
]

const milestones = [
//   { year: "2015", event: "Octava Luna founded in Barcelona" },
//   { year: "2017", event: "First flagship boutique opens" },
//   { year: "2019", event: "Launch of the Celestial Collection" },
  { year: "2021", event: "Octava Luna founded in Costa Rica" },
  { year: "2023", event: "Introduction of sustainable packaging" },
  { year: "2024", event: "Opening of artisan workshop experience" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Our Story</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            About Octava Luna
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Where tradition meets contemporary elegance
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
                The Beginning
              </span>
              <h2 className="mt-6 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                Born from a Passion for Beauty
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Octava Luna was born in 2015 from a simple yet profound belief: that jewelry should be more 
                  than mere adornment. It should be a reflection of the wearer&apos;s inner light, a celebration 
                  of life&apos;s precious moments.
                </p>
                <p>
                  Our founder, Elena Vidal, grew up watching her grandmother craft jewelry in a small 
                  Barcelona workshop. Those early memories of gold catching the Mediterranean light, 
                  of delicate hands shaping metal into art, planted the seed for what would become 
                  Octava Luna.
                </p>
                <p>
                  The name itself honors the eighth moon—a symbol of new beginnings and infinite 
                  possibilities. Each piece we create carries this spirit of renewal and hope.
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
              <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-accent/10" />
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-accent/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">What We Stand For</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              Our Values
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Our Journey</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              Milestones
            </h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
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
            Meet Our Artisans
          </h2>
          <p className="mt-4 text-lg text-accent-foreground/80">
            Behind every piece is a team of passionate craftspeople who pour their hearts into their work. 
            Our artisans combine generations of expertise with innovative techniques to create jewelry 
            that stands the test of time.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-background text-foreground px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
          >
            Visit Our Workshop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
