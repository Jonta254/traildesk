import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:["/","/explore/","/regions","/gear","/about"],disallow:["/plan","/trips"]},sitemap:"https://traildesk.vercel.app/sitemap.xml"}}
