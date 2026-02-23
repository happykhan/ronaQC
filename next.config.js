/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Fix for WebAssembly in web workers
    if (!isServer) {
      config.output.globalObject = 'self';
    }

    return config;
  },
};

module.exports = nextConfig;
