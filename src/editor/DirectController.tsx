import type { Block, Site } from '../types'
import { useBuilderStore } from '../store'

interface Props {
  siteId: string
  pageId: string
  block: Block
  site: Site
  viewport: 'desktop' | 'mobile'
  showAdvancedToggle: boolean
  advancedOpen: boolean
  onToggleAdvanced: () => void
}

export default function DirectController({ siteId, pageId, block, site, viewport, showAdvancedToggle, advancedOpen, onToggleAdvanced }: Props) {
  const updateBlockStyle = useBuilderStore((s) => s.updateBlockStyle)
  const style = viewport === 'mobile' && block.mobileStyle ? { ...block.style, ...block.mobileStyle } : block.style

  function set(patch: Partial<Block['style']>) {
    updateBlockStyle(siteId, pageId, block.id, patch, viewport)
  }

  return (
    <div
      className="absolute bottom-full left-0 z-30 mb-2 flex w-max items-center gap-1 rounded-lg border border-zinc-200 bg-white px-1.5 py-1 shadow-lg"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {(block.type === 'heading' || block.type === 'text') && (
        <>
          <select
            aria-label="Font size"
            value={style.fontSize ?? 16}
            onChange={(e) => set({ fontSize: Number(e.target.value) })}
            className="rounded border border-zinc-200 bg-white px-1.5 py-1 text-xs"
          >
            {[12, 13, 14, 16, 18, 20, 24, 28, 32, 40, 44, 56].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            aria-label="Bold"
            onClick={() => set({ fontWeight: style.fontWeight && style.fontWeight >= 600 ? 400 : 700 })}
            className={`h-7 w-7 rounded text-xs font-bold ${style.fontWeight && style.fontWeight >= 600 ? 'bg-indigo-100 text-indigo-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
          >
            B
          </button>
          {(['left', 'center', 'right'] as const).map((a) => (
            <button
              key={a}
              aria-label={`Align ${a}`}
              onClick={() => set({ textAlign: a })}
              className={`h-7 w-7 rounded text-xs ${style.textAlign === a ? 'bg-indigo-100 text-indigo-700' : 'text-zinc-500 hover:bg-zinc-100'}`}
            >
              {a === 'left' ? '⟸' : a === 'center' ? '⟺' : '⟹'}
            </button>
          ))}
          <div className="mx-0.5 h-5 w-px bg-zinc-200" />
          <div className="flex items-center gap-1">
            {site.tokens.colors.slice(0, 5).map((c) => (
              <button
                key={c.id}
                aria-label={`Color ${c.name}`}
                onClick={() => set({ colorToken: c.id, color: undefined })}
                className={`h-5 w-5 rounded-full border ${style.colorToken === c.id ? 'ring-2 ring-indigo-400' : 'border-zinc-300'}`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </>
      )}

      {block.type === 'image' && (
        <>
          <button className="rounded px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100">Replace</button>
          <button className="rounded px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100">Crop</button>
          <input
            aria-label="Alt text"
            placeholder="Alt text"
            defaultValue={block.alt ?? ''}
            className="w-24 rounded border border-zinc-200 px-1.5 py-1 text-xs"
          />
        </>
      )}

      {block.type === 'divider' && (
        <div className="flex items-center gap-1">
          {site.tokens.colors.slice(0, 5).map((c) => (
            <button
              key={c.id}
              aria-label={`Color ${c.name}`}
              onClick={() => set({ bgToken: c.id })}
              className={`h-5 w-5 rounded-full border ${style.bgToken === c.id ? 'ring-2 ring-indigo-400' : 'border-zinc-300'}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      )}

      {showAdvancedToggle && (
        <>
          <div className="mx-0.5 h-5 w-px bg-zinc-200" />
          <button
            onClick={onToggleAdvanced}
            className={`rounded px-2 py-1 text-xs font-medium ${advancedOpen ? 'bg-indigo-100 text-indigo-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
          >
            Advanced …
          </button>
        </>
      )}
    </div>
  )
}
