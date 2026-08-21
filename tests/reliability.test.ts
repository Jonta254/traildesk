import {describe,expect,it} from "vitest";
import {isValidIsoDate,parseTrash,parseTrips,tripBrief,validateTripDates,validateTripImport,type SavedTrip} from "../app/lib/trips";

const trip:SavedTrip={schemaVersion:2,id:"trip-1",name:"Mount Kenya plan",region:"Kenya",date:"2026-09-10",expectedReturn:"2026-09-14T16:00",duration:"4 days",distance:"",type:"Multi-day",routeVariant:"Sirimon–Chogoria",accessLocation:"Sirimon Gate",transportNotes:"4WD transfer",accommodationStyle:"Huts",guideDetails:"Local operator",permitStatus:"Arranged",groupSize:"3",medicalNotes:"Allergy noted",notes:"Turnaround plan recorded",contactName:"Amina",contactPhone:"+254700000000",checkInPlan:"Every evening at 18:00",gear:[],coordinates:{lat:-0.1521,lng:37.3084},officialSources:[{label:"Kenya Wildlife Service",url:"https://www.kws.go.ke/"}],status:"draft",createdAt:"2026-08-21T00:00:00.000Z",updatedAt:"2026-08-21T00:00:00.000Z"};

describe("trip reliability",()=>{
  it("rejects corrupted storage without throwing",()=>expect(parseTrips("{bad").error).toMatch(/could not be parsed/));
  it("migrates compatible records and rejects invalid ones",()=>expect(parseTrips(JSON.stringify([trip,{name:"missing id"}])).recovered).toBe(1));
  it("detects import id conflicts",()=>expect(validateTripImport([trip],[trip]).conflicts).toEqual(["trip-1"]));
  it("validates native ISO dates and chronology",()=>{expect(isValidIsoDate("2026-09-10")).toBe(true);expect(isValidIsoDate("09/10/2026")).toBe(false);expect(validateTripDates("2026-09-10","2026-09-09T12:00")).toMatch(/after departure/)});
  it("expires deleted records after 30 days",()=>{const recent=JSON.stringify([{trip,deletedAt:"2026-08-20T00:00:00.000Z"}]);expect(parseTrash(recent,Date.parse("2026-08-21T00:00:00.000Z"))).toHaveLength(1);expect(parseTrash(recent,Date.parse("2026-10-21T00:00:00.000Z"))).toHaveLength(0)});
  it("produces a complete monitored-state disclaimer",()=>{const brief=tripBrief(trip);expect(brief).toContain("Sirimon Gate");expect(brief).toContain("Kenya Wildlife Service");expect(brief).toContain("does not monitor")});
});
