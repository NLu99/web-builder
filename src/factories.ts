import { v4 as uuid } from 'uuid'
import type {
  Block,
  BlockType,
  DesignTokens,
  Page,
  Section,
  Site,
} from './types'

export function defaultTokens(): DesignTokens {
  return {
    colors: [
      { id: 'primary', name: 'Primary', hex: '#4f46e5' },
      { id: 'primary-600', name: 'Primary / 600', hex: '#4338ca' },
      { id: 'ink', name: 'Ink', hex: '#18181b' },
      { id: 'surface', name: 'Surface', hex: '#ffffff' },
      { id: 'muted', name: 'Muted', hex: '#71717a' },
    ],
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 16,
    button: { fill: '#4f46e5', textColor: '#ffffff', radius: 8, size: 'md' },
  }
}

function block(type: BlockType, content: string, geometry: Block['geometry'], style: Block['style'] = {}): Block {
  return { id: uuid(), type, content, geometry, style }
}

export function defaultSections(): Section[] {
  return [
    {
      id: uuid(),
      name: 'Header',
      minHeight: 96,
      blocks: [
        block('heading', 'Your Site', { x: 32, y: 24, w: 220, h: 40 }, { fontSize: 22, fontWeight: 700, colorToken: 'ink' }),
        block('button', 'Get started', { x: 900, y: 24, w: 150, h: 40 }, {}),
      ],
    },
    {
      id: uuid(),
      name: 'Hero',
      minHeight: 420,
      blocks: [
        block('heading', 'Build something people love', { x: 80, y: 100, w: 600, h: 90 }, { fontSize: 44, fontWeight: 700, colorToken: 'ink' }),
        block('text', 'A clean, flexible starting point. Click any text to edit it, drag any block to move it.', { x: 80, y: 200, w: 520, h: 60 }, { fontSize: 17, colorToken: 'muted' }),
        block('button', 'Start free', { x: 80, y: 280, w: 160, h: 44 }, {}),
        block('image', '', { x: 680, y: 60, w: 380, h: 300 }, { bgToken: 'primary', radius: 12 }),
      ],
    },
    {
      id: uuid(),
      name: 'Footer',
      minHeight: 120,
      blocks: [
        block('text', '© 2026 Your Site. All rights reserved.', { x: 32, y: 40, w: 400, h: 24 }, { fontSize: 13, colorToken: 'muted' }),
      ],
    },
  ]
}

export function defaultPage(name = 'Home', slug = 'home'): Page {
  return {
    id: uuid(),
    name,
    settings: {
      title: name,
      metaDescription: '',
      slug,
      background: '#ffffff',
      visibility: 'public',
    },
    sections: defaultSections(),
  }
}

export function blankPage(name = 'Home', slug = 'home'): Page {
  return {
    id: uuid(),
    name,
    settings: {
      title: name,
      metaDescription: '',
      slug,
      background: '#ffffff',
      visibility: 'public',
    },
    sections: [{ id: uuid(), name: 'Section', minHeight: 300, blocks: [] }],
  }
}

export function createSite(name: string, slug: string, startingPoint: 'blank' | 'template'): Site {
  const now = Date.now()
  return {
    id: uuid(),
    name,
    slug,
    createdAt: now,
    updatedAt: now,
    published: false,
    tokens: defaultTokens(),
    pages: [startingPoint === 'blank' ? blankPage() : defaultPage()],
  }
}

export function newBlockDefaults(type: BlockType): { content: string; geometry: Block['geometry']; style: Block['style'] } {
  switch (type) {
    case 'heading':
      return { content: 'New heading', geometry: { x: 60, y: 40, w: 400, h: 48 }, style: { fontSize: 28, fontWeight: 700, colorToken: 'ink' } }
    case 'text':
      return { content: 'New text block. Click to edit.', geometry: { x: 60, y: 40, w: 360, h: 60 }, style: { fontSize: 16, colorToken: 'muted' } }
    case 'button':
      return { content: 'Click me', geometry: { x: 60, y: 40, w: 150, h: 44 }, style: {} }
    case 'image':
      return { content: '', geometry: { x: 60, y: 40, w: 300, h: 200 }, style: { bgToken: 'primary', radius: 8 } }
    case 'divider':
      return { content: '', geometry: { x: 60, y: 40, w: 500, h: 2 }, style: { bgToken: 'muted' } }
  }
}
