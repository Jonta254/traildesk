import {describe,expect,it} from "vitest";
import {briefGaps,departureChecks,parseReadiness,readinessLabel,type ReadinessRecord} from "../app/lib/readiness";
import type {SavedTrip} from "../app/lib/trips";

const completeTrip:SavedTrip={schemaVersion:2,id:"ready-1",name:"Point Lenana",region:"Kenya",date:"2026-10-10",expectedReturn:"2026-10-14T16:00",duration:"4 days",distance:"",type:"Multi-day",routeVariant:"Sirimon–Chogoria",accessLocation:"Sirimon Gate",transportNotes:"",accommodationStyle:"",guideDetails:"",permitStatus:"Arranged",groupSize:"3",medicalNotes:"",notes:"",contactName:"Trusted contact",contactPhone:"+254000000",checkInPlan:"Message at 18:00; escalate after 12 hours",gear:["Navigation backup"],coordinates:null,officialSources:[{label:"KWS",url:"https://www.kws.go.ke/"}],status:"planned",createdAt:"2026-09-01T00:00:00.000Z",updatedAt:"2026-09-01T00:00:00.000Z"};

describe("departure readiness",()=>{
 it("identifies concrete gaps without a safety score",()=>{const gaps=briefGaps({...completeTrip,expectedReturn:undefined,contactPhone:"",gear:[]});expect(gaps).toContain("Add an expected return time.");expect(gaps).toContain("Record a trusted contact and a usable contact method.");expect(gaps).toContain("Review an independent navigation backup.")});
 it("requires every time-sensitive review prompt",()=>{expect(readinessLabel(completeTrip).label).toBe("Ready for departure review");const record:ReadinessRecord={schemaVersion:1,tripId:completeTrip.id,checks:departureChecks.map(item=>item.id),note:"Turn around at 14:00",updatedAt:"2026-10-09T08:00:00.000Z"};expect(readinessLabel(completeTrip,record).label).toBe("Departure review recorded")});
 it("safely rejects corrupt records and unknown check ids",()=>{expect(parseReadiness("not-json")).toEqual({});const parsed=parseReadiness(JSON.stringify({one:{checks:["water","invented"],note:"x",updatedAt:"now"}}));expect(parsed.one.checks).toEqual(["water"])});
});
