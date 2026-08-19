import { useEffect, useRef, useState } from 'react'
import type { Block, BlockGeometry, Site } from '../types'
import { GRID, snap } from './constants'
import { useBuilderStore, resolveColor } from '../store'
import DirectController from './DirectController'

interface Props {
  siteId: string
  pageId: string
  block: Block
  geometry: BlockGeometry
  viewport: 'desktop' | 'mobile'
  selected: boolean
  onSelect: (id: string | null) => void
  site: Site
  canvasWidth: number
  showAdvancedToggle: boolean
  advancedOpen: boolean
  onToggleAdvanced: () => void
}

export default function CanvasBlock({
  siteId,
  pageId,
  block,
  geometry,
  viewport,
  selected,
  onSelect,
  site,
  canvasWidth,
  showAdvancedToggle,
  advancedOpen,
  onToggleAdvanced,
}: Props) {
  const updateBlockGeometry = useBuilderStore((s) => s.updateBlockGeometry)
  const updateBlockContent = useBuilderStore((s) => s.updateBlockContent)
  const deleteBlock = useBuilderStore((s) => s.deleteBlock)

  const [live, setLive] = useState<BlockGeometry>(geometry)
  const [editing, setEditing] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; origin: BlockGeometry; moved: boolean; mode: 'move' | 'resize' } | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editing) setLive(geometry)
  }, [geometry.x, geometry.y, geometry.w, geometry.h, editing])

  const style = viewport === 'mobile' && block.mobileStyle ? { ...block.style, ...block.mobileStyle } : block.style

  function commitGeometry(g: BlockGeometry) {
    updateBlockGeometry(siteId, pageId, block.id, g, viewport)
  }

  function onPointerDownMove(e: React.PointerEvent) {
    if (editing) return
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: geometry, moved: false, mode: 'move' }
  }

  function onPointerDownResize(e: React.PointerEvent) {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: geometry, moved: false, mode: 'resize' }
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true
    if (!d.moved) return
    if (d.mode === 'move') {
      const nx = Math.max(0, Math.min(canvasWidth - d.origin.w, d.origin.x + dx))
      const ny = Math.max(0, d.origin.y + dy)
      setLive({ ...d.origin, x: nx, y: ny })
    } else {
      const nw = Math.max(GRID * 4, d.origin.w + dx)
      const nh = Math.max(GRID * 3, d.origin.h + dy)
      setLive({ ...d.origin, w: nw, h: nh })
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    dragRef.current = null
    if (!d.moved) {
      onSelect(block.id)
      if (block.type === 'text' || block.type === 'heading' || block.type === 'button') {
        setEditing(true)
        requestAnimationFrame(() => textRef.current?.focus())
      }
      return
    }
    const snapped = { x: snap(live.x), y: snap(live.y), w: snap(live.w), h: snap(live.h) }
    setLive(snapped)
    commitGeometry(snapped)
    onSelect(block.id)
  }

  function finishEditing() {
    setEditing(false)
    const text = textRef.current?.innerText ?? block.content
    updateBlockContent(siteId, pageId, block.id, text)
  }

  const color = resolveColor(site, style.colorToken, style.color) ?? '#18181b'
  const bg =
    block.type === 'button'
      ? site.tokens.button.fill
      : resolveColor(site, style.bgToken, style.bg)

  const radius = block.type === 'button' ? site.tokens.button.radius : style.radius ?? 0
  const commonWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: live.x,
    top: live.y,
    width: live.w,
    height: live.h,
    opacity: style.opacity ?? 1,
    transform: style.rotation ? `rotate(${style.rotation}deg)` : undefined,
    outline: selected ? '2px solid #6366f1' : '1px dashed transparent',
    outlineOffset: 2,
    cursor: editing ? 'text' : 'grab',
  }

  return (
    <div
      role="group"
      aria-label={`${block.type} block`}
      tabIndex={0}
      style={commonWrapperStyle}
      className="group/block"
      onPointerDown={onPointerDownMove}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onFocus={() => onSelect(block.id)}
      onKeyDown={(e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (document.activeElement === e.currentTarget) {
            e.preventDefault()
            deleteBlock(siteId, pageId, block.id)
          }
        }
      }}
    >
      {block.type === 'heading' || block.type === 'text' ? (
        <div
          ref={textRef}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={finishEditing}
          style={{
            color,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            textAlign: style.textAlign ?? 'left',
            fontFamily: block.type === 'heading' ? site.tokens.headingFont : site.tokens.bodyFont,
            width: '100%',
            height: '100%',
            outline: 'none',
            lineHeight: 1.3,
          }}
        >
          {block.content}
        </div>
      ) : block.type === 'button' ? (
        <div
          ref={textRef}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={finishEditing}
          style={{
            background: bg,
            color: site.tokens.button.textColor,
            borderRadius: radius,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: site.tokens.button.size === 'lg' ? 16 : site.tokens.button.size === 'sm' ? 13 : 14.5,
            outline: 'none',
          }}
        >
          {block.content}
        </div>
      ) : block.type === 'image' ? (
        <div
          style={{
            background: bg ?? '#e4e4e7',
            borderRadius: radius,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,.8)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '.03em',
          }}
        >
          IMAGE
        </div>
      ) : (
        <div style={{ background: bg ?? '#d4d4d8', width: '100%', height: '100%', borderRadius: radius }} />
      )}

      {selected && !editing && (
        <div
          onPointerDown={onPointerDownResize}
          className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-se-resize rounded-sm border border-white bg-indigo-500 shadow"
        />
      )}

      {selected && (
        <DirectController
          siteId={siteId}
          pageId={pageId}
          block={block}
          site={site}
          viewport={viewport}
          showAdvancedToggle={showAdvancedToggle}
          advancedOpen={advancedOpen}
          onToggleAdvanced={onToggleAdvanced}
        />
      )}
    </div>
  )
}
