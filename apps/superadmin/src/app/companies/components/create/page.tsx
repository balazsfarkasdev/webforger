// superadmin/components/create/page.tsx
'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  company?: {
    id: string
    name: string
    slug: string
    email: string
    layout: string
  }
  onCreated?: () => void
  onUpdated?: () => void
}

export default function CreateCompanyComponent({ company, onCreated, onUpdated }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    layout: 'webshop',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        slug: company.slug,
        email: company.email,
        layout: company.layout,
      })
    }
  }, [company])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const url = company
      ? `http://localhost:5000/api/companies/${company.id}`
      : 'http://localhost:5000/api/companies'

    const method = company ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(company ? 'Company updated!' : 'Company created!')
        if (company) {
          onUpdated?.()
        } else {
          onCreated?.()
          setFormData({ name: '', slug: '', email: '', layout: 'webshop' })
        }
      } else {
        toast.error('Operation failed')
      }
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 p-6 border rounded-lg shadow-md bg-base-200 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{company ? 'Edit Company' : 'Create Company'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="input input-bordered w-full"
          required
        />
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="input input-bordered w-full"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="input input-bordered w-full"
          required
        />
        <select
          name="layout"
          value={formData.layout}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="webshop">Webshop</option>
          <option value="portfolio">Portfolio</option>
          <option value="landing">Landing Page</option>
        </select>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner" />
          ) : company ? (
            'Save Changes'
          ) : (
            'Create Company'
          )}
        </button>
      </form>
    </div>
  )
}