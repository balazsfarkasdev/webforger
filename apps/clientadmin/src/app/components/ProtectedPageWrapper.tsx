'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedPageWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('client-auth')
        if (!isLoggedIn) {
            router.push('/')
        } else {
            setChecking(false)
        }
    }, [])

    if (checking) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-primary" />
            </div>
        )
    }

    return <>{children}</>
}