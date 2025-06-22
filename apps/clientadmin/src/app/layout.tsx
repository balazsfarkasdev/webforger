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
  useEffect(() => {
    window.api = 'http://localhost:5000/api';
  }, []);

  const { isLoggedIn, userData, setUserData } = useAuthStore()
  const { companyData, setCompanyData } = useCompanyStore()

  useEffect(() => {
    const fetchCompany = async () => {
      if (!isLoggedIn || !companyData?.id) return;

      try {
        const res = await fetch(`${window.api}/companies/${companyData.id}`);
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
  }, [isLoggedIn, companyData?.id, setCompanyData]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn || !userData?.id) return;

      try {
        const res = await fetch(`${window.api}/client-users/${userData?.id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch user data: ${res.status}`);
        }
        const data = await res.json();
        setUserData({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          companyId: data.companyId
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast.error('Failed to load user data. Please try again.');
      }
    };

    fetchUser()
  }, [isLoggedIn, userData?.id, setUserData]);

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
