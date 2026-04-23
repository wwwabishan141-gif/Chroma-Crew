"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Move, ZoomIn, RotateCw, Trash2, Info } from "lucide-react"

/* ── types ── */
export type MockupSide = "front" | "back"
export type DesignZone = "center" | "leftChest" | "rightChest"

export type DesignState = {
  image: string | null
  offsetX: number
  offsetY: number
  scale: number
  rotation: number
}

export const defaultDesign = (): DesignState => ({
  image: null, offsetX: 0, offsetY: 0, scale: 1, rotation: 0,
})

/* ── color map ── */
const SHIRT_COLORS: Record<string, { body: string; shadow: string; hi: string }> = {
  Red:   { body: "#c53030", shadow: "#9b2c2c", hi: "#e53e3e" },
  Black: { body: "#1f1f1f", shadow: "#111",    hi: "#333" },
  White: { body: "#ebebeb", shadow: "#d4d4d4", hi: "#fff" },
  Navy:  { body: "#1e3a5f", shadow: "#152940", hi: "#2d5a8a" },
  Grey:  { body: "#71717a", shadow: "#52525b", hi: "#a1a1aa" },
}

/* ── zone geometry (% of container) ── */
const FRONT_ZONES: Record<string, { label: string; left: number; top: number; w: number; h: number }> = {
  leftChest:  { label: "Left Chest",  left: 28, top: 21, w: 13, h: 11 },
  rightChest: { label: "Right Chest", left: 57, top: 21, w: 13, h: 11 },
  center:     { label: "Center Print",left: 26, top: 35, w: 46, h: 32 },
}
const BACK_ZONES: Record<string, { label: string; left: number; top: number; w: number; h: number }> = {
  center: { label: "Center Print", left: 24, top: 22, w: 50, h: 40 },
}

/* ── props ── */
interface Props {
  color: string
  side: MockupSide
  activeZone: DesignZone
  designs: Record<string, DesignState>
  onZoneSelect: (z: DesignZone) => void
  onDesignUpdate: (zone: string, d: Partial<DesignState>) => void
}

