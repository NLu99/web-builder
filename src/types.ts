export type BlockType = 'heading' | 'text' | 'button' | 'image' | 'divider'

export interface BlockStyle {
  colorToken?: string
  color?: string
  fontSize?: number
  fontWeight?: number
  textAlign?: 'left' | 'center' | 'right'
  bg?: string
  bgToken?: string
  radius?: number
  opacity?: number
  rotation?: number
  customCss?: string
}

export interface BlockGeometry {
  x: number
  y: number
  w: number
  h: number
}

export interface Block {
  id: string
  type: BlockType
  content: string
  href?: string
  alt?: string
  geometry: BlockGeometry
  style: BlockStyle
  mobileGeometry?: BlockGeometry
  mobileStyle?: BlockStyle
}

export interface Section {
  id: string
  name: string
  minHeight: number
  blocks: Block[]
}

export interface PageSettings {
  title: string
  metaDescription: string
  slug: string
  background: string
  visibility: 'public' | 'password'
  password?: string
  customCode?: string
}

export interface Page {
  id: string
  name: string
  settings: PageSettings
  sections: Section[]
}

export interface ColorToken {
  id: string
  name: string
  hex: string
}

export interface DesignTokens {
  colors: ColorToken[]
  headingFont: string
  bodyFont: string
  baseSize: number
  button: {
    fill: string
    textColor: string
    radius: number
    size: 'sm' | 'md' | 'lg'
  }
}

export interface Site {
  id: string
  name: string
  slug: string
  createdAt: number
  updatedAt: number
  published: boolean
  publishedAt?: number
  tokens: DesignTokens
  pages: Page[]
}

export type AdvancedPanelPreference = 'always' | 'invoke-only'

export interface AccountSettings {
  advancedPanel: AdvancedPanelPreference
  developerMode: boolean
}
