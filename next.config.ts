import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/form',
            '@mantine/dates',
        ],
    },
};

export default nextConfig;
