import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name:"TrailDesk",short_name:"TrailDesk",description:"Research and prepare African treks.",start_url:"/",display:"browser",background_color:"#0b0e0c",theme_color:"#0b0e0c" };
}
