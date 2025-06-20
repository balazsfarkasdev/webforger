'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function LoginModal() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const auth = localStorage.getItem('client-auth')
        if (auth) setIsLoggedIn(true)
    }, [])

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message || 'Login failed')

            localStorage.setItem('client-auth', 'ok')
            localStorage.setItem('company-id', data.companyId)
            setIsLoggedIn(true)
            toast.success('Logged in successfully!')
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