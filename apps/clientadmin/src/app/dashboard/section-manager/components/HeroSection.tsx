'use client'

import { SectionData } from '@client/types/sections'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import { uploadToCloudinary } from '@client/utils/uploadToCloudinary'

interface HeroSectionProps {
  section: SectionData
  onUpdate: (updatedSection: SectionData) => void
  loading?: boolean
}

export const HeroSection = ({ section, onUpdate, loading }: HeroSectionProps) => {
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadToCloudinary(file)
      onUpdate({
        ...section,
        content: {
          ...section.content,
          image: url,
        },
      })
      toast.success('Hero image uploaded!')
    } catch (err) {
      toast.error('Upload failed')
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    onUpdate({
      ...section,
      content: {
        ...section.content,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="form-control">
        <label className="label">Title</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={section.content.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Hero Title"
          disabled={loading}
        />
      </div>

      {/* Subtitle */}
      <div className="form-control">
        <label className="label">Subtitle</label>
        <textarea
          className="textarea textarea-bordered w-full"
          value={section.content.subtitle || ''}
          onChange={(e) => handleFieldChange('subtitle', e.target.value)}
          placeholder="Hero Subtitle"
          disabled={loading}
        />
      </div>

      {/* CTA Button */}
      <div className="form-control space-y-2">
        <label className="label">Call To Action</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={section.content.ctaLabel || ''}
          onChange={(e) => handleFieldChange('ctaLabel', e.target.value)}
          placeholder="CTA Button Label (e.g., Get Started)"
          disabled={loading}
        />
        <input
          type="text"
          className="input input-bordered w-full"
          value={section.content.ctaPath || ''}
          onChange={(e) => handleFieldChange('ctaPath', e.target.value)}
          placeholder="CTA Path (e.g., /contact)"
          disabled={loading}
        />
      </div>
    </div>
  )
}
