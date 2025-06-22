'use client'

import { useCompanyStore } from '@client/store/useCompanyStore'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type SectionType = 'navbar' | 'hero' | 'products' | 'about' | 'footer'
type SectionStyle = {
  theme?: string
  alignment?: 'left' | 'center' | 'right'
  backgroundColor?: string
  textColor?: string
  padding?: string
  backgroundImage?: string
}

type SectionData = {
  type: SectionType
  visible: boolean
  content: string
  styles?: SectionStyle
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
      styles: {
        theme: 'light',
        alignment: 'center',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        padding: '2rem',
      },
    }))
  )

  useEffect(() => {
    if (companyData?.pageSections) {
      const updated = availableSections.map((type) => ({
        type,
        visible: companyData.pageSections?.[type]?.visible ?? false,
        content: companyData.pageSections?.[type]?.content ?? '',
        styles: companyData.pageSections?.[type]?.styles ?? '',
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
            styles: data.sections?.[type]?.styles ?? '',
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
        acc[section.type] = {
          visible: section.visible,
          content: section.content,
          styles: section.styles || {},
        }
        return acc
      }, {} as Record<SectionType, { visible: boolean; content: string; styles: SectionStyle }>)

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
          {section.visible && (
            <div className="space-y-2">
              <div className='flex flex-row gap-2'>
                <label className='w-auto' htmlFor="">Background color</label>
                <input
                  type="color"
                  value={section.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    const updated = [...sections]
                    updated[index].styles = { ...updated[index].styles, backgroundColor: e.target.value }
                    setSections(updated)
                  }}
                  className="w-20"
                />
              </div>
              <div className="flex flex-row gap-2">
                <label className='w-auto' htmlFor="">Text color</label>
                <input
                  type="color"
                  value={section.styles?.textColor || '#000000'}
                  onChange={(e) => {
                    const updated = [...sections]
                    updated[index].styles = { ...updated[index].styles, textColor: e.target.value }
                    setSections(updated)
                  }}
                  className="w-20"
                />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor="" className="w-auto">Alignment</label>
                <select
                  className="select select-bordered w-100"
                  value={section.styles?.alignment || 'center'}
                  onChange={(e) => {
                    const updated = [...sections]
                    updated[index].styles = { ...updated[index].styles, alignment: e.target.value as 'left' | 'center' | 'right' }
                    setSections(updated)
                  }}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select></div>
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