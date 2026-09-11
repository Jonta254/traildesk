# TrailDesk product research: from saved plan to usable departure brief

## Executive finding

TrailDesk should own the space between destination discovery and field navigation. Its strongest opportunity is not to imitate live mapping products; it is to help a hiker create a complete plan, identify missing information, run time-sensitive departure checks, and give a trusted contact a brief they can act on.

## Evidence

The U.S. National Park Service recommends leaving a trip plan, telling someone where the party is going and when to expect them back, checking current park conditions, carrying the Ten Essentials, and notifying the trusted contact after the trip. Its planning package also calls for a named trip leader, assessment of group capability, a safety leader, a Plan B, permits, and a trusted contact who is not on the trip.^1 ^2

AdventureSmart’s trip-plan tool centers saving, printing, and activating a plan for contacts, while warning that electronic delivery is not guaranteed and receipt should be confirmed.^3 This supports a TrailDesk check for confirmed receipt without claiming that TrailDesk sends or monitors anything.

The American Hiking Society treats essentials as systems rather than a proof of safety and stresses that hikers must know how to use navigation and first-aid equipment.^4 That supports checklist language based on review and capability—not a gamified “safety score.”

AllTrails and Gaia GPS compete primarily in on-trail navigation, offline maps, route building, and wrong-turn alerts.^5 ^6 Cairn adds location tracking and overdue notifications.^7 Those features require verified route geometry, mobile permissions, reliable messaging infrastructure, and strong operational guarantees. TrailDesk should not claim them until it has that infrastructure.

## Product decision

The first addition is a browser-local **Departure Check**. It:

- evaluates whether a saved brief contains dates, exact route, access point, trusted contact, check-in agreement, official sources, and navigation backup;
- prompts a current conditions and closure check;
- prompts permit, water, group capability, Plan B, navigation, and trusted-contact receipt checks;
- distinguishes durable planning information from checks that expire as conditions change;
- saves acknowledgements locally with a timestamp;
- produces a plain-text departure record without implying monitoring or certification.

## Recommended next stages

1. Add structured group-member roles and capability notes without storing unnecessary health detail.
2. Extend the completed post-trip close-out and lessons workflow with an export bundle that includes linked debriefs.
3. Add import-preview conflict choices across all local datasets.
4. Add a service worker only after an explicit offline-content inventory and update strategy exist.
5. Add accounts or contact delivery only with authentication, encryption, delivery receipts, audit history, rate limiting, and incident response.

## Sources

1. U.S. National Park Service, [Trip Planning Guide](https://www.nps.gov/subjects/healthandsafety/trip-planning-guide.htm), updated August 21, 2026.
2. U.S. National Park Service, [Trip Planning Guide Package](https://www.nps.gov/subjects/healthandsafety/upload/Trip-Planning-Guide-Package-508c.pdf).
3. AdventureSmart, [Trip Plan](https://plan.adventuresmart.ca/).
4. American Hiking Society, [The 10 Essentials of Hiking](https://americanhiking.org/10essentials/).
5. AllTrails, [Wrong-turn alerts](https://support.alltrails.com/hc/en-us/articles/37213407013908-Wrong-turn-alerts), May 5, 2025.
6. Gaia GPS, [Does Gaia GPS work offline?](https://help.gaiagps.com/hc/en-us/articles/115003639448-Does-Gaia-GPS-work-offline), December 3, 2024.
7. Cairn, [Mission and app features](https://www.cairnme.com/press).
