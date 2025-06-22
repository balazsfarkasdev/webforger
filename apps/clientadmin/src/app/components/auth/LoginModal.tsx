'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@store/useAuthStore'
import { useCompanyStore } from '@client/store/useCompanyStore'

export default function LoginModal() {
    const router = useRouter()
    const { isLoggedIn, login } = useAuthStore()
    const { setCompanyData } = useCompanyStore()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            const res = await fetch(`${window.api}/auth/clientadmin-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Login failed')

            const fetchCompany = async () => {
                try {
                    const res = await fetch(`${window.api}/companies/${data?.companyId}`)
                    const companyResData = await res.json()

                    if (res.ok) {
                        setCompanyData(companyResData)
                    }
                } catch (err) {
                    toast.error('Failed to load section data.')
                }
            }

            await fetchCompany()

            login({
                id: data.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                companyId: data.companyId
            }) // Update Zustand store
            toast.success('Logged in successfully!')
            router.push('/')
            router.refresh()
        } catch (err) {
            toast.error('Invalid credentials')
        }
    }

    if (isLoggedIn) return null

    return (
        <dialog id="login_modal" className="modal modal-open">
            <div className="modal-box space-y-4">
                <h3 className="font-bold text-lg">Client Login</h3>
                <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="modal-action">
                    <button className="btn btn-primary w-full" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        </dialog>
    )
}
