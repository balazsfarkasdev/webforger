'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CreateCompanyComponent from './components/create/page'

type Company = {
    id: string
    name: string
    slug: string
    email: string
    layout: string
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [editingCompany, setEditingCompany] = useState<Company | null>(null)

    const fetchCompanies = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5000/api/companies')
            const data = await res.json()
            setCompanies(data)
        } catch (error) {
            console.error('Error fetching companies:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCompanies()
    }, [])

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editingCompany) {
            setEditingCompany({ ...editingCompany, [e.target.name]: e.target.value })
        }
    }

    const handleUpdate = async () => {
        if (!editingCompany) return

        try {
            const res = await fetch(`http://localhost:5000/api/companies/${editingCompany.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingCompany),
            })

            if (res.ok) {
                toast.dismiss()
                toast.success("Company updated successfully!")
                await fetchCompanies()
                setEditingCompany(null)
            } else {
                toast.dismiss()
                toast.error("Failed to update company")
            }
        } catch (error) {
            toast.dismiss()
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="p-8 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold mb-6">Companies</h1>
            {loading ? (
                <span className="loading loading-spinner text-primary"></span>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Email</th>
                                <th>Layout</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => (
                                <tr key={company.id}>
                                    <td>{company.name}</td>
                                    <td>{company.slug}</td>
                                    <td>{company.email}</td>
                                    <td>{company.layout}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline" onClick={() => setEditingCompany(company)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {editingCompany && (
                        <div className="mt-10 p-6 border rounded-lg shadow-md bg-base-200">
                            <h2 className="text-xl font-semibold mb-4">Edit Company</h2>
                            <div className="space-y-4">
                                <input
                                    name="name"
                                    value={editingCompany.name}
                                    onChange={handleEditChange}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    name="slug"
                                    value={editingCompany.slug}
                                    onChange={handleEditChange}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    name="email"
                                    value={editingCompany.email}
                                    onChange={handleEditChange}
                                    className="input input-bordered w-full"
                                />
                                <select
                                    name="layout"
                                    value={editingCompany.layout}
                                    onChange={handleEditChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="webshop">Webshop</option>
                                    <option value="portfolio">Portfolio</option>
                                    <option value="landing">Landing Page</option>
                                </select>

                                <button className="btn btn-success w-full" onClick={handleUpdate}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    <CreateCompanyComponent onCreated={fetchCompanies} />

                </div>
            )}
        </div>
    )
}
