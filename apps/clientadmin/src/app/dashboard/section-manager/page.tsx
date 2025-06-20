'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type SectionType = 'navbar' | 'hero' | 'products' | 'about' | 'footer'

interface Props {
  initialSections?: SectionType[] // betölthető meglévő adatok
  companyId: string
}

const SectionManager = ({ initialSections = [], companyId }: Props) => {
  const availableSections: SectionType[] = ['navbar', 'hero', 'products', 'about', 'footer']

  const [selectedSections, setSelectedSections] = useState<SectionType[]>(initialSections)
  const [loading, setLoading] = useState(false)

  const toggleSection = (section: SectionType) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/companies/${companyId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: selectedSections }),
      })

      if (!res.ok) throw new Error()

      toast.success('Sections saved successfully!')
    } catch (err) {
      toast.error('Failed to save sections.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-lg bg-base-200 shadow space-y-4">
      <h2 className="text-xl font-semibold">Website Sections</h2>

      {availableSections.map((section) => (
        <div key={section} className="form-control">
          <label className="label cursor-pointer justify-between">
            <span className="label-text capitalize">{section}</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={selectedSections.includes(section)}
              onChange={() => toggleSection(section)}
              disabled={loading}
            />
          </label>
        </div>
      ))}

      <button className="btn btn-primary w-full" onClick={handleSave} disabled={loading}>
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          'Save Sections'
        )}
      </button>
    </div>
  )
}

export default SectionManager