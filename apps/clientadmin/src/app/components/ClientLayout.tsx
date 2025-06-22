// components/ClientLayout.tsx
'use client'

import LoginModal from './auth/LoginModal'
import { useAuthStore } from '@client/store/useAuthStore'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuthStore()

    if (!isLoggedIn) {
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