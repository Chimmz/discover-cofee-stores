/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   swcMinify: true,
   images: { domains: ['images.unsplash.com'] },
   env: {
      AIRTABLE_API_KEY: 'keyC3iNoVhCAk6n7Y',
      AIRTABLE_BASE_ID: 'app0qp6PbXi5P0wix',
   },
};

module.exports = nextConfig;
