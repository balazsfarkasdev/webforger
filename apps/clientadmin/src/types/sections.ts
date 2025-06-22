export type SectionType = 'navbar' | 'hero' | 'products' | 'about' | 'footer'

export type SectionAlignment = 'left' | 'center' | 'right'
export type SectionTheme = 'light' | 'dark' | 'custom'

export type SectionStyle = {
  theme?: SectionTheme
  alignment?: SectionAlignment
}

export type SectionContent = {
  [key: string]: any
  logo?: string
  title?: string
  subtitle?: string
  image?: string
  links?: Array<{
    label: string
    path: string
  }>
}

export type SectionData = {
  type: SectionType
  visible: boolean
  content: SectionContent
  styles?: SectionStyle
  order: number
}