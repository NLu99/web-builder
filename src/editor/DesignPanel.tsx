import { useState } from 'react'
import type { Site } from '../types'
import { useBuilderStore } from '../store'

export default function DesignPanel({ site, onClose }: { site: Site; onClose: () => void }) {
  const [tab, setTab] = useState<'colors' | 'typography' | 'buttons'>('colors')
  const updateColorToken = useBuilderStore((s) => s.updateColorToken)
  const addColorToken = useBuilderStore((s) => s.addColorToken)
  const updateButtonToken = useBuilderStore((s) => s.updateButtonToken)

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="h-full w-[320px] overflow-y-auto border-l border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">Design system</h3>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-600">
            ✕
          </button>
        </div>
        <div className="flex gap-1 border-b border-zinc-100 px-4 pt-3">
          {(['colors', 'typography', 'buttons'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-md px-3 py-2 text-xs font-medium capitalize ${
                tab === t ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'colors' && (
            <div className="space-y-3">
              {site.tokens.colors.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColorToken(site.id, c.id, e.target.value)}
                    className="h-8 w-8 flex-none rounded border border-zinc-200"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-zinc-800">{c.name}</div>
                    <div className="text-[11px] text-zinc-400">{c.hex}</div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addColorToken(site.id, `Color ${site.tokens.colors.length + 1}`, '#a1a1aa')}
                className="mt-2 w-full rounded-md border border-dashed border-zinc-300 py-2 text-xs font-medium text-zinc-500 hover:border-indigo-300 hover:text-indigo-600"
              >
                + Add color
              </button>
              <p className="pt-2 text-[11px] leading-relaxed text-zinc-400">
                Editing a color here updates every block using it across the whole site immediately.
              </p>
            </div>
          )}

          {tab === 'typography' && (
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-[11px] font-medium text-zinc-500">Heading font</div>
                <div className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">{site.tokens.headingFont}</div>
              </div>
              <div>
                <div className="mb-1 text-[11px] font-medium text-zinc-500">Body font</div>
                <div className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">{site.tokens.bodyFont}</div>
              </div>
              <div>
                <div className="mb-1 text-[11px] font-medium text-zinc-500">Base size</div>
                <div className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">{site.tokens.baseSize}px</div>
              </div>
            </div>
          )}

          {tab === 'buttons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 py-6">
                <div
                  style={{ background: site.tokens.button.fill, color: site.tokens.button.textColor, borderRadius: site.tokens.button.radius }}
                  className="px-4 py-2 text-sm font-semibold"
                >
                  Preview
                </div>
              </div>
              <div>
                <div className="mb-1 text-[11px] font-medium text-zinc-500">Fill</div>
                <input
                  type="color"
                  value={site.tokens.button.fill}
                  onChange={(e) => updateButtonToken(site.id, { fill: e.target.value })}
                  className="h-8 w-full rounded border border-zinc-200"
                />
              </div>
              <div>
                <div className="mb-1 text-[11px] font-medium text-zinc-500">Text color</div>
                <input
                  type="color"
                  value={site.tokens.button.textColor}
                  onChange={(e) => updateButtonToken(site.id, { textColor: e.target.value })}
                  className="h-8 w-full rounded border border-zinc-200"
                />
              </div>
              <div>
                <div className="mb-1 text-[11px] font-medium text-zinc-500">Corner radius: {site.tokens.button.radius}px</div>
                <input
                  type="range"
                  min={0}
                  max={32}
                  value={site.tokens.button.radius}
                  onChange={(e) => updateButtonToken(site.id, { radius: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <div className="mb-1 text-[11px] font-medium text-zinc-500">Size</div>
                <div className="flex gap-2">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateButtonToken(site.id, { size: sz })}
                      className={`flex-1 rounded-md border py-1.5 text-xs font-medium uppercase ${
                        site.tokens.button.size === sz ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
