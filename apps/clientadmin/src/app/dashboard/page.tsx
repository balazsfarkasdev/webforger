'use client'
import React, { useEffect } from 'react'
import SectionManager from './section-manager/SectionManager'
import { useCompanyStore } from '@client/store/useCompanyStore'

const DashboardPage = () => {
  const { companyData } = useCompanyStore();

  useEffect(() => {
    console.log('companyData:', companyData); // Debug state changes
    document.title = companyData?.name
      ? `${companyData.name} - Dashboard`
      : 'Dashboard';
  }, [companyData, companyData?.name]);

  if (!companyData) {
    return <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content w-full flex-col lg:flex-row self-start">
        <div className='w-6xl'>
          <h1 className="text-5xl font-bold">Dashboard</h1>
          <p>No company data available</p>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content w-full flex-col lg:flex-row self-start">
        <div className='w-6xl'>
          <h1 className="text-5xl font-bold">{companyData?.name} Dashboard</h1>
          <SectionManager companyId={companyData?.id || ""} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage