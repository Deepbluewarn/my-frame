/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                'localhost:3001',
                '270zvh4l-3001.asse.devtunnels.ms'
            ]
        }
    }
}

export default nextConfig;
