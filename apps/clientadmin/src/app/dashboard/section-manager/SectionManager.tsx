'use client'

import { useCompanyStore } from '@client/store/useCompanyStore'
import { SECTION_CONFIG } from '@client/config/sections'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SectionData, SectionType } from '@client/types/sections'
import { SectionRenderer } from './components/SectionRenderer'

interface Props {
  companyId: string
}

const SectionManager = ({ companyId }: Props) => {
  const { companyData, setCompanyData } = useCompanyStore()
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<SectionData[]>([])

  useEffect(() => {
    if (companyData?.pageSections) {
      const savedSectionTypes = Object.keys(companyData.pageSections) as SectionType[]
      const updated = savedSectionTypes
        .map((type) => ({
          type,
          visible: companyData.pageSections[type].visible,
          content: companyData.pageSections[type].content,
          styles: companyData.pageSections[type].styles,
          order: companyData.pageSections[type].order,
        }))
        .sort((a, b) => a.order - b.order)
      setSections(updated)
    }
  }, [companyData])

  const handleAddSection = (type: SectionType) => {
    const newSection: SectionData = {
      type,
      visible: true,
      content: SECTION_CONFIG[type].defaultContent,
      styles: SECTION_CONFIG[type].defaultStyles,
      order: sections.length,
    }

    setSections((prev) => [...prev, newSection])
    toast.success(`Added ${SECTION_CONFIG[type].label} section.`)
  }

  const handleDeleteSection = (index: number) => {
    const sectionToDelete = sections[index]
    setSections(prev => prev.filter((_, i) => i !== index))
    toast.success(`Removed ${SECTION_CONFIG[sectionToDelete.type].label} section.`)
  }

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const updated = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [updated[index].order, updated[targetIndex].order] =
      [updated[targetIndex].order, updated[index].order];

    updated.sort((a, b) => a.order - b.order);
    setSections(updated);
  };

  const handleUpdateSection = (index: number, updatedSection: SectionData) => {
    setSections(prev => prev.map((s, i) => i === index ? updatedSection : s))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const sectionsObj = sections.reduce((acc, section) => {
        acc[section.type] = {
          visible: section.visible,
          content: section.content,
          styles: section.styles,
          order: section.order,
        }
        return acc
      }, {} as Record<SectionType, Omit<SectionData, 'type'>>)

      const res = await fetch(`${window.api}/companies/${companyId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSections: sectionsObj }),
      })

      if (!res.ok) throw new Error()

      setCompanyData({
        ...companyData,
        pageSections: sectionsObj,
      })
      toast.success('Sections saved successfully!')
    } catch (err) {
      toast.error('Failed to save sections.')
    } finally {
      setLoading(false)
    }
  }

  const availableSections = Object.entries(SECTION_CONFIG)
    .filter(([type]) => !sections.some(s => s.type === type))

  return (
    <div className="p-6 rounded-lg bg-base-200 shadow space-y-4">
      <h2 className="text-xl font-semibold">Website Sections</h2>

      {availableSections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Add Sections</h3>
          <div className="flex flex-wrap gap-2">
            {availableSections.map(([type, config]) => (
              <button
                key={type}
                className="btn btn-outline btn-sm"
                onClick={() => handleAddSection(type as SectionType)}
                disabled={loading}
              >
                {config.icon} {config.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={`${section.type}-${index}`} className="card bg-base-100 p-4 shadow">
            <div className="flex items-center justify-between mb-4">
              <label className="label cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={section.visible}
                  onChange={() => {
                    const updated = [...sections]
                    updated[index].visible = !updated[index].visible
                    setSections(updated)
                  }}
                  disabled={loading}
                />
                <span className="label-text font-semibold">
                  {SECTION_CONFIG[section.type].label}
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => handleMoveSection(index, 'up')}
                  disabled={loading || index === 0}
                >
                  ↑ Move Up
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => handleMoveSection(index, 'down')}
                  disabled={loading || index === sections.length - 1}
                >
                  ↓ Move Down
                </button>
                <button
                  className="btn btn-error btn-xs"
                  onClick={() => handleDeleteSection(index)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>

            {section.visible && (
              <div className="pl-8">
                <SectionRenderer
                  section={section}
                  onUpdate={(updated) => handleUpdateSection(index, updated)}
                  loading={loading}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary w-full mt-6"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Sections'}
      </button>
    </div>
  )
}

export default SectionManager