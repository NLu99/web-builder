import type { Block, Page, Site } from '../types'
import { useBuilderStore } from '../store'

interface Props {
  site: Site
  page: Page
  block: Block | null
  sectionId: string | null
  viewport: 'desktop' | 'mobile'
  contentOnly: boolean
  overlay: boolean
  developerMode: boolean
  onClose: () => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-zinc-500">{label}</span>
      {children}
    </label>
  )
}

const inputCls = 'w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'

export default function AdvancedPanel({ site, page, block, sectionId, viewport, contentOnly, overlay, developerMode, onClose }: Props) {
  const updatePageSettings = useBuilderStore((s) => s.updatePageSettings)
  const updateBlockGeometry = useBuilderStore((s) => s.updateBlockGeometry)
  const updateBlockStyle = useBuilderStore((s) => s.updateBlockStyle)
  const reorderBlockLayer = useBuilderStore((s) => s.reorderBlockLayer)

  const geometry = viewport === 'mobile' ? block?.mobileGeometry ?? block?.geometry : block?.geometry
  const style = block ? (viewport === 'mobile' ? { ...block.style, ...block.mobileStyle } : block.style) : undefined

  function setGeometry(patch: Partial<Block['geometry']>) {
    if (!block || !geometry) return
    updateBlockGeometry(site.id, page.id, block.id, { ...geometry, ...patch }, viewport)
  }
  function setStyle(patch: Partial<Block['style']>) {
    if (!block) return
    updateBlockStyle(site.id, page.id, block.id, patch, viewport)
  }

  const body = !block ? (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-zinc-900">Page settings</h3>
      <Field label="Page title">
        <input className={inputCls} value={page.settings.title} onChange={(e) => updatePageSettings(site.id, page.id, { title: e.target.value })} />
      </Field>
      <Field label="Meta description">
        <textarea
          className={inputCls}
          rows={2}
          value={page.settings.metaDescription}
          onChange={(e) => updatePageSettings(site.id, page.id, { metaDescription: e.target.value })}
        />
      </Field>
      <Field label="URL slug">
        <input className={inputCls} value={page.settings.slug} onChange={(e) => updatePageSettings(site.id, page.id, { slug: e.target.value })} />
      </Field>
      <Field label="Page background">
        <input
          type="color"
          className="h-8 w-full rounded-md border border-zinc-200"
          value={page.settings.background}
          onChange={(e) => updatePageSettings(site.id, page.id, { background: e.target.value })}
        />
      </Field>
      <Field label="Visibility">
        <select
          className={inputCls}
          value={page.settings.visibility}
          onChange={(e) => updatePageSettings(site.id, page.id, { visibility: e.target.value as 'public' | 'password' })}
        >
          <option value="public">Public</option>
          <option value="password">Password protected</option>
        </select>
      </Field>
      {page.settings.visibility === 'password' && (
        <Field label="Password">
          <input
            className={inputCls}
            value={page.settings.password ?? ''}
            onChange={(e) => updatePageSettings(site.id, page.id, { password: e.target.value })}
          />
        </Field>
      )}
      {developerMode && (
        <Field label="Custom code (Developer, Layer 3)">
          <textarea
            className={`${inputCls} font-mono`}
            rows={4}
            placeholder="<!-- page-level HTML/JS -->"
            value={page.settings.customCode ?? ''}
            onChange={(e) => updatePageSettings(site.id, page.id, { customCode: e.target.value })}
          />
        </Field>
      )}
    </div>
  ) : contentOnly ? (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold capitalize text-zinc-900">{block.type} block</h3>
      <p className="text-xs text-zinc-500">
        Style and position editing needs a wider window. Widen the editor to fine-tune this block, or keep composing
        with the block library and Design tokens.
      </p>
    </div>
  ) : (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold capitalize text-zinc-900">{block.type} block</h3>

      <section className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Style</h4>
        {(block.type === 'image' || block.type === 'divider') && (
          <Field label="Fill">
            <div className="flex flex-wrap gap-1.5">
              {site.tokens.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setStyle({ bgToken: c.id })}
                  className={`h-6 w-6 rounded-full border ${style?.bgToken === c.id ? 'ring-2 ring-indigo-400' : 'border-zinc-300'}`}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </Field>
        )}
        {(block.type === 'text' || block.type === 'heading') && (
          <Field label="Text color">
            <div className="flex flex-wrap gap-1.5">
              {site.tokens.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setStyle({ colorToken: c.id })}
                  className={`h-6 w-6 rounded-full border ${style?.colorToken === c.id ? 'ring-2 ring-indigo-400' : 'border-zinc-300'}`}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </Field>
        )}
      </section>

      <section className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Position & size</h4>
        <div className="grid grid-cols-2 gap-2">
          <Field label="X">
            <input type="number" className={inputCls} value={geometry?.x ?? 0} onChange={(e) => setGeometry({ x: Number(e.target.value) })} />
          </Field>
          <Field label="Y">
            <input type="number" className={inputCls} value={geometry?.y ?? 0} onChange={(e) => setGeometry({ y: Number(e.target.value) })} />
          </Field>
          <Field label="Width">
            <input type="number" className={inputCls} value={geometry?.w ?? 0} onChange={(e) => setGeometry({ w: Number(e.target.value) })} />
          </Field>
          <Field label="Height">
            <input type="number" className={inputCls} value={geometry?.h ?? 0} onChange={(e) => setGeometry({ h: Number(e.target.value) })} />
          </Field>
        </div>
        <Field label="Layering">
          <div className="flex gap-2">
            <button
              onClick={() => sectionId && reorderBlockLayer(site.id, page.id, sectionId, block.id, 'front')}
              className="flex-1 rounded-md border border-zinc-200 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Bring to front
            </button>
            <button
              onClick={() => sectionId && reorderBlockLayer(site.id, page.id, sectionId, block.id, 'back')}
              className="flex-1 rounded-md border border-zinc-200 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Send to back
            </button>
          </div>
        </Field>
      </section>

      <section className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Spacing</h4>
        <Field label="Corner radius">
          <input
            type="range"
            min={0}
            max={48}
            value={style?.radius ?? 0}
            onChange={(e) => setStyle({ radius: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
      </section>

      <section className="space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Effects</h4>
        <Field label="Opacity">
          <input
            type="range"
            min={0}
            max={100}
            value={(style?.opacity ?? 1) * 100}
            onChange={(e) => setStyle({ opacity: Number(e.target.value) / 100 })}
            className="w-full"
          />
        </Field>
        <Field label="Rotation">
          <input
            type="range"
            min={-45}
            max={45}
            value={style?.rotation ?? 0}
            onChange={(e) => setStyle({ rotation: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
      </section>

      {developerMode && (
        <section className="space-y-3 border-t border-zinc-100 pt-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">Developer (Layer 3)</h4>
          <Field label="Custom CSS">
            <textarea
              className={`${inputCls} font-mono`}
              rows={4}
              placeholder="e.g. box-shadow: 0 1px 2px rgba(0,0,0,.1);"
              value={style?.customCss ?? ''}
              onChange={(e) => setStyle({ customCss: e.target.value })}
            />
          </Field>
        </section>
      )}
    </div>
  )

  const panel = (
    <div className="h-full w-[280px] flex-none overflow-y-auto border-l border-zinc-200 bg-white p-5">{body}</div>
  )

  if (!overlay) return panel

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="h-full shadow-xl">
        {panel}
      </div>
    </div>
  )
}
