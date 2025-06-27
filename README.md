# WebForger

> ⚒️ Modular Website Builder for Multi-Tenant Platforms

WebForger is an interface of a modern website-as-a-service (WaaS) platform. It empowers clients to design and manage their own websites (portfolio, webshop, landing pages, etc.) through a fully customizable, drag-and-drop interface.

## 🔥 Why WebForger?

- ⚡️ Built with **Next.js**
- 🎨 Fully dynamic, **section-based page architecture**
- 🔧 Uses **Zustand** for intuitive global state management
- 🧠 **Multi-tenant architecture**: scales from single clients to SaaS-level deployments
- 📦 Modular `apps/*` structure: superadmin, clientadmin, studio, frontend
- ☁️ Image upload via **Cloudinary** integration
- 💅 Styled with **TailwindCSS + DaisyUI** – clean, maintainable UI
- 💾 Real-time section updates, autosaving coming soon

## 🧩 Technologies

| Stack           | Usage                     |
|-----------------|---------------------------|
| Next.js         | Fullstack React framework |
| Zustand         | Global state management   |
| MongoDB         | Multi-tenant data storage |
| TailwindCSS     | Component styling         |
| Cloudinary      | Media storage             |
| React Hook Form | Form handling             |
| Prisma          | Type-safe DB ORM          |


## ✨ Features (WIP)

- [x] Add, reorder, or delete website sections
- [x] Upload and preview logos/images
- [x] Custom styles per section (alignment, theme)
- [x] Save and load client-specific layouts
- [ ] Theme presets (light/dark/custom)
- [ ] Live preview mode
- [ ] Export to static or dynamic frontend

## 🧠 Developer Notes

- Codebase follows **clean architecture** principles
- `SectionRenderer` dynamically renders components from config
- `SECTION_CONFIG` keeps section logic decoupled and scalable
- Easily add new section types via `types/sections.ts` and `components/sections/*`

| Created with care by Farkas Balázs – Full-Stack Developer |
## node v22.17.0
## npm  v11.4.2