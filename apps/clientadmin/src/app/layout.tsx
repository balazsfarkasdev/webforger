'use client'

import { Geist, Geist_Mono } from "next/font/google";
import toast, { Toaster } from 'react-hot-toast';
import "./globals.css";
import LoginModal from "./components/auth/LoginModal";
import Navbar from "./components/Navbar";
import ClientLayout from "./components/ClientLayout";
import { useEffect } from "react";
import { useCompanyStore } from "@client/store/useCompanyStore";
import { useAuthStore } from "@client/store/useAuthStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn } = useAuthStore()
  const { companyData, setCompanyData } = useCompanyStore()

  useEffect(() => {
    if (isLoggedIn && companyData?.companyId) {
      const fetchCompany = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/companies/${companyData?.companyId}`)
          const data = await res.json()

          if (res.ok) {
            setCompanyData(data)
          }
        } catch (err) {
          toast.error('Failed to load section data.')
        }
      }

      fetchCompany()
    }
  }, [isLoggedIn])

  return (
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} cz-shortcut-listen="true">
        <Toaster
          toastOptions={{
            className: 'bg-base-100 text-base-content shadow-lg',
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
        <ClientLayout>
          <Navbar />
          <LoginModal />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
