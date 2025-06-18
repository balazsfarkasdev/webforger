'use client'

import { useEffect, useState } from 'react'
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

    useEffect(() => {
        const fetchCompanies = async () => {
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

        fetchCompanies()
    }, [])

    return (
        <div className="p-8">
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
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => (
                                <tr key={company.id}>
                                    <td>{company.name}</td>
                                    <td>{company.slug}</td>
                                    <td>{company.email}</td>
                                    <td>{company.layout}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CreateCompanyComponent/>
                </div>
            )}
        </div>
    )
}