/* Photo attribution for /explore hero images.
   Real photographs sourced from Wikimedia Commons — see public/explore/credits.json.
   Every image is Public Domain / CC0 / CC-BY / CC-BY-SA; author + license credited in the UI. */
export interface PhotoCredit { author: string; license: string; licenseUrl: string; source: string; }
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
