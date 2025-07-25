/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "./standalone": ["./node_modules/@swc/helpers"],
  },
};

module.exports = nextConfig;
