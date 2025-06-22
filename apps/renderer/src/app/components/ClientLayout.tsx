'use client'

import { useCompanyStore } from "@/store/useCompanyStore"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        window.api = 'http://localhost:5000/api';
    }, []);

    const { setCompanyData } = useCompanyStore()
    const searchParams = useSearchParams()

    useEffect(() => {
        const slug = searchParams.toString().replace('=', '')

        const fetchCompany = async () => {
            if (!slug) return;

            try {
                const res = await fetch(`${window.api}/companies/company/${slug}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch company data: ${res.status}`);
                }
                const data = await res.json();
                setCompanyData(data);
            } catch (err) {
                console.error('Error fetching company data:', err);
                toast.error('Failed to load company data. Please try again.');
            }
        };

        fetchCompany();
    }, [])

    return <>{children}</>
}
