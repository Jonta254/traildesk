/* Photo attribution for /explore hero images.
   Real photographs sourced from Wikimedia Commons — see public/explore/credits.json.
   Every image is Public Domain / CC0 / CC-BY / CC-BY-SA; author + license credited in the UI. */
export interface PhotoCredit { author: string; license: string; licenseUrl: string; source: string; }
export interface GalleryPhoto extends PhotoCredit { src: string; alt: string; caption: string; }

export const DESTINATION_GALLERY: Record<string, GalleryPhoto[]> = {
  "kilimanjaro": [{ src: "/explore/gallery/kilimanjaro-trail.jpg", alt: "Trekkers crossing dark volcanic terrain in Kilimanjaro's Barranco Valley", caption: "Barranco Valley shows the scale, volcanic ground, and exposed weather of the upper mountain.", author: "Altezzatravel", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Trekking_Barranco_Valley_Kilimanjaro_Tanzania.jpg" }],
  "mount-kenya": [{ src: "/explore/gallery/mount-kenya-trail.jpg", alt: "A trekker above the glacier and rocky high peaks of Mount Kenya", caption: "High terrain toward Mackinder Valley, where altitude and exposed ground define the walking objective.", author: "John Spooner", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Mount_Kenya_towards_Mackinders.jpg" }],
  "rwenzori": [{ src: "/explore/gallery/rwenzori-trail.jpg", alt: "Dense montane forest in Uganda's Rwenzori Mountains", caption: "The Rwenzori approach begins in dense montane forest before reaching bog and high alpine terrain.", author: "Vincent Mugaba", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Forest_of_Rwenzori.jpg" }],
  "simien": [{ src: "/explore/gallery/simien-trail.jpg", alt: "Layered cliffs and deep valleys in Simien Mountains National Park", caption: "The Simien escarpment is a landscape of deep relief, long sightlines, and exposed plateau edges.", author: "Readaroo", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Simien_National_Park.jpg" }],
  "fish-river": [{ src: "/explore/gallery/fish-river-trail.jpg", alt: "Hikers crossing the rocky Fish River Canyon floor in Namibia", caption: "Inside the canyon, progress follows boulders and riverbed terrain with limited exit options.", author: "Roelf", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Hiking_in_the_Fish_River_Canyon_-_panoramio.jpg" }],
  "longonot": [{ src: "/explore/gallery/longonot-trail.jpg", alt: "Hikers climbing the steep dusty trail on Mount Longonot", caption: "The approach is short but steep, dusty, and exposed, with the crater landscape opening behind the climb.", author: "Steelux2", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Hiking_Trail_2_at_Mt_Longonot,_Kenya.jpg" }],
};
export const PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "kilimanjaro": {
    "author": "Sergey Pesterev",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kilimanjaro_from_Amboseli.jpg"
  },
  "mount-kenya": {
    "author": "Don Elvis Muraya",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:MtKenya.jpg"
  },
  "table-mountain": {
    "author": "Danie van der Merwe",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Table_Mountain_DanieVDM.jpg"
  },
  "simien": {
    "author": "Florian Fell",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Bwahit,_view_onto_Kidis_Yared_4453m.JPG"
  },
  "toubkal": {
    "author": "SimonKing74",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:My_Toubkal.jpg"
  },
  "drakensberg": {
    "author": "User:Bothar",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Amphitheatre_Drakensberg.jpg"
  },
  "rwenzori": {
    "author": "Nick06",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:1172_ruwenzori.jpg"
  },
  "meru": {
    "author": "Khalidsalewa",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Mount_meru_with_snow,_Arusha_Region,_Tanzania.jpg"
  },
  "fish-river": {
    "author": "RudiBosbouer",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Fish_River_Canyon_from_Main_View_Point.jpg"
  },
  "longonot": {
    "author": "RVBS",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Mount_Longonot_in_Kenya_01.jpg"
  },
  "mulanje": {
    "author": "africankelli",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Mount_Mulanje.jpg"
  },
  "hells-gate": {
    "author": "Ninara",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Hell%27s_Gate,_Kenya.jpg"
  }
};
