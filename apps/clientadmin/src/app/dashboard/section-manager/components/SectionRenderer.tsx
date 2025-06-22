'use client'

import { SectionData } from '@client/types/sections'
import { NavbarSection } from './NavbarSection'

interface SectionRendererProps {
  section: SectionData
  onUpdate: (updatedSection: SectionData) => void
  loading?: boolean
}

export const SectionRenderer = ({ section, onUpdate, loading }: SectionRendererProps) => {
  switch (section.type) {
    case 'navbar':
      return <NavbarSection section={section} onUpdate={onUpdate} loading={loading} />
    // Add other cases...
    default:
      return null
  }
}