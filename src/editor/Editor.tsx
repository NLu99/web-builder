import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBuilderStore } from '../store'
import { CONTENT_ONLY_BREAKPOINT, DESKTOP_WIDTH, MOBILE_WIDTH, OVERLAY_BREAKPOINT } from './constants'
import { getEffectiveGeometries, countUnadjustedMobileBlocks, sectionMobileHeight } from './layout'
import CanvasBlock from './CanvasBlock'
import AdvancedPanel from './AdvancedPanel'
import BlockPicker from './BlockPicker'
import DesignPanel from './DesignPanel'
import PublishModal from './PublishModal'
import type { BlockType } from '../types'

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth)
  useEffect(() => {
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}

export default function Editor() {
  const { siteId, pageId } = useParams()
  const navigate = useNavigate()
  const site = useBuilderStore((s) => s.sites.find((x) => x.id === siteId))
  const page = site?.pages.find((p) => p.id === pageId)
  const account = useBuilderStore((s) => s.account)
  const addBlock = useBuilderStore((s) => s.addBlock)
  const addSection = useBuilderStore((s) => s.addSection)
  const renameSite = useBuilderStore((s) => s.renameSite)

  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [panelOpenInvoke, setPanelOpenInvoke] = useState(false)
  const [pageSettingsOpenNarrow, setPageSettingsOpenNarrow] = useState(false)
  const [blockPickerFor, setBlockPickerFor] = useState<string | null>(null)
  const [designPanelOpen, setDesignPanelOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  const width = useWindowWidth()
  const overlayMode = width < OVERLAY_BREAKPOINT
  const contentOnly = width < CONTENT_ONLY_BREAKPOINT

  useEffect(() => {
    setPanelOpenInvoke(false)
  }, [selectedBlockId])

  if (!site || !page) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-zinc-400">Site not found.</div>
  }

  const selectedBlock = selectedBlockId
    ? page.sections.flatMap((s) => s.blocks).find((b) => b.id === selectedBlockId) ?? null
    : null
  const selectedSection = selectedBlockId
    ? page.sections.find((s) => s.blocks.some((b) => b.id === selectedBlockId)) ?? null
    : null

  const panelVisible = selectedBlock
    ? account.advancedPanel === 'always' || panelOpenInvoke
    : overlayMode
    ? pageSettingsOpenNarrow
    : true

  function selectBlock(id: string | null) {
    setSelectedBlockId(id)
  }

  function deselect(e: React.PointerEvent) {
    if (e.target === e.currentTarget) selectBlock(null)
  }

  const canvasWidth = viewport === 'desktop' ? DESKTOP_WIDTH : MOBILE_WIDTH
  const totalUnadjusted =
    viewport === 'mobile' ? page.sections.reduce((sum, sec) => sum + countUnadjustedMobileBlocks(sec), 0) : 0

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100">
      <div className="flex w-14 flex-none flex-col items-center gap-2 border-r border-zinc-200 bg-white py-4">
        <button
          onClick={() => navigate('/dashboard')}
          title="Back to dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-zinc-500 hover:bg-zinc-100"
        >
          ←
        </button>
        <button
          onClick={() => setDesignPanelOpen(true)}
          title="Design system"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-zinc-500 hover:bg-zinc-100"
        >
          ◆
        </button>
        {overlayMode && (
          <button
            onClick={() => {
              selectBlock(null)
              setPageSettingsOpenNarrow((v) => !v)
            }}
            title="Page settings"
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg hover:bg-zinc-100 ${
              pageSettingsOpenNarrow ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-500'
            }`}
          >
            ⚙
          </button>
        )}
        {account.developerMode && (
          <div title="Developer mode is on" className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-none items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 py-2.5">
          <input
            value={site.name}
            onChange={(e) => renameSite(site.id, e.target.value)}
            aria-label="Site name"
            className="min-w-0 flex-1 rounded px-2 py-1 text-sm font-medium text-zinc-800 outline-none hover:bg-zinc-50 focus:bg-zinc-50"
          />
          <div className="flex flex-none items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1">
              {(['desktop', 'mobile'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setViewport(v)
                    selectBlock(null)
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    viewport === v ? 'bg-white text-zinc-900 shadow' : 'text-zinc-500'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {viewport === 'mobile' && totalUnadjusted > 0 && (
              <span className="hidden text-[11px] text-amber-600 sm:inline">
                {totalUnadjusted} element{totalUnadjusted > 1 ? 's' : ''} may need a look on mobile
              </span>
            )}
            <span className="hidden text-[11px] text-zinc-400 sm:inline">Saved</span>
            <button
              onClick={() => setPublishOpen(true)}
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Publish
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="flex-1 overflow-auto p-10" onPointerDown={deselect}>
            <div className="mx-auto" style={{ width: canvasWidth }}>
              <div
                className="overflow-hidden rounded-md border border-zinc-200 shadow-sm"
                style={{ background: page.settings.background }}
              >
                {page.sections.map((section) => {
                  const geometries = getEffectiveGeometries(section, viewport)
                  const height = viewport === 'mobile' ? sectionMobileHeight(section, geometries) : section.minHeight
                  return (
                    <div
                      key={section.id}
                      className="relative border-b border-dashed border-zinc-200 last:border-b-0"
                      style={{ minHeight: height }}
                      onMouseEnter={() => setHoveredSection(section.id)}
                      onMouseLeave={() => setHoveredSection((h) => (h === section.id ? null : h))}
                      onPointerDown={deselect}
                    >
                      {section.blocks.map((block) => {
                        const g = geometries[block.id]
                        if (!g) return null
                        return (
                          <CanvasBlock
                            key={block.id}
                            siteId={site.id}
                            pageId={page.id}
                            block={block}
                            geometry={g}
                            viewport={viewport}
                            selected={selectedBlockId === block.id}
                            onSelect={selectBlock}
                            site={site}
                            canvasWidth={canvasWidth}
                            showAdvancedToggle={account.advancedPanel === 'invoke-only'}
                            advancedOpen={panelOpenInvoke}
                            onToggleAdvanced={() => setPanelOpenInvoke((v) => !v)}
                          />
                        )
                      })}
                      {hoveredSection === section.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setBlockPickerFor(section.id)
                          }}
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-dashed border-indigo-300 bg-white px-3 py-1 text-[11px] font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
                        >
                          + Add block
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              {viewport === 'desktop' && (
                <button
                  onClick={() => addSection(site.id, page.id)}
                  className="mt-3 w-full rounded-md border border-dashed border-zinc-300 py-2 text-xs font-medium text-zinc-400 hover:border-indigo-300 hover:text-indigo-500"
                >
                  + Add section
                </button>
              )}
            </div>
          </div>

          {!overlayMode && panelVisible && (
            <AdvancedPanel
              site={site}
              page={page}
              block={selectedBlock}
              sectionId={selectedSection?.id ?? null}
              viewport={viewport}
              contentOnly={contentOnly}
              overlay={false}
              developerMode={account.developerMode}
              onClose={() => {}}
            />
          )}
        </div>
      </div>

      {overlayMode && panelVisible && (
        <AdvancedPanel
          site={site}
          page={page}
          block={selectedBlock}
          sectionId={selectedSection?.id ?? null}
          viewport={viewport}
          contentOnly={contentOnly}
          overlay
          developerMode={account.developerMode}
          onClose={() => {
            selectBlock(null)
            setPageSettingsOpenNarrow(false)
            setPanelOpenInvoke(false)
          }}
        />
      )}

      {designPanelOpen && <DesignPanel site={site} onClose={() => setDesignPanelOpen(false)} />}

      {blockPickerFor && (
        <BlockPicker
          onClose={() => setBlockPickerFor(null)}
          onPick={(type: BlockType) => {
            const id = addBlock(site.id, page.id, blockPickerFor, type)
            setBlockPickerFor(null)
            selectBlock(id)
          }}
        />
      )}

      {publishOpen && <PublishModal site={site} page={page} onClose={() => setPublishOpen(false)} />}
    </div>
  )
}
