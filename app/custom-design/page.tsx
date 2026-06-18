"use client"

import { useCallback, useState } from "react"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
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
  const [selectedFit, setSelectedFit] = useState<"Regular Fit" | "Oversized">("Regular Fit")
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

  const colors = ["Black", "White"]
  const sizes = ["M", "L", "XL"]
  const BASE_PRICE = 1750
  const baseSurcharge = selectedDtfSize === "A3" ? 100 : 0        // A4 = 0, A3 = +100
  const oversizeSurcharge = selectedFit === "Oversized"
    ? (selectedDtfSize === "A3" ? 400 : 200)                        // Oversized A3 = +400, A4 = +200
    : 0
  const finalPrice = BASE_PRICE + baseSurcharge + oversizeSurcharge
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

      <div className="page-container max-w-6xl">
        <PageHeader
          badge="Custom Builder"
          title="Create Your Tee"
          description="Upload your design, choose your fit, and build a premium custom DTF tee — crafted to ORBYT standards."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
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
                👕 Front View
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
                🔄 Back View
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
                        ? "bg-red-600/20 text-red-400 border border-red-600/30"
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
                  frontHasDesign ? "bg-red-600/80 text-white" : "bg-white/10 text-white/40"
                }`}
              >
                Front {frontHasDesign ? "✓" : "—"}
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  backHasDesign ? "bg-red-600/80 text-white" : "bg-white/10 text-white/40"
                }`}
              >
                Back {backHasDesign ? "✓" : "—"}
              </span>
            </div>
          </div>

          {/* ─── Right: Controls ─── */}
          <div className="space-y-6 max-w-md mx-auto w-full lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 space-y-5">
            <div className="flex flex-wrap justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-400">
                ⚡ Made to order — 3–5 days
              </span>
              <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-400">
                🛡️ File checked before printing
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                🇱🇰 Sri Lanka delivery
              </span>
            </div>

            {/* Color picker — visual swatches + dropdown */}
            <div className="space-y-3">
              <div>
                <label className="block text-white text-xs mb-2 font-semibold uppercase tracking-wider text-white/60">Color</label>
                <div className="flex gap-2 mb-2">
                  {colors.map((c) => {
                    const swatchMap: Record<string, string> = {
                      Black: "#1f1f1f",
                      White: "#ebebeb",
                    }
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === c
                            ? "border-red-600 scale-110 shadow-lg shadow-red-600/50"
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
                <label className="form-label-orbyt">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="input-orbyt"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-orbyt">Fit</label>
                <select
                  value={selectedFit}
                  onChange={(e) => setSelectedFit(e.target.value as "Regular Fit" | "Oversized")}
                  className="input-orbyt"
                >
                  <option value="Regular Fit">Regular Fit</option>
                  <option value="Oversized">Oversized</option>
                </select>
              </div>

              <div>
                <label className="form-label-orbyt">DTF Print Size</label>
                <select
                  value={selectedDtfSize}
                  onChange={(e) => setSelectedDtfSize(e.target.value as "A4" | "A3")}
                  className="input-orbyt"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-white font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((p) => p + 1)}
                    className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">Price</p>
                  <p className="text-red-500 font-bold text-lg">Rs. {finalPrice.toLocaleString("en-LK")}</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 text-center font-mono">Pricing Breakdown</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-white/60"><span>Base (Regular A4)</span><span>Rs. 1,750</span></div>
                  {baseSurcharge > 0 && <div className="flex justify-between text-white/60"><span>A3 Print Size</span><span>+Rs. {baseSurcharge}</span></div>}
                  {oversizeSurcharge > 0 && <div className="flex justify-between text-white/60"><span>Oversized Fit</span><span>+Rs. {oversizeSurcharge}</span></div>}
                  <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1 mt-1"><span>Total</span><span>Rs. {finalPrice.toLocaleString("en-LK")}</span></div>
                </div>
              </div>
            </div>

            {/* Upload section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm font-semibold uppercase tracking-wider text-white/60">Upload Design</p>
                <span className="text-xs text-red-400 font-semibold px-2 py-0.5 rounded-md bg-red-600/10 border border-red-600/20">
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
                className={`relative rounded-xl border-2 transition-all duration-200 ${
                  isFileDragging
                    ? "bg-red-600/20 border-red-500 scale-[1.02] border-dashed"
                    : "bg-red-600/5 border-red-600/30 hover:border-red-600/60 hover:bg-red-600/10"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="px-3 py-3 text-center text-white text-sm font-medium">
                  {currentDesigns[activeZone]?.image
                    ? `✅ ${zoneLabels[activeZone]} uploaded — click to replace`
                    : `Drag & Drop or Browse — uploads to ${zoneLabels[activeZone]}`}
                </div>
              </div>
              <p className="text-white/30 text-[10px] text-center font-mono">
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
                className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${
                  wished
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-white/10 text-white hover:bg-white/5 hover:border-red-600/50"
                }`}
                aria-label="Add custom tee to wishlist"
              >
                <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                className={`flex-1 rounded-xl py-3.5 font-semibold transition-all btn-primary ${
                  cartPressed ? "bg-green-600 hover:bg-green-600 scale-[0.98]" : ""
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
                      fit: selectedFit,
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
      </div>
    </main>
  )
}
