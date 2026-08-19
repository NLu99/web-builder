import { v4 as uuid } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSite, newBlockDefaults } from './factories'
import type {
  AccountSettings,
  Block,
  BlockStyle,
  BlockType,
  ColorToken,
  Page,
  Section,
  Site,
} from './types'

interface BuilderState {
  sites: Site[]
  account: AccountSettings

  // --- site / page management ---
  addSite: (name: string, slug: string, startingPoint: 'blank' | 'template') => string
  getSite: (siteId: string) => Site | undefined
  renameSite: (siteId: string, name: string) => void
  publishSite: (siteId: string) => void

  // --- page settings ---
  updatePageSettings: (siteId: string, pageId: string, patch: Partial<Page['settings']>) => void

  // --- sections ---
  addSection: (siteId: string, pageId: string) => void

  // --- blocks ---
  addBlock: (siteId: string, pageId: string, sectionId: string, type: BlockType) => string
  updateBlockContent: (siteId: string, pageId: string, blockId: string, content: string) => void
  updateBlockGeometry: (siteId: string, pageId: string, blockId: string, geometry: Block['geometry'], viewport: 'desktop' | 'mobile') => void
  updateBlockStyle: (siteId: string, pageId: string, blockId: string, style: Partial<BlockStyle>, viewport: 'desktop' | 'mobile') => void
  deleteBlock: (siteId: string, pageId: string, blockId: string) => void
  reorderBlockLayer: (siteId: string, pageId: string, sectionId: string, blockId: string, direction: 'front' | 'back') => void

  // --- design tokens ---
  updateColorToken: (siteId: string, tokenId: string, hex: string) => void
  updateButtonToken: (siteId: string, patch: Partial<Site['tokens']['button']>) => void
  addColorToken: (siteId: string, name: string, hex: string) => void

  // --- account settings ---
  setAdvancedPanelPreference: (pref: AccountSettings['advancedPanel']) => void
  setDeveloperMode: (on: boolean) => void
}

function touch(site: Site) {
  site.updatedAt = Date.now()
}

