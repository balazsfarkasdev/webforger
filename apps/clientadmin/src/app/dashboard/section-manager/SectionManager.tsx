'use client'

import { useCompanyStore } from '@client/store/useCompanyStore'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type SectionType = 'navbar' | 'hero' | 'products' | 'about' | 'footer'
type SectionStyle = {
  theme?: string
  alignment?: 'left' | 'center' | 'right'
}

type SectionData = {
  type: SectionType
  visible: boolean
  content: string
  styles?: SectionStyle
  order: number // Added order property
}

interface Props {
  companyId: string
}

const SectionManager = ({ companyId }: Props) => {
  const { companyData, setCompanyData } = useCompanyStore()
  const availableSections: SectionType[] = ['navbar', 'hero', 'products', 'about', 'footer']

  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<SectionData[]>([])

  // Default stock section configurations
  const stockSections: Record<string, SectionData> = {
    header: {
      type: 'navbar',
      visible: true,
      content: 'Default Header Content',
      styles: {
        theme: 'light',
        alignment: 'center',
      },
      order: 0, // Default order for new sections
    },
  }

  useEffect(() => {
    if (companyData?.pageSections) {
      const updated = availableSections
        .map((type, index) => ({
          type,
          visible: companyData.pageSections?.[type]?.visible ?? false,
          content: companyData.pageSections?.[type]?.content ?? '',
          styles: companyData.pageSections?.[type]?.styles ?? {},
          order: companyData.pageSections?.[type]?.order ?? index, // Use stored order or fallback to index
        }))
        .sort((a, b) => a.order - b.order) // Sort sections by order
      setSections(updated)
    }
  }, [companyData])

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/companies/${companyData?.id}`)
        const data = await res.json()
        // Ensure sections are sorted by order
        setCompanyData(data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load company data.')
      }
    }

    if (companyData?.id) {
      fetchCompany()
    }
  }, [companyData?.id])

  const handleAddStockSection = (sectionKey: keyof typeof stockSections) => {
    const newSection = {
      ...stockSections[sectionKey],
      order: sections.length, // Set order to the end of the list
    }

    setSections((prevState) => [...prevState, newSection])
    toast.success(`Added ${newSection.type} section.`)
  }

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return // Prevent moving beyond bounds
    }

    const updatedSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap order values
    [updatedSections[index].order, updatedSections[targetIndex].order] = [
      updatedSections[targetIndex].order,
      updatedSections[index].order,
    ]

    // Sort sections by order
    updatedSections.sort((a, b) => a.order - b.order)
    setSections(updatedSections)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const sectionsObj = sections.reduce((acc, section) => {
        acc[section.type] = {
          visible: section.visible,
          content: section.content,
          styles: section.styles || {},
          order: section.order, // Include order in saved data
        }
        return acc
      }, {} as Record<SectionType, { visible: boolean; content: string; styles: SectionStyle; order: number }>)

      const res = await fetch(`http://localhost:5000/api/companies/${companyId}/sections`, {
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

      <div className="flex gap-2">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => handleAddStockSection('header')}
          disabled={loading}
        >
          Header
        </button>
      </div>

      {sections.map((section, index) => (
        <div key={section.type} className="form-control space-y-2">
          <div className="flex items-center justify-between">
            <label className="label cursor-pointer">
              <span className="label-text capitalize">{section.type}</span>
              <input
                type="checkbox"
                className="checkbox ml-2"
                checked={section.visible}
                onChange={() => {
                  const updated = [...sections]
                  updated[index].visible = !updated[index].visible
                  setSections(updated)
                }}
                disabled={loading}
              />
            </label>
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-xs"
                onClick={() => handleMoveSection(index, 'up')}
                disabled={loading || index === 0}
              >
                ↑
              </button>
              <button
                className="btn btn-outline btn-xs"
                onClick={() => handleMoveSection(index, 'down')}
                disabled={loading || index === sections.length - 1}
              >
                ↓
              </button>
            </div>
          </div>
          {section.visible && <textarea
            className="textarea textarea-bordered w-full"
            placeholder={`Content for ${section.type}`}
            value={section.content}
            onChange={(e) => {
              const updated = [...sections]
              updated[index].content = e.target.value
              setSections(updated)
            }}
            disabled={loading}
          />}
          {section.visible && (
            <div className="flex flex-row gap-2">
              <label htmlFor="" className="w-auto">
                Alignment
              </label>
              <select
                className="select select-bordered w-100"
                value={section.styles?.alignment || 'center'}
                onChange={(e) => {
                  const updated = [...sections]
                  updated[index].styles = {
                    ...updated[index].styles,
                    alignment: e.target.value as 'left' | 'center' | 'right',
                  }
                  setSections(updated)
                }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}
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