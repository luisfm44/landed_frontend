import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "**.ebayimg.com" },
      { protocol: "https", hostname: "**.reverbcdn.com" },
      { protocol: "https", hostname: "reverb-res.cloudinary.com" },
      { protocol: "https", hostname: "**.audiogon.com" },
      { protocol: "https", hostname: "**.usaudiomart.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
