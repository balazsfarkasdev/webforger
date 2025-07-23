'use client'

import { useCompanyStore } from "@/store/useCompanyStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { companyData } = useCompanyStore();

  useEffect(() => {
    document.title = companyData?.name
      ? `${companyData.name} - Dashboard`
      : 'Dashboard';
  }, [companyData, companyData?.name]);

  const heros = companyData?.pageSections?.filter(section => section.type === 'hero');

  return (
    <>
      {heros?.map((hero) => (
        <div
          key={hero.id}
          className="relative w-full bg-base-200 h-screen"
          style={{
            backgroundImage: hero.content?.backgroundImage
              ? `url(${hero.content.backgroundImage})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold">{hero?.content?.title}</h1>
            <p className="py-6">{hero?.content?.subtitle}</p>
            {hero?.content?.ctaLabel && hero?.content?.ctaPath && (
              <Link
                href={`/${hero.content.ctaPath}`}
                className="btn btn-primary"
              >
                {hero.content.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
