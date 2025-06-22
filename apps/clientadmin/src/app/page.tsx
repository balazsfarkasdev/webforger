'use client'
import { useAuthStore } from "@client/store/useAuthStore";
import Link from "next/link";

export default function Home() {
  const { userData } = useAuthStore()

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content w-full flex-col lg:flex-row">
          <div className="w-full max-w-7xl">
            <h1 className="text-5xl font-bold">Hi {userData?.firstName}!</h1>
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