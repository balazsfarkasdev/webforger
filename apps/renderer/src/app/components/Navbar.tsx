'use client'

import { useCompanyStore } from '@/store/useCompanyStore'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const { companyData } = useCompanyStore()
  const navbar = companyData?.pageSections?.['navbar']
  const logo = navbar?.content?.logo
  const navLinks = navbar?.content?.links

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="font-extrabold text-xl flex flex-row items-center gap-2" >
          {logo && <Image src={logo} alt={`${companyData?.name} logo`}  width={60} height={60} className='rounded-full'/>}
          {companyData?.name}
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