'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function LoginModal() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [companyId, setCompanyId] = useState('')

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
            toast.error(err.message || 'Invalid credentials')
        }
    }

    const handleRegister = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, companyId: companyId || null }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message || 'Registration failed')

            localStorage.setItem('client-auth', 'ok')
            localStorage.setItem('company-id', data.companyId)
            setIsLoggedIn(true)
            toast.success('Registered and logged in successfully!')
        } catch (err) {
            toast.error(err.message || 'Registration failed')
        }
    }

    if (isLoggedIn) return null

    return (
        <dialog id="login_modal" className="modal modal-open">
            <div className="modal-box space-y-4">
                <h3 className="font-bold text-lg">{isRegistering ? 'Client Registration' : 'Client Login'}</h3>
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
                {isRegistering && (
                    <input
                        type="text"
                        placeholder="Company ID (optional)"
                        className="input input-bordered w-full"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                    />
                )}
                <div className="modal-action space-y-2">
                    <button 
                        className="btn btn-primary w-auto" 
                        onClick={isRegistering ? handleRegister : handleLogin}
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                    <button 
                        className="btn btn-ghost w-auto"
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
                    </button>
                </div>
            </div>
        </dialog>
    )
}