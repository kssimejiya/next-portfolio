import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';
import path from 'path';

// Define the nextConfig object with additional configurations
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  webpack: (config) => {
    // Add the existing GLTF/GLB loader
    config.module.rules.push({
      test: /\.(gltf|glb)$/,
      type: 'asset/resource',
    });

    // Add the CSS loader
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
      include: path.resolve('src'),
    });

    return config;
  },
};

// Export the configuration using withPlugins and withTM
export default withPlugins([
  withTM(['@loaders.gl/gltf', '@loaders.gl/core', 'three']),
], nextConfig);
