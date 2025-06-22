'use client'

import { useCompanyStore } from '@client/store/useCompanyStore'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type SectionType = 'navbar' | 'hero' | 'products' | 'about' | 'footer'
type SectionData = {
  type: SectionType
  visible: boolean
  content: string
}

interface Props {
  companyId: string,
}

const SectionManager = ({ companyId }: Props) => {
  const { companyData, setCompanyData } = useCompanyStore()
  const availableSections: SectionType[] = ['navbar', 'hero', 'products', 'about', 'footer']

  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<SectionData[]>(
    availableSections.map((type) => ({
      type,
      visible: false,
      content: '',
    }))
  )

  useEffect(() => {
    if (companyData?.pageSections) {
      const updated = availableSections.map((type) => ({
        type,
        visible: companyData.pageSections?.[type]?.visible ?? false,
        content: companyData.pageSections?.[type]?.content ?? '',
      }))
      setSections(updated)
    }
  }, [companyData])

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/companies/${companyId}`)
        const data = await res.json()

        if (res.ok && data.sections) {
          // Ha már van mentett sections
          const updated = availableSections.map((type) => ({
            type,
            visible: data.sections?.[type]?.visible ?? false,
            content: data.sections?.[type]?.content ?? '',
          }))
          setSections(updated)
        }
      } catch (err) {
        toast.error('Failed to load section data.')
      }
    }

    fetchCompany()
  }, [companyId])

  const handleSave = async () => {
    setLoading(true)
    try {
      // JSON struktúra: { navbar: { visible, content }, hero: ... }
      const sectionsObj = sections.reduce((acc, section) => {
        acc[section.type] = { visible: section.visible, content: section.content }
        return acc
      }, {} as Record<SectionType, { visible: boolean; content: string }>)

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

      {sections.map((section, index) => (
        <div key={section.type} className="form-control space-y-2">
          <label className="label cursor-pointer justify-between">
            <span className="label-text capitalize">{section.type}</span>
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
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder={`Content for ${section.type}`}
            value={section.content}
            onChange={(e) => {
              const updated = [...sections]
              updated[index].content = e.target.value
              setSections(updated)
            }}
            disabled={loading}
          />
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