export type DesignTheme =
  | "streetwear"
  | "graphic"
  | "minimalist"
  | "anime"
  | "nature"
  | "typography"
  | "abstract"

export const DESIGN_THEME_OPTIONS: { value: DesignTheme; label: string }[] = [
  { value: "streetwear", label: "Streetwear" },
  { value: "graphic", label: "Graphic" },
  { value: "minimalist", label: "Minimalist" },
  { value: "anime", label: "Anime" },
  { value: "nature", label: "Nature" },
  { value: "typography", label: "Typography" },
  { value: "abstract", label: "Abstract" },
]

export type Product = {
  id: string
  name: string
  price: number
  category: "featured" | "tshirts" | "custom"
  designThemes: DesignTheme[]
  colors: string[]
  sizes: string[]
  description: string
  image: string
  images: {
    front: string
    back: string
    detail: string
  }
}

export const products: Product[] = [
  {
    id: "tee-001",
    name: "Cars 2 Edition Minimal Street Wear",
    price: 2225,
    category: "featured",
    designThemes: ["streetwear", "minimalist"],
    colors: ["Black", "White", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A clean everyday tee with premium DTF print. Vibrant colours, soft feel, built to last Round Neck Regular Fit.",
    image: "/dtf-001-back.png",
    images: {
      front: "/dtf-001-front.png",
      back: "/dtf-001-back.png",
      detail: "/dtf-001-detail.png",
    },
  },
  {
    id: "tee-002",
    name: "Dark Knight Vibes Graphic Tee",
    price: 2225,
    category: "tshirts",
    designThemes: ["minimalist", "typography"],
    colors: ["White", "Black", "Grey"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Stylish casual wear, trendy printed tees, breathable cotton t-shirt, unisex Round Neck Regular Fit.",
    image: "/dtf-002-back.png",
    images: {
      front: "/dtf-002-front.png",
      back: "/dtf-002-back.png",
      detail: "/dtf-002-detail.png",
    },
  },
  {
    id: "tee-003",
    name: "Life Is A Game Controller Edition Tee",
    price: 1700,
    category: "tshirts",
    designThemes: ["minimalist", "typography"],
    colors: ["White", "Black", "Grey"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Clean lines, simple design, maximum impact. The everyday minimalist tee Round Neck Regular Fit.",
    image: "/dtf-003-front.png",
    images: {
      front: "/dtf-003-front.png",
      back: "/dtf-003-back.png",
      detail: "/dtf-003-detail.png",
    },
  },
  {
    id: "tee-004",
    name: "Enjoy The Process Classic Tee",
    price: 1700,
    category: "featured",
    designThemes: ["abstract", "graphic"],
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Motivation artwork DTF-printed on premium cotton. One-of-a-kind wearable art Round Neck Regular Fit.",
    image: "/dtf-004-front.png",
    images: {
      front: "/dtf-004-front.png",
      back: "/dtf-004-back.png",
      detail: "/dtf-004-detail.png",
    },
  },
  {
    id: "tee-005",
    name: "Faith Over Fear Street Graphic Tee",
    price: 2225,
    category: "tshirts",
    designThemes: ["nature", "graphic"],
    colors: ["White", "Green", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Inspired by Rome's natural beauty. DTF printed with rich, fade-resistant colours Round Neck Regular Fit.",
    image: "/dtf-005-back.png",
    images: {
      front: "/dtf-005-front.png",
      back: "/dtf-005-back.png",
      detail: "/dtf-005-detail.png",
    },
  },
  {
    id: "tee-006",
    name: "M&M The Real Slim Shady Minimal Street Wear",
    price: 2225,
    category: "custom",
    designThemes: ["streetwear", "graphic"],
    colors: ["Black", "White", "Navy", "Red", "Grey"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Inspried by Real Slim Shady M&M Street wear Round Neck Regular Fit.",
    image: "/dtf-006-back.png",
    images: {
      front: "/dtf-006-front.png",
      back: "/dtf-006-back.png",
      detail: "/dtf-006-detail.png",
    },
  },
  {
    id: "tee-007",
    name: "Retro Speed BMW Graphic Tee",
    price: 2225,
    category: "tshirts",
    designThemes: ["minimalist", "typography"],
    colors: ["White", "Black", "Grey"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Car print t-shirts Clean lines, simple design, maximum impact. The everyday minimalist tee Round Neck Regular Fit.",
    image: "/dtf-007-back.png",
    images: {
      front: "/dtf-007-front.png",
      back: "/dtf-007-back.png",
      detail: "/dtf-007-detail.png",
    },
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getUtils() {
  return { cn: (...args: string[]) => args.filter(Boolean).join(" ") }
}
