import type { BlockGeometry, Section } from '../types'
import { MOBILE_WIDTH } from './constants'

export function getEffectiveGeometries(section: Section, viewport: 'desktop' | 'mobile'): Record<string, BlockGeometry> {
  const result: Record<string, BlockGeometry> = {}
  if (viewport === 'desktop') {
    for (const b of section.blocks) result[b.id] = b.geometry
    return result
  }
  const ordered = [...section.blocks].sort((a, b) => a.geometry.y - b.geometry.y)
  let runningY = 16
  for (const b of ordered) {
    if (b.mobileGeometry) {
      result[b.id] = b.mobileGeometry
      continue
    }
    const w = MOBILE_WIDTH - 32
    const scale = w / b.geometry.w
    let h: number
    if (b.type === 'heading' || b.type === 'text') {
      // A narrower column wraps text onto more lines at the same font size,
      // so height must grow as width shrinks, not scale down with it.
      const fontSize = b.style.fontSize ?? 16
      const charsPerLine = Math.max(1, Math.floor(w / (fontSize * 0.55)))
      const lines = Math.max(1, Math.ceil(b.content.length / charsPerLine))
      h = Math.round(lines * fontSize * 1.35) + 8
    } else if (b.type === 'divider') {
      h = b.geometry.h
    } else {
      h = Math.round(b.geometry.h * Math.min(scale, 1.4))
    }
    result[b.id] = { x: 16, y: runningY, w, h }
    runningY += h + 16
  }
  return result
}

export function sectionMobileHeight(section: Section, geometries: Record<string, BlockGeometry>): number {
  let max = 40
  for (const b of section.blocks) {
    const g = geometries[b.id]
    if (g) max = Math.max(max, g.y + g.h + 16)
  }
  return max
}

export function countUnadjustedMobileBlocks(section: Section): number {
  return section.blocks.filter((b) => !b.mobileGeometry).length
}
