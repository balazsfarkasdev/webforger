'use client'

import { SectionData } from '@client/types/sections'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import { uploadToCloudinary } from '@client/utils/uploadToCloudinary'

interface NavbarSectionProps {
    section: SectionData
    onUpdate: (updatedSection: SectionData) => void
    loading?: boolean
}

export const NavbarSection = ({ section, onUpdate, loading }: NavbarSectionProps) => {
    const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const url = await uploadToCloudinary(file)
            onUpdate({
                ...section,
                content: {
                    ...section.content,
                    logo: url,
                },
            })
            toast.success('Logo uploaded!')
        } catch (err) {
            toast.error('Upload failed')
        }
    }

    return (
        <div className="space-y-4">
            <div className="form-control">
                <label className="block font-medium">Logo</label>
                <div
                    className="w-32 h-32 relative border rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => document.getElementById(`logo-upload-${section.type}`)?.click()}
                >
                    <Image
                        src={
                            section.content.logo?.length
                                ? section.content.logo
                                : 'https://cdn1.iconfinder.com/data/icons/office-426/32/office-06022020-13-512.png'
                        }
                        alt="Logo preview"
                        fill
                        className="object-contain"
                    />
                </div>
                <input
                    id={`logo-upload-${section.type}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={loading}
                />
            </div>

            <div className="form-control">
                <label className="label">Navigation Links</label>
                {/* Add navigation links editor here */}
            </div>
        </div>
    )
}