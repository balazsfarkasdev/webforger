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
      const availableSections = Object.keys(SECTION_CONFIG) as SectionType[]
      const updated = availableSections
        .map((type) => ({
          type,
          visible: companyData.pageSections?.[type]?.visible ?? false,
          content: companyData.pageSections?.[type]?.content ?? SECTION_CONFIG[type].defaultContent,
          styles: companyData.pageSections?.[type]?.styles ?? SECTION_CONFIG[type].defaultStyles,
          order: companyData.pageSections?.[type]?.order ?? sections.length,
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

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const updated = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap orders using destructuring assignment
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

  return (
    <div className="p-6 rounded-lg bg-base-200 shadow space-y-4">
      <h2 className="text-xl font-semibold">Website Sections</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Add Sections</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SECTION_CONFIG).map(([type, config]) => (
            <button
              key={type}
              className="btn btn-outline btn-sm"
              onClick={() => handleAddSection(type as SectionType)}
              disabled={loading || sections.some(s => s.type === type)}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
      </div>

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