'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function LogoutButton() {
    const router = useRouter()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('client-auth')
        setVisible(!!isLoggedIn)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('client-auth')
        localStorage.removeItem('company-id')
        toast.success('Logged out successfully')
        router.push('/')
    }

    if (!visible) return null

    return (
        <button className="btn btn-sm btn-outline" onClick={handleLogout}>
            Logout
        </button>
    )
}