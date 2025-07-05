import { SectionType } from '@client/types/sections'

export const SECTION_CONFIG = {
  navbar: {
    label: 'Navigation Bar',
    icon: '🖼️',
    defaultContent: {
      logo: 'https://icon.icepanel.io/Technology/svg/Next.js.svg',
      links: [
        {
          label: 'Home',
          path: ''
        }
      ]
    },
    defaultStyles: {
      theme: 'light',
      alignment: 'center'
    }
  },
  hero: {
    label: 'Hero Section',
    icon: '🌅',
    defaultContent: {
      title: 'Welcome to Our Website',
      subtitle: 'We create stunning experiences',
      ctaLabel: 'Get Started',
      ctaPath: '/about',
    },
    defaultStyles: {
      theme: 'light',
      alignment: 'center',
    },
  },
} as const satisfies Record<SectionType, SectionConfig>

type SectionConfig = {
  label: string
  icon: string
  defaultContent: any
  defaultStyles: any
}