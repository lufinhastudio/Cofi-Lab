/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const privateHeaders = [
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "private, no-store" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" }
];

// Las URLs del sitio anterior (link en bio, Google) siguen funcionando.
const legacyClientSlugs = ["angus", "casuna", "uruguai", "bahillo", "izone", "aba"];

const nextConfig = {
  poweredByHeader: false,
  images: {
    // Cloudinary redimensiona y elige formato (ver lib/imageLoader.js).
    loader: "custom",
    loaderFile: "./lib/imageLoader.js"
  },
  async redirects() {
    return [
      { source: "/about", destination: "/nosotras", permanent: true },
      { source: "/portfolio", destination: "/clientes", permanent: true },
      { source: "/contact", destination: "/contacto", permanent: true },
      ...legacyClientSlugs.map((slug) => ({ source: `/${slug}`, destination: `/clientes/${slug}`, permanent: true }))
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/admin/:path*", headers: privateHeaders },
      { source: "/api/admin/:path*", headers: privateHeaders }
    ];
  }
};

export default nextConfig;
