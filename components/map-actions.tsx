"use client";
import { Check, Copy, ExternalLink, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { mapsDirectionsUrl, mapsSearchUrl, type Destination } from "@/app/lib/destinations";

export function MapActions({destination}:{destination:Destination}){
  const [copied,setCopied]=useState(false); const [online,setOnline]=useState(true);
  useEffect(()=>{const sync=()=>setOnline(navigator.onLine);sync();addEventListener("online",sync);addEventListener("offline",sync);return()=>{removeEventListener("online",sync);removeEventListener("offline",sync)}},[]);
  const coordinates=`${destination.coordinates.lat}, ${destination.coordinates.lng}`;
  const copy=async()=>{try{await navigator.clipboard.writeText(coordinates);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}};
  return <div className="map-actions"><div className="map-status"><span className={online?"is-online":"is-offline"}/><strong>{online?"Online map links available":"Offline — external maps unavailable"}</strong></div><p><MapPin size={16}/>{destination.coordinates.label}<small>{coordinates} · {destination.coordinates.precision.replace("-"," ")} reference</small></p><div className="cluster"><a className="button button-small" href={mapsSearchUrl(destination)} target="_blank" rel="noopener noreferrer">Open in Google Maps <ExternalLink size={14}/></a><a className="button button-small" href={mapsDirectionsUrl(destination)} target="_blank" rel="noopener noreferrer">Get directions <ExternalLink size={14}/></a><button className="button button-small" onClick={copy}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?"Copied":"Copy coordinates"}</button></div><p className="map-caveat">This pin marks the stated {destination.coordinates.precision.replace("-"," ")}, not a complete hiking route. Map services require internet.</p></div>;
}
