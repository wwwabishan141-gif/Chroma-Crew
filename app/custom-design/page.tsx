"use client"

import { useCallback, useState } from "react"
import { Header } from "@/components/header"
import { useShop } from "@/components/shop-provider"
import { useShop } from "@/components/shop-provider"
import { Heart, Check } from "lucide-react"
import { toast } from "sonner"
import {
  TShirtEditor,
  defaultDesign,
  type MockupSide,
  type DesignZone,
  type DesignState,
} from "@/components/tshirt-editor"
import { compressImage } from "@/lib/image-utils"

export default function CustomDesignPage() {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const [selectedColor, setSelectedColor] = useState("Black")
  const [selectedSize, setSelectedSize] = useState("XL")
  const [selectedDtfSize, setSelectedDtfSize] = useState<"A4" | "A3">("A4")
  const [quantity, setQuantity] = useState(1)
  const [cartPressed, setCartPressed] = useState(false)
  const [activeSide, setActiveSide] = useState<MockupSide>("front")
  const [activeZone, setActiveZone] = useState<DesignZone>("center")
  const [isFileDragging, setIsFileDragging] = useState(false)

  const [frontDesigns, setFrontDesigns] = useState<Record<string, DesignState>>({
    center: defaultDesign(),
    leftChest: defaultDesign(),
    rightChest: defaultDesign(),
  })
  const [backDesigns, setBackDesigns] = useState<Record<string, DesignState>>({
    center: defaultDesign(),
  })

  const colors = ["Red", "Black", "White", "Navy", "Grey"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const customPrice = 2450
  const dtfSurcharge = selectedDtfSize === "A3" ? 400 : 0
  const finalPrice = customPrice + dtfSurcharge
  const wished = isWishlisted("custom-dtf")

  const currentDesigns = activeSide === "front" ? frontDesigns : backDesigns

  const updateDesign = useCallback((zone: string, updates: Partial<DesignState>) => {
    if (activeSide === "front") {
      setFrontDesigns((prev) => ({ ...prev, [zone]: { ...prev[zone], ...updates } }))
    } else {
      setBackDesigns((prev) => ({ ...prev, [zone]: { ...prev[zone], ...updates } }))
    }
  }, [activeSide])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string) || null
      if (base64) {
        const compressed = await compressImage(base64)
        updateDesign(activeZone, { image: compressed })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsFileDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (!file || !file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string) || null
        if (base64) {
          const compressed = await compressImage(base64)
          updateDesign(activeZone, { image: compressed })
        }
      }
      reader.readAsDataURL(file)
    },
    [activeZone, updateDesign],
  )

  /* count how many sides have at least one design */
  const frontHasDesign = Object.values(frontDesigns).some((d) => d.image)
  const backHasDesign = Object.values(backDesigns).some((d) => d.image)

  /* zone label helpers */
  const zoneLabels: Record<string, string> = {
    center: "Center Print",
    leftChest: "Left Chest",
    rightChest: "Right Chest",
  }

  return (
    <main className="min-h-screen bg-background flex-1">
      <Header currentPage="custom-design" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          {/* ─── Left: Mockup editor ─── */}
          <div className="space-y-4">
            {/* Front / Back toggle */}
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setActiveSide("front")
                  setActiveZone("center")
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeSide === "front"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                }`}
              >
                👕 {t("front_view")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSide("back")
                  setActiveZone("center")
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeSide === "back"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                }`}
              >
                🔄 {t("back_view")}
              </button>
            </div>

            {/* Zone selector (front only has multiple zones) */}
            {activeSide === "front" && (
              <div className="flex gap-2 justify-center">
                {(["leftChest", "center", "rightChest"] as DesignZone[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveZone(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeZone === key
                        ? "bg-white/15 text-white border border-white/25"
                        : "bg-white/5 text-white/40 border border-white/[0.08] hover:bg-white/10"
                    }`}
                  >
                    {zoneLabels[key]}
                    {currentDesigns[key]?.image ? " ✓" : ""}
                  </button>
                ))}
              </div>
            )}

            {/* Interactive T-shirt editor */}
            <TShirtEditor
              color={selectedColor}
              side={activeSide}
              activeZone={activeZone}
              designs={currentDesigns}
              onZoneSelect={setActiveZone}
              onDesignUpdate={updateDesign}
            />

            {/* Status badges */}
            <div className="flex gap-2 justify-center">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  frontHasDesign ? "bg-green-600/80 text-white" : "bg-white/10 text-white/40"
                }`}
              >
                Front {frontHasDesign ? "✓" : "—"}
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  backHasDesign ? "bg-green-600/80 text-white" : "bg-white/10 text-white/40"
                }`}
              >
                Back {backHasDesign ? "✓" : "—"}
              </span>
            </div>
          </div>

          {/* ─── Right: Controls ─── */}
          <div className="space-y-5 max-w-md mx-auto w-full">
            <h1 className="text-3xl text-white text-center">Custom DTF T-Shirt Builder</h1>
            <p className="text-white/70 text-center">
              Upload your print-ready design, pick color and size, then add to cart.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55">
                🎨 Made to order — 3–5 days
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55">
                ✅ File checked before printing
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55">
                🇱🇰 Sri Lanka delivery
              </span>
            </div>

            {/* Color picker — visual swatches + dropdown */}
            <div className="space-y-3">
              <div>
                <label className="block text-white text-xs mb-2">Color</label>
                <div className="flex gap-2 mb-2">
                  {colors.map((c) => {
                    const swatchMap: Record<string, string> = {
                      Red: "#c53030",
                      Black: "#1f1f1f",
                      White: "#ebebeb",
                      Navy: "#1e3a5f",
                      Grey: "#71717a",
                    }
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === c
                            ? "border-red-500 scale-110 shadow-lg shadow-red-600/30"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        style={{ backgroundColor: swatchMap[c] }}
                        title={c}
                      />
                    )
                  })}
                </div>
                <span className="text-white/50 text-xs">Selected: {selectedColor}</span>
              </div>

              <div>
                <label className="block text-white text-xs mb-1">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-black/80 border-2 border-red-600 rounded-xl px-3 py-2 text-white"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-xs mb-1">DTF Print Size</label>
                <select
                  value={selectedDtfSize}
                  onChange={(e) => setSelectedDtfSize(e.target.value as "A4" | "A3")}
                  className="w-full bg-black/80 border-2 border-red-600 rounded-xl px-3 py-2 text-white"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                </select>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center bg-red-600 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 text-white"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-white">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((p) => p + 1)} className="w-8 h-8 text-white">
                    +
                  </button>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium">
                 Contact us for more information
                </div>
              </div>
              <p className="text-white/60 text-[10px] text-center">
                Custom orders require direct confirmation for accurate pricing.
              </p>
            </div>

            {/* Upload section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm">Upload Design</p>
                <span className="text-xs text-red-400 font-medium px-2 py-0.5 rounded-md bg-red-600/10 border border-red-600/20">
                  → {zoneLabels[activeZone]} ({activeSide})
                </span>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsFileDragging(true)
                }}
                onDragLeave={() => setIsFileDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-red-600 transition-all duration-200 ${
                  isFileDragging ? "bg-red-600/20 scale-[1.02] border-dashed" : "bg-red-600/90"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="px-3 py-2 text-center text-white text-sm">
                  {currentDesigns[activeZone]?.image
                    ? `✅ ${zoneLabels[activeZone]} uploaded — click to replace`
                    : `Drag & Drop or Browse — uploads to ${zoneLabels[activeZone]}`}
                </div>
              </div>
              <p className="text-white/30 text-xs text-center">
                Select a zone above, then upload. Drag to reposition, use sliders to resize &amp; rotate.
              </p>
            </div>

            {/* Add to cart */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  toggleWishlist({
                    id: "custom-dtf",
                    name: "Custom DTF T-Shirt",
                    price: finalPrice,
                    image: frontDesigns.center.image ?? "/placeholder.svg",
                  })
                }
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                  wished ? "bg-red-600 border-red-600 text-white" : "border-red-600 text-red-500 hover:bg-red-600/10"
                }`}
                aria-label="Add custom tee to wishlist"
              >
                <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                className={`flex-1 rounded-xl py-3 font-semibold transition-all ${
                  cartPressed ? "bg-green-600 text-white scale-[0.98]" : "bg-white text-black"
                }`}
                onClick={() => {
                  let placementStr = []
                  let customImagesList = []
                  if (frontDesigns.center.image) {
                    placementStr.push("Front Center")
                    customImagesList.push({ placement: "Front Center", image: frontDesigns.center.image })
                  }
                  if (frontDesigns.leftChest.image) {
                    placementStr.push("Front Left Chest")
                    customImagesList.push({ placement: "Front Left Chest", image: frontDesigns.leftChest.image })
                  }
                  if (frontDesigns.rightChest.image) {
                    placementStr.push("Front Right Chest")
                    customImagesList.push({ placement: "Front Right Chest", image: frontDesigns.rightChest.image })
                  }
                  if (backDesigns.center.image) {
                    placementStr.push("Back Center")
                    customImagesList.push({ placement: "Back Center", image: backDesigns.center.image })
                  }
                  const placement = placementStr.join(" + ") || "Unknown"

                  const combinedDesign = customImagesList.length > 0 ? customImagesList[0].image : undefined
                  
                  addToCart(
                    {
                      id: "custom-dtf",
                      name: "Custom DTF T-Shirt",
                      price: finalPrice,
                      color: selectedColor,
                      size: selectedSize,
                      dtfSize: selectedDtfSize,
                      customImage: combinedDesign ?? undefined,
                      customImages: customImagesList,
                      customPlacement: combinedDesign ? placement : undefined,
                    },
                    quantity,
                  )
                  setCartPressed(true)
                  toast.success("Fresh drip added to cart!", {
                    description: `${quantity}x Custom DTF T-Shirt ready for production.`,
                    action: {
                      label: "View Cart",
                      onClick: () => (window.location.href = "/cart"),
                    },
                  })
                  setTimeout(() => setCartPressed(false), 700)
                }}
              >
                {cartPressed ? (
                  <span className="inline-flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Added!
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
