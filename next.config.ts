import type {NextConfig} from "next";

const csp=["default-src 'self'","script-src 'self' 'unsafe-inline'","style-src 'self' 'unsafe-inline'","img-src 'self' data: blob:","font-src 'self'","connect-src 'self'","frame-src https://maps.google.com","object-src 'none'","media-src 'self'","worker-src 'self' blob:","frame-ancestors 'none'","base-uri 'self'","form-action 'self'","upgrade-insecure-requests"].join("; ");
const headers=[
  {key:"Content-Security-Policy",value:csp},
  {key:"Cross-Origin-Opener-Policy",value:"same-origin"},
  {key:"Cross-Origin-Resource-Policy",value:"same-origin"},
  {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(self), payment=(), usb=(), browsing-topics=()"},
  {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
  {key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains; preload"},
  {key:"X-Content-Type-Options",value:"nosniff"},
  {key:"X-Frame-Options",value:"DENY"},
];
const nextConfig:NextConfig={poweredByHeader:false,compress:true,turbopack:{root:process.cwd()},async headers(){return[{source:"/(.*)",headers}]}};
export default nextConfig;