export function TShirtEditor({ color, side, activeZone, designs, onZoneSelect, onDesignUpdate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const sc = SHIRT_COLORS[color] || SHIRT_COLORS.Black
  const isLight = color === "White"
  const stroke = isLight ? "#aaa" : sc.hi
  const zones = side === "front" ? FRONT_ZONES : BACK_ZONES
  const active = designs[activeZone]

  /* ── drag logic ── */
  const onMouseDown = useCallback((e: React.MouseEvent, zone: string) => {
    if (!designs[zone]?.image) return
    e.preventDefault()
    e.stopPropagation()
    onZoneSelect(zone as DesignZone)
    setDragging(true)
    dragRef.current = { x: e.clientX, y: e.clientY, ox: designs[zone].offsetX, oy: designs[zone].offsetY }
  }, [designs, onZoneSelect])

  useEffect(() => {
    if (!dragging) return
    const move = (e: MouseEvent) => {
      if (!dragRef.current || !containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      const dx = ((e.clientX - dragRef.current.x) / r.width) * 100
      const dy = ((e.clientY - dragRef.current.y) / r.height) * 100
      onDesignUpdate(activeZone, {
        offsetX: Math.max(-25, Math.min(25, dragRef.current.ox + dx)),
        offsetY: Math.max(-25, Math.min(25, dragRef.current.oy + dy)),
      })
    }
    const up = () => { setDragging(false); dragRef.current = null }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up) }
  }, [dragging, activeZone, onDesignUpdate])

  /* ── inline SVG ── */
  const sleeves = (
    <>
      <path d="M200,160 L100,240 L140,320 L200,280 Z" fill={sc.shadow} stroke={stroke} strokeWidth="4"/>
      <path d="M600,160 L700,240 L660,320 L600,280 Z" fill={sc.shadow} stroke={stroke} strokeWidth="4"/>
    </>
  )
  const shading = (
    <>
      <path d="M200,160 L200,820 Q200,860 240,860 L280,860 L280,160 Z" fill="rgba(0,0,0,0.06)"/>
      <path d="M520,160 L600,160 L600,820 Q600,860 560,860 L520,860 Z" fill="rgba(0,0,0,0.06)"/>
    </>
  )
  const frontBody = "M200,160 L200,820 Q200,860 240,860 L560,860 Q600,860 600,820 L600,160 L520,120 Q480,100 460,120 L440,150 Q400,190 360,150 L340,120 Q320,100 280,120 Z"
  const backBody  = "M200,160 L200,820 Q200,860 240,860 L560,860 Q600,860 600,820 L600,160 L520,120 Q480,100 460,120 L440,140 Q400,160 360,140 L340,120 Q320,100 280,120 Z"

  return (
    <div className="space-y-3">
      {/* mockup */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/5] rounded-2xl border border-white/10 overflow-hidden select-none bg-[#0a0a0a]"
        style={{ cursor: dragging ? "grabbing" : "default" }}
      >
        {/* SVG shirt */}
        <svg viewBox="0 0 800 1000" className="absolute inset-0 w-full h-full">
          {sleeves}
          <path d={side === "front" ? frontBody : backBody} fill={sc.body} stroke={stroke} strokeWidth="4"/>
          {side === "front"
            ? <path d="M340,120 L360,150 Q400,190 440,150 L460,120 Q440,105 400,100 Q360,105 340,120 Z" fill={sc.shadow} stroke={stroke} strokeWidth="3"/>
            : <>
                <path d="M340,120 L360,140 Q400,160 440,140 L460,120 Q440,108 400,105 Q360,108 340,120 Z" fill={sc.shadow} stroke={stroke} strokeWidth="3"/>
                <line x1="400" y1="160" x2="400" y2="860" stroke="rgba(0,0,0,0.08)" strokeWidth="2"/>
              </>
          }
          {shading}
        </svg>

        {/* design zones */}
        {Object.entries(zones).map(([key, z]) => {
          const d = designs[key]
          const isAct = activeZone === key
          return (
            <div
              key={key}
              onClick={(e) => { e.stopPropagation(); onZoneSelect(key as DesignZone) }}
              onMouseDown={(e) => onMouseDown(e, key)}
              className="absolute rounded-lg transition-all"
              style={{
                left: `${z.left}%`, top: `${z.top}%`, width: `${z.w}%`, height: `${z.h}%`,
                outline: isAct ? "2px solid rgba(255,255,255,0.5)" : "1px dashed rgba(255,255,255,0.15)",
                outlineOffset: "2px",
                zIndex: isAct ? 10 : 1,
              }}
            >
              {d?.image ? (
                <div className="w-full h-full flex items-center justify-center overflow-visible">
                  <img
                    src={d.image}
                    alt={`${key} design`}
                    draggable={false}
                    className="max-w-full max-h-full object-contain pointer-events-none"
                    style={{
                      transform: `translate(${d.offsetX}%, ${d.offsetY}%) scale(${d.scale}) rotate(${d.rotation}deg)`,
                      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
                      transition: dragging ? "none" : "transform 0.15s ease",
                    }}
                  />
                  {isAct && !dragging && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur rounded px-2 py-0.5 text-[10px] text-white/70 whitespace-nowrap">
                      <Move className="w-2.5 h-2.5"/> drag to move
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-white/25 text-[10px] md:text-xs text-center px-1">
                  <span>{z.label}</span>
                </div>
              )}
            </div>
          )
        })}

        {/* editing hint banner */}
        <div className="absolute top-2 left-2 right-2 flex justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-[10px] text-white/50">
            <Info className="w-3 h-3"/>
            Click a zone, upload artwork, then drag / resize / rotate
          </div>
        </div>
      </div>

      {/* edit toolbar */}
      {active?.image && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">
              Editing: {zones[activeZone]?.label || activeZone}
            </span>
            <button
              onClick={() => onDesignUpdate(activeZone, defaultDesign())}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3"/> Remove
            </button>
          </div>
          {/* scale */}
          <div className="flex items-center gap-3">
            <ZoomIn className="w-3.5 h-3.5 text-white/40 shrink-0"/>
            <input
              type="range" min="30" max="250" value={Math.round(active.scale * 100)}
              onChange={(e) => onDesignUpdate(activeZone, { scale: Number(e.target.value) / 100 })}
              className="flex-1 accent-red-500 h-1"
            />
            <span className="text-[10px] text-white/40 w-8 text-right">{Math.round(active.scale * 100)}%</span>
          </div>
          {/* rotation */}
          <div className="flex items-center gap-3">
            <RotateCw className="w-3.5 h-3.5 text-white/40 shrink-0"/>
            <input
              type="range" min="-180" max="180" value={active.rotation}
              onChange={(e) => onDesignUpdate(activeZone, { rotation: Number(e.target.value) })}
              className="flex-1 accent-red-500 h-1"
            />
            <span className="text-[10px] text-white/40 w-8 text-right">{active.rotation}°</span>
          </div>
        </div>
      )}
    </div>
  )
}