function findBlock(site: Site, pageId: string, blockId: string): { block: Block; section: Section } | undefined {
  const page = site.pages.find((p) => p.id === pageId)
  if (!page) return undefined
  for (const section of page.sections) {
    const block = section.blocks.find((b) => b.id === blockId)
    if (block) return { block, section }
  }
  return undefined
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      sites: [],
      account: { advancedPanel: 'always', developerMode: false },

      addSite: (name, slug, startingPoint) => {
        const site = createSite(name, slug, startingPoint)
        set((s) => ({ sites: [...s.sites, site] }))
        return site.id
      },

      getSite: (siteId) => get().sites.find((s) => s.id === siteId),

      renameSite: (siteId, name) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next = { ...site, name }
            touch(next)
            return next
          }),
        })),

      publishSite: (siteId) =>
        set((s) => ({
          sites: s.sites.map((site) =>
            site.id === siteId ? { ...site, published: true, publishedAt: Date.now() } : site
          ),
        })),

      updatePageSettings: (siteId, pageId, patch) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) => (p.id === pageId ? { ...p, settings: { ...p.settings, ...patch } } : p)),
            }
            touch(next)
            return next
          }),
        })),

      addSection: (siteId, pageId) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) =>
                p.id === pageId
                  ? { ...p, sections: [...p.sections, { id: uuid(), name: 'New section', minHeight: 240, blocks: [] }] }
                  : p
              ),
            }
            touch(next)
            return next
          }),
        })),

      addBlock: (siteId, pageId, sectionId, type) => {
        const id = uuid()
        const defaults = newBlockDefaults(type)
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) =>
                p.id === pageId
                  ? {
                      ...p,
                      sections: p.sections.map((sec) =>
                        sec.id === sectionId
                          ? { ...sec, blocks: [...sec.blocks, { id, type, ...defaults }] }
                          : sec
                      ),
                    }
                  : p
              ),
            }
            touch(next)
            return next
          }),
        }))
        return id
      },

      updateBlockContent: (siteId, pageId, blockId, content) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) =>
                p.id !== pageId
                  ? p
                  : {
                      ...p,
                      sections: p.sections.map((sec) => ({
                        ...sec,
                        blocks: sec.blocks.map((b) => (b.id === blockId ? { ...b, content } : b)),
                      })),
                    }
              ),
            }
            touch(next)
            return next
          }),
        })),

      updateBlockGeometry: (siteId, pageId, blockId, geometry, viewport) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) =>
                p.id !== pageId
                  ? p
                  : {
                      ...p,
                      sections: p.sections.map((sec) => ({
                        ...sec,
                        blocks: sec.blocks.map((b) =>
                          b.id !== blockId
                            ? b
                            : viewport === 'mobile'
                            ? { ...b, mobileGeometry: geometry }
                            : { ...b, geometry }
                        ),
                      })),
                    }
              ),
            }
            touch(next)
            return next
          }),
        })),

      updateBlockStyle: (siteId, pageId, blockId, style, viewport) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) =>
                p.id !== pageId
                  ? p
                  : {
                      ...p,
                      sections: p.sections.map((sec) => ({
                        ...sec,
                        blocks: sec.blocks.map((b) =>
                          b.id !== blockId
                            ? b
                            : viewport === 'mobile'
                            ? { ...b, mobileStyle: { ...b.mobileStyle, ...style } }
                            : { ...b, style: { ...b.style, ...style } }
                        ),
                      })),
                    }
              ),
            }
            touch(next)
            return next
          }),
        })),

      deleteBlock: (siteId, pageId, blockId) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) =>
                p.id !== pageId
                  ? p
                  : { ...p, sections: p.sections.map((sec) => ({ ...sec, blocks: sec.blocks.filter((b) => b.id !== blockId) })) }
              ),
            }
            touch(next)
            return next
          }),
        })),

      reorderBlockLayer: (siteId, pageId, sectionId, blockId, direction) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              pages: site.pages.map((p) =>
                p.id !== pageId
                  ? p
                  : {
                      ...p,
                      sections: p.sections.map((sec) => {
                        if (sec.id !== sectionId) return sec
                        const blocks = [...sec.blocks]
                        const idx = blocks.findIndex((b) => b.id === blockId)
                        if (idx === -1) return sec
                        const [b] = blocks.splice(idx, 1)
                        direction === 'front' ? blocks.push(b) : blocks.unshift(b)
                        return { ...sec, blocks }
                      }),
                    }
              ),
            }
            touch(next)
            return next
          }),
        })),

      updateColorToken: (siteId, tokenId, hex) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = {
              ...site,
              tokens: { ...site.tokens, colors: site.tokens.colors.map((c) => (c.id === tokenId ? { ...c, hex } : c)) },
            }
            touch(next)
            return next
          }),
        })),

      addColorToken: (siteId, name, hex) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const token: ColorToken = { id: uuid(), name, hex }
            const next: Site = { ...site, tokens: { ...site.tokens, colors: [...site.tokens.colors, token] } }
            touch(next)
            return next
          }),
        })),

      updateButtonToken: (siteId, patch) =>
        set((s) => ({
          sites: s.sites.map((site) => {
            if (site.id !== siteId) return site
            const next: Site = { ...site, tokens: { ...site.tokens, button: { ...site.tokens.button, ...patch } } }
            touch(next)
            return next
          }),
        })),

      setAdvancedPanelPreference: (pref) => set((s) => ({ account: { ...s.account, advancedPanel: pref } })),
      setDeveloperMode: (on) => set((s) => ({ account: { ...s.account, developerMode: on } })),
    }),
    { name: 'web-builder-storage' }
  )
)

export function resolveColor(site: Site, token?: string, raw?: string): string | undefined {
  if (token) {
    const found = site.tokens.colors.find((c) => c.id === token)
    if (found) return found.hex
  }
  return raw
}

export { findBlock }
