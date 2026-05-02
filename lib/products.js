export const PRODUCT_STORAGE_KEY = "octavaluna_products"

export const defaultProducts = [
  {
    id: 1,
    name: "Luna Crescent Necklace",
    price: 385,
    category: "Necklaces",
    image: "/crescent-moon-gold-necklace-luxury-jewelry.jpg",
    photos: ["/crescent-moon-gold-necklace-luxury-jewelry.jpg"],
    description: "A delicate crescent pendant in polished gold, designed for elegant everyday wear.",
    descriptions: {
      en: "A delicate crescent pendant in polished gold, designed for elegant everyday wear.",
      es: "Un delicado dije de luna creciente en oro pulido, diseñado para un uso diario elegante.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/luna-crescent-necklace",
  },
  {
    id: 2,
    name: "Celestial Band Ring",
    price: 225,
    category: "Rings",
    image: "/gold-band-ring-with-small-diamonds-luxury.jpg",
    photos: ["/gold-band-ring-with-small-diamonds-luxury.jpg"],
    description: "A timeless gold band with subtle stone accents that catch the light.",
    descriptions: {
      en: "A timeless gold band with subtle stone accents that catch the light.",
      es: "Una argolla de oro atemporal con delicados acentos de piedra que capturan la luz.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/celestial-band-ring",
  },
  {
    id: 3,
    name: "Aurora Drop Earrings",
    price: 295,
    category: "Earrings",
    image: "/gold-drop-earrings-elegant-luxury.jpg",
    photos: ["/gold-drop-earrings-elegant-luxury.jpg"],
    description: "Graceful drop earrings with a refined silhouette for statement evenings.",
    descriptions: {
      en: "Graceful drop earrings with a refined silhouette for statement evenings.",
      es: "Aretes colgantes elegantes con una silueta refinada para noches especiales.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/aurora-drop-earrings",
  },
  {
    id: 4,
    name: "Solstice Pearl Pendant",
    price: 445,
    category: "Necklaces",
    image: "/pearl-pendant-gold-necklace-luxury-elegant.jpg",
    photos: ["/pearl-pendant-gold-necklace-luxury-elegant.jpg"],
    description: "A luminous pearl centerpiece suspended from a soft gold chain.",
    descriptions: {
      en: "A luminous pearl centerpiece suspended from a soft gold chain.",
      es: "Una perla luminosa suspendida de una delicada cadena de oro.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/solstice-pearl-pendant",
  },
  {
    id: 5,
    name: "Starlight Hoops",
    price: 265,
    category: "Earrings",
    image: "/gold-hoop-earrings-classic-luxury.jpg",
    photos: ["/gold-hoop-earrings-classic-luxury.jpg"],
    description: "Classic hoop earrings elevated with a modern polished finish.",
    descriptions: {
      en: "Classic hoop earrings elevated with a modern polished finish.",
      es: "Argollas clásicas elevadas con un acabado moderno y pulido.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/starlight-hoops",
  },
  {
    id: 6,
    name: "Eclipse Signet Ring",
    price: 320,
    category: "Rings",
    image: "/gold-signet-ring-minimalist-luxury.jpg",
    photos: ["/gold-signet-ring-minimalist-luxury.jpg"],
    description: "A bold signet profile with clean lines and balanced proportions.",
    descriptions: {
      en: "A bold signet profile with clean lines and balanced proportions.",
      es: "Un anillo tipo sello audaz con líneas limpias y proporciones equilibradas.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/eclipse-signet-ring",
  },
  {
    id: 7,
    name: "Moonstone Pendant",
    price: 425,
    category: "Necklaces",
    image: "/gold-necklace-pendant-luxury-jewelry-on-cream-back.jpg",
    photos: ["/gold-necklace-pendant-luxury-jewelry-on-cream-back.jpg"],
    description: "An iridescent moonstone pendant crafted to highlight natural glow.",
    descriptions: {
      en: "An iridescent moonstone pendant crafted to highlight natural glow.",
      es: "Un dije de piedra lunar iridiscente creado para resaltar su brillo natural.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/moonstone-pendant",
  },
  {
    id: 8,
    name: "Diamond Eternity Ring",
    price: 595,
    category: "Rings",
    image: "/gold-diamond-ring-luxury-jewelry-on-cream-backgrou.jpg",
    photos: ["/gold-diamond-ring-luxury-jewelry-on-cream-backgrou.jpg"],
    description: "A luxurious eternity ring set with shimmering stones across the band.",
    descriptions: {
      en: "A luxurious eternity ring set with shimmering stones across the band.",
      es: "Un lujoso anillo eternity con piedras brillantes alrededor de la banda.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/diamond-eternity-ring",
  },
  {
    id: 9,
    name: "Cascade Drop Earrings",
    price: 345,
    category: "Earrings",
    image: "/gold-earrings-drop-luxury-jewelry-on-cream-backgro.jpg",
    photos: ["/gold-earrings-drop-luxury-jewelry-on-cream-backgro.jpg"],
    description: "Layered drops create movement and sparkle for sophisticated styling.",
    descriptions: {
      en: "Layered drops create movement and sparkle for sophisticated styling.",
      es: "Caídas en capas crean movimiento y brillo para un estilo sofisticado.",
    },
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/cascade-drop-earrings",
  },
]

export function normalizeProduct(product) {
  const photos =
    Array.isArray(product.photos) && product.photos.length > 0
      ? product.photos.filter((photo) => typeof photo === "string" && photo.trim().length > 0)
      : [product.image].filter(Boolean)

  const primaryPhoto = photos[0] || "/placeholder.svg"

  const categoryRaw = typeof product.category === "string" ? product.category.trim() : ""
  const fallbackDescription = typeof product.description === "string" ? product.description : ""
  const descriptions =
    product.descriptions && typeof product.descriptions === "object"
      ? {
          en: typeof product.descriptions.en === "string" ? product.descriptions.en : fallbackDescription,
          es: typeof product.descriptions.es === "string" ? product.descriptions.es : fallbackDescription,
        }
      : {
          en: fallbackDescription,
          es: fallbackDescription,
        }

  return {
    ...product,
    image: primaryPhoto,
    photos,
    description: descriptions.en,
    descriptions,
    category: categoryRaw || "Uncategorized",
    discountPercent: Math.max(0, Math.min(100, Number(product.discountPercent) || 0)),
    inventory: Math.max(0, Math.floor(Number(product.inventory) || 0)),
    unitsSoldTotal: Math.max(0, Math.floor(Number(product.unitsSoldTotal) || 0)),
  }
}

export function getProductDescription(product, language = "en") {
  const descriptions = product?.descriptions
  if (descriptions && typeof descriptions === "object") {
    const translated = descriptions[language]
    if (typeof translated === "string" && translated.trim()) return translated
    if (typeof descriptions.en === "string" && descriptions.en.trim()) return descriptions.en
  }
  return typeof product?.description === "string" ? product.description : ""
}

export function getDiscountedPrice(price, discountPercent) {
  const discount = Math.max(0, Math.min(100, Number(discountPercent) || 0))
  const safePrice = Number(price) || 0
  return safePrice * (1 - discount / 100)
}

export function parseStoredProducts(value) {
  if (!value) return null

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return null
    return parsed.map(normalizeProduct)
  } catch {
    return null
  }
}
