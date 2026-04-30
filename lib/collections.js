export const COLLECTION_STORAGE_KEY = "octavaluna_collections"

export const defaultFeaturedCollection = {
  name: "Luna Collection",
  tagline: "New Arrival",
  description: "A celebration of moonlight-inspired jewelry with luminous textures and graceful silhouettes.",
  image: "/elegant-gold-jewelry-necklace-on-cream-silk-fabric.jpg",
  href: "/collections/luna",
}

export const defaultCollections = [
  {
    id: 1,
    name: "Celestial Dreams",
    description: "Inspired by stars and crescent forms for a timeless celestial look.",
    pieces: 12,
    image: "/crescent-moon-gold-necklace-luxury-jewelry.jpg",
    href: "/collections/celestial",
  },
  {
    id: 2,
    name: "Eternal Gold",
    description: "Classic polished gold pieces designed to elevate everyday elegance.",
    pieces: 18,
    image: "/gold-band-ring-with-small-diamonds-luxury.jpg",
    href: "/collections/eternal",
  },
  {
    id: 3,
    name: "Pearl Essence",
    description: "Soft luminous pearls paired with delicate gold for refined styling.",
    pieces: 8,
    image: "/pearl-pendant-gold-necklace-luxury-elegant.jpg",
    href: "/collections/pearl-essence",
  },
  {
    id: 4,
    name: "Minimalist Luxe",
    description: "Clean and modern silhouettes for understated luxury statements.",
    pieces: 15,
    image: "/gold-signet-ring-minimalist-luxury.jpg",
    href: "/collections/minimalist",
  },
]

export function parseStoredCollections(value) {
  if (!value) return null

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function parseStoredFeaturedCollection(value) {
  if (!value) return null

  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

