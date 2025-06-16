'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCompanyPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        email: '',
        layout: 'webshop',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('http://localhost:5000/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/companies')
            } else {
                console.error('Failed to create company')
            }
        } catch (err) {
            console.error('Error creating company:', err)
        }
    }

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create Company</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" placeholder="Company Name" className="input input-bordered w-full" onChange={handleChange} required />
                <input name="slug" placeholder="Slug (e.g. fonalvarazs)" className="input input-bordered w-full" onChange={handleChange} required />
                <input name="email" placeholder="Email" type="email" className="input input-bordered w-full" onChange={handleChange} required />

                <select name="layout" className="select select-bordered w-full" onChange={handleChange} value={formData.layout}>
                    <option value="webshop">Webshop</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="landing">Landing Page</option>
                </select>

                <button type="submit" className="btn btn-primary w-full">Create Company</button>
            </form>
        </div>
    )
}