// components/ClientLayout.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoginModal from './auth/LoginModal'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('client-auth')
        if (!isLoggedIn) {
            router.push('/')
        } else {
            setAuthChecked(true)
        }
    }, [])

    if (!authChecked) {
        return <>
            <LoginModal />
        </>
        /*  return (
             <div className="h-screen flex items-center justify-center">
                 <span className="loading loading-spinner text-primary"></span>
             </div>
         ) */
    }

    return <>{children}</>
}