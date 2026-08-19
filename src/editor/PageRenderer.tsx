import type { Page, Site } from '../types'
import { DESKTOP_WIDTH, MOBILE_WIDTH } from './constants'
import { getEffectiveGeometries, sectionMobileHeight } from './layout'
import { resolveColor } from '../store'

export default function PageRenderer({ site, page, viewport }: { site: Site; page: Page; viewport: 'desktop' | 'mobile' }) {
  const width = viewport === 'desktop' ? DESKTOP_WIDTH : MOBILE_WIDTH

  return (
    <div style={{ background: page.settings.background, width }} className="mx-auto">
      {page.sections.map((section) => {
        const geometries = getEffectiveGeometries(section, viewport)
        const height = viewport === 'mobile' ? sectionMobileHeight(section, geometries) : section.minHeight
        return (
          <div key={section.id} style={{ position: 'relative', minHeight: height, width }}>
            {section.blocks.map((block) => {
              const g = geometries[block.id]
              if (!g) return null
              const style = viewport === 'mobile' && block.mobileStyle ? { ...block.style, ...block.mobileStyle } : block.style
              const color = resolveColor(site, style.colorToken, style.color) ?? '#18181b'
              const bg = block.type === 'button' ? site.tokens.button.fill : resolveColor(site, style.bgToken, style.bg)
              const radius = block.type === 'button' ? site.tokens.button.radius : style.radius ?? 0
              const common: React.CSSProperties = {
                position: 'absolute',
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                opacity: style.opacity ?? 1,
                transform: style.rotation ? `rotate(${style.rotation}deg)` : undefined,
              }
              if (block.type === 'heading' || block.type === 'text') {
                return (
                  <div
                    key={block.id}
                    style={{
                      ...common,
                      color,
                      fontSize: style.fontSize,
                      fontWeight: style.fontWeight,
                      textAlign: style.textAlign ?? 'left',
                      fontFamily: block.type === 'heading' ? site.tokens.headingFont : site.tokens.bodyFont,
                      lineHeight: 1.3,
                    }}
                  >
                    {block.content}
                  </div>
                )
              }
              if (block.type === 'button') {
                return (
                  <a
                    key={block.id}
                    href={block.href || '#'}
                    style={{
                      ...common,
                      background: bg,
                      color: site.tokens.button.textColor,
                      borderRadius: radius,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: site.tokens.button.size === 'lg' ? 16 : site.tokens.button.size === 'sm' ? 13 : 14.5,
                      textDecoration: 'none',
                    }}
                  >
                    {block.content}
                  </a>
                )
              }
              if (block.type === 'image') {
                return (
                  <div
                    key={block.id}
                    role="img"
                    aria-label={block.alt || 'Image'}
                    style={{
                      ...common,
                      background: bg ?? '#e4e4e7',
                      borderRadius: radius,
                    }}
                  />
                )
              }
              return <div key={block.id} style={{ ...common, background: bg ?? '#d4d4d8', borderRadius: radius }} />
            })}
          </div>
        )
      })}
    </div>
  )
}
