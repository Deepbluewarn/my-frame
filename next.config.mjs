/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                'localhost:3001',
                'wv93m9tn-3001.asse.devtunnels.ms'
            ]
        },
        serverComponentsExternalPackages: [
            'pino',
            'pino-pretty'
        ]
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
            };
        }

        return config;
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'myframe.s3.ap-northeast-2.amazonaws.com',
            port: '',
            pathname: '/**',
        }]
    }
}

export default nextConfig;
