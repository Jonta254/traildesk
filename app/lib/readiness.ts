import type {SavedTrip} from "./trips";

export const READINESS_STORAGE_KEY="traildesk_readiness_v1";
export const READINESS_VERSION=1;
export const departureChecks=[
  {id:"conditions",label:"Current conditions, closures, and weather checked with the responsible authority"},
  {id:"permit",label:"Permit and access requirements confirmed"},
  {id:"navigation",label:"Independent navigation and a non-phone backup are ready"},
  {id:"water",label:"Water sources, capacity, and treatment plan confirmed"},
  {id:"group",label:"Route still matches the group’s current fitness, skills, and health"},
  {id:"plan-b",label:"A specific turnaround point or backup activity is agreed"},
  {id:"receipt",label:"Trusted contact received the brief and understands the overdue action"},
] as const;
export type DepartureCheckId=(typeof departureChecks)[number]["id"];
export interface ReadinessRecord{schemaVersion:1;tripId:string;checks:DepartureCheckId[];note:string;updatedAt:string}

export function parseReadiness(raw:string|null):Record<string,ReadinessRecord>{
  if(!raw)return{};
  try{const value:unknown=JSON.parse(raw);if(!value||typeof value!=="object")return{};const result:Record<string,ReadinessRecord>={};
    for(const [tripId,row] of Object.entries(value as Record<string,unknown>)){if(!row||typeof row!=="object")continue;const item=row as Record<string,unknown>;const checks=Array.isArray(item.checks)?item.checks.filter((id):id is DepartureCheckId=>departureChecks.some(check=>check.id===id)):[];result[tripId]={schemaVersion:1,tripId,checks,note:typeof item.note==="string"?item.note.slice(0,600):"",updatedAt:typeof item.updatedAt==="string"?item.updatedAt:""}}
    return result;
  }catch{return{}};
}

export function briefGaps(trip:SavedTrip){const gaps:string[]=[];
  if(!trip.date)gaps.push("Add a departure date.");
  if(!trip.expectedReturn)gaps.push("Add an expected return time.");
  if(!trip.routeVariant?.trim())gaps.push("Name the exact route or route variant.");
  if(!trip.accessLocation?.trim())gaps.push("Record the access point or trailhead.");
  if(!trip.contactName.trim()||!trip.contactPhone.trim())gaps.push("Record a trusted contact and a usable contact method.");
  if(!trip.checkInPlan.trim())gaps.push("Agree a manual check-in interval and overdue action.");
  if(!trip.officialSources?.length)gaps.push("Attach at least one responsible official source.");
  if(!trip.gear.some(item=>/navigation|map|compass|gps/i.test(item)))gaps.push("Review an independent navigation backup.");
  return gaps;
}

export function readinessLabel(trip:SavedTrip,record?:ReadinessRecord){const gaps=briefGaps(trip);const checked=record?.checks.length??0;
  if(gaps.length)return{label:"Brief needs work",detail:`${gaps.length} planning ${gaps.length===1?"gap":"gaps"} to resolve.`};
  if(checked<departureChecks.length)return{label:"Ready for departure review",detail:`${departureChecks.length-checked} departure ${departureChecks.length-checked===1?"check":"checks"} remaining.`};
  return{label:"Departure review recorded",detail:"All prompts were acknowledged. This is not a safety certification."};
}
