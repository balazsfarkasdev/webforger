'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CreateCompanyComponent from './components/create/page'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

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

    useEffect(() => {
        document.title = 'Companies'
    }, [])

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

    const deleteCompany = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/companies/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                toast.success('Company deleted successfully!')
                fetchCompanies()
            } else {
                toast.error('Failed to delete company')
            }
        } catch (error) {
            console.error('Error deleting company:', error)
            toast.error('Something went wrong')
        }
    }

    const handleDelete = (id: string) => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'This will permanently delete the company.',
            buttons: [
                {
                    label: 'Yes, delete it',
                    onClick: () => deleteCompany(id)
                },
                {
                    label: 'Cancel',
                    onClick: () => { } // semmi
                }
            ]
        })
    }

    return (
        <>
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
                                    <th colSpan={2}>Actions</th>
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
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline btn-error"
                                                onClick={() => handleDelete(company.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <CreateCompanyComponent
                            company={editingCompany || undefined}
                            onCreated={fetchCompanies}
                            onUpdated={() => {
                                fetchCompanies()
                                setEditingCompany(null)
                            }}
                            editingCompany={editingCompany}
                            setEditingCompany={setEditingCompany}
                        />
                    </div>
                )}
            </div>
        </>
    )
}
