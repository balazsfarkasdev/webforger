'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@store/useAuthStore'

export default function LoginModal() {
    const router = useRouter()
    const { isLoggedIn, login } = useAuthStore()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        // Check localStorage only on first load
        const stored = localStorage.getItem('company')
        if (stored) {
            const parsed = JSON.parse(stored)
            login(parsed)
        }
    }, [login])

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/superadmin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Login failed')

            const userData = {
                companyId: data.companyId,
                firstName: data.firstName,
                lastName: data.lastName,
            }

            localStorage.setItem('client-auth', 'ok')
            localStorage.setItem('company', JSON.stringify(userData))

            login(userData) // Update Zustand store
            toast.success('Logged in successfully!')
            router.push('/')
            window.location.reload()
        } catch (err) {
            toast.error(err.message || 'Invalid credentials')
        }
    }

    if (isLoggedIn) return null

    return (
        <dialog id="login_modal" className="modal modal-open">
            <div className="modal-box space-y-4">
                <h3 className="font-bold text-lg">Superadmin Login</h3>
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