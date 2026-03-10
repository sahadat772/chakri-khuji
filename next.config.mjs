import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  serverExternalPackages: ['mongoose', 'bcryptjs', 'nodemailer'],
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
