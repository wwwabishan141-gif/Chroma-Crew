interface PageHeaderProps {
  badge?: string
  title: string
  description?: string
  centered?: boolean
}

export function PageHeader({ badge, title, description, centered = true }: PageHeaderProps) {
  return (
    <div className={`mb-10 md:mb-12 space-y-4 ${centered ? "text-center" : ""}`}>
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
          {badge}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-black tracking-tight uppercase">
        {title}
      </h1>
      {description && (
        <p className={`text-white/65 text-sm md:text-base leading-relaxed max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  )
}
