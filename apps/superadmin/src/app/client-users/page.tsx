'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type ClientUser = {
    id: string
    email: string
    password: string
    firstName: string
    lastName: string
    companyId: string
    company?: { name: string }
}

export default function ClientUsersPage() {
    const [users, setUsers] = useState<ClientUser[]>([])
    const [form, setForm] = useState<Partial<ClientUser>>({})
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5000/api/client-users')
            const data = await res.json()
            setUsers(data)
        } catch (e) {
            toast.error('Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleSubmit = async () => {
        const url = editingId
            ? `http://localhost:5000/api/client-users/${editingId}`
            : 'http://localhost:5000/api/client-users'
        const method = editingId ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            if (res.ok) {
                toast.success(editingId ? 'Updated' : 'Created')
                setForm({})
                setEditingId(null)
                fetchUsers()
            } else toast.error('Failed to save user')
        } catch (e) {
            toast.error('Error')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return

        try {
            const res = await fetch(`http://localhost:5000/api/client-users/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Deleted')
                fetchUsers()
            } else toast.error('Delete failed')
        } catch (e) {
            toast.error('Error deleting user')
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Client Users</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                    className="input input-bordered"
                    placeholder="Email"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    className="input input-bordered"
                    placeholder="Password"
                    value={form.password || ''}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <input
                    className="input input-bordered"
                    placeholder="First Name"
                    value={form.firstName || ''}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                <input
                    className="input input-bordered"
                    placeholder="Last Name"
                    value={form.lastName || ''}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                <input
                    className="input input-bordered col-span-2"
                    placeholder="Company ID"
                    value={form.companyId || ''}
                    onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                />

                <button className="btn btn-primary col-span-2" onClick={handleSubmit}>
                    {editingId ? 'Update User' : 'Create User'}
                </button>
            </div>

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.email}</td>
                            <td>{u.firstName} {u.lastName}</td>
                            <td>{u.company?.name || '-'}</td>
                            <td>
                                <button className="btn btn-xs btn-outline" onClick={() => {
                                    setForm(u)
                                    setEditingId(u.id)
                                }}>
                                    Edit
                                </button>
                                <button className="btn btn-xs btn-error ml-2" onClick={() => handleDelete(u.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}