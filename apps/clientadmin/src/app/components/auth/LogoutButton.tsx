'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthStore } from '@store/useAuthStore'

export default function LogoutButton() {
    const router = useRouter()
    const { isLoggedIn, logout } = useAuthStore()

    const handleLogout = () => {
        localStorage.removeItem('client-auth')
        localStorage.removeItem('company')
        logout()
        toast.success('Logged out successfully')
        router.push('/')
        window.location.reload()
    }

    if (!isLoggedIn) return null

    return (
        <button className="btn btn-sm btn-outline" onClick={handleLogout}>
            Logout
        </button>
    )
}