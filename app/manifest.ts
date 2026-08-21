import type {MetadataRoute} from "next";

export default function manifest():MetadataRoute.Manifest{
  return {
    name:"TrailDesk",
    short_name:"TrailDesk",
    description:"Research international trails and prepare a browser-local trip brief.",
    start_url:"/",
    display:"standalone",
    background_color:"#0b0e0c",
    theme_color:"#18382d",
    icons:[
      {src:"/traildesk-mark.svg",sizes:"any",type:"image/svg+xml",purpose:"any"},
      {src:"/traildesk-mark.svg",sizes:"any",type:"image/svg+xml",purpose:"maskable"},
    ],
  };
}
