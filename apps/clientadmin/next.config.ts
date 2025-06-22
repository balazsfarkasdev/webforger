/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'cdn1.iconfinder.com'],
  },
}

module.exports = nextConfig