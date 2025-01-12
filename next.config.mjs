import 'dotenv/config'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['ik.imagekit.io'],
    },
    env: {
        API_URL: process.env.API_URL,
    },
};

export default nextConfig;
