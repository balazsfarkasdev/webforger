'use client'

import { useState } from "react"

type Props = {
  onCreated?: () => void
}

export default function CreateCompanyComponent({ onCreated }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    layout: "webshop"
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({ name: "", slug: "", email: "", layout: "webshop" })
        onCreated?.()
      } else {
        console.error("Failed to create company")
      }
    } catch (error) {
      console.error("Error creating company:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 p-8 bg-white rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Company</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Company Name" className="input input-bordered w-full" onChange={handleChange} value={formData.name} required />
        <input name="slug" placeholder="Slug (e.g. fonalvarazs)" className="input input-bordered w-full" onChange={handleChange} value={formData.slug} required />
        <input name="email" placeholder="Email" type="email" className="input input-bordered w-full" onChange={handleChange} value={formData.email} required />
        <select name="layout" className="select select-bordered w-full" onChange={handleChange} value={formData.layout}>
          <option value="webshop">Webshop</option>
          <option value="portfolio">Portfolio</option>
          <option value="landing">Landing Page</option>
        </select>
        <button type="submit" className="btn btn-success w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner" /> : "Create Company"}
        </button>
      </form>
    </div>
  )
}
