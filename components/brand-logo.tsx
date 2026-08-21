import Image from "next/image";

export function BrandLogo({compact=false}:{compact?:boolean}){
  return <span className="brand" aria-label="TrailDesk home">
    <span className="brand-mark" aria-hidden="true"><Image src="/traildesk-mark.svg" alt="" width={32} height={32} priority /></span>
    {!compact&&<span className="brand-name">TrailDesk</span>}
  </span>;
}
