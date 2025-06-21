'use client'
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const company = JSON.parse(localStorage?.getItem('company') || {})
  useEffect(() => {
    document.title = `${company?.companyName || ''} - Admin`
  }, [])

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content w-full flex-col lg:flex-row">
          <div className="w-full max-w-7xl">
            <h1 className="text-5xl font-bold">Hi {company?.firstName}!</h1>
            <p className="py-6">
              Start creating your website!
            </p>
            <Link href='/dashboard' className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </div>
    </>
  );
}