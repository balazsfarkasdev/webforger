'use client'

import { useCompanyStore } from '@/store/useCompanyStore'
import Link from 'next/link'

export default function Navbar() {
  const { companyData } = useCompanyStore()
  const navLinks = companyData?.pageSections?.['navbar']?.content?.links

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="font-extrabold text-xl">
          WebForger
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {navLinks?.map((navLink) => (
            <li key={navLink?.path}>
              <Link href={navLink?.path || '#'} className="font-semibold">
                {navLink?.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}