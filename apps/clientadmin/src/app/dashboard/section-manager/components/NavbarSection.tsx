'use client'

import { SectionData } from '@client/types/sections'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { uploadToCloudinary } from '@client/utils/uploadToCloudinary'

interface NavLink {
    label: string
    path: string
}

interface NavbarSectionProps {
    section: SectionData
    onUpdate: (updatedSection: SectionData) => void
    loading?: boolean
}

export const NavbarSection = ({ section, onUpdate, loading }: NavbarSectionProps) => {
    const [newLink, setNewLink] = useState<NavLink>({ label: '', path: '' })
    const links: NavLink[] = section.content.links || []

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

    const handleAddLink = () => {
        if (!newLink.label || !newLink.path) {
            toast.error('Both label and path are required')
            return
        }

        const updatedLinks = [...links, newLink]
        onUpdate({
            ...section,
            content: {
                ...section.content,
                links: updatedLinks,
            },
        })
        setNewLink({ label: '', path: '' })
        toast.success('Link added!')
    }

    const handleRemoveLink = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index)
        onUpdate({
            ...section,
            content: {
                ...section.content,
                links: updatedLinks,
            },
        })
        toast.success('Link removed!')
    }

    const handleUpdateLink = (index: number, field: keyof NavLink, value: string) => {
        const updatedLinks = [...links]
        updatedLinks[index] = { ...updatedLinks[index], [field]: value }
        onUpdate({
            ...section,
            content: {
                ...section.content,
                links: updatedLinks,
            },
        })
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

            <div className="form-control space-y-4">
                <label className="label">Navigation Links</label>

                {/* Existing Links */}
                {links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            type="text"
                            className="input input-bordered flex-1"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(index, 'label', e.target.value)}
                            placeholder="Link Label"
                            disabled={loading}
                        />
                        <input
                            type="text"
                            className="input input-bordered flex-1"
                            value={link.path}
                            onChange={(e) => handleUpdateLink(index, 'path', e.target.value)}
                            placeholder="Link Path"
                            disabled={loading}
                        />
                        <button
                            className="btn btn-error btn-sm"
                            onClick={() => handleRemoveLink(index)}
                            disabled={loading}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {/* Add New Link */}
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={newLink.label}
                        onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                        placeholder="New Link Label"
                        disabled={loading}
                    />
                    <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={newLink.path}
                        onChange={(e) => setNewLink({ ...newLink, path: e.target.value })}
                        placeholder="New Link Path"
                        disabled={loading}
                    />
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAddLink}
                        disabled={loading}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}