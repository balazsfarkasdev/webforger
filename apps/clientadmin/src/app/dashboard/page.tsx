'use client'
import React, { useEffect } from 'react'
import SectionManager from './section-manager/SectionManager'

const DashboardPage = () => {
  const company = JSON.parse(localStorage?.getItem('company') || {})
  useEffect(() => {
    document.title = `${company?.companyName || ''} - Dashboard`
  }, [])

  return <>
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content w-full flex-col lg:flex-row self-start">
        <div className='w-6xl'>
          <h1 className="text-5xl font-bold">Dashboard</h1>
          <SectionManager companyId="cmbzax12g0001fut0di0fio0m" initialSections={['hero', 'footer']} />
        </div>
      </div>
    </div>
  </>
}

export default DashboardPage