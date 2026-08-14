# TrailDesk

TrailDesk is a practical planning workspace for researching and preparing African treks. It is a Next.js application that combines a curated destination catalogue with browser-local trip plans and reusable gear checklists.

## What works today

- Browse 12 established African trekking destinations.
- Search by place, country, or trek type and filter by broad difficulty.
- Inspect credited local photography and general destination context.
- Open Google Maps embeds and external directions while online.
- Start a trip plan from a destination or from a blank form.
- Save route notes, dates, optional coordinates, contact-plan notes, and gear locally.
- Filter saved trips, update their status, and delete them with confirmation.
- Use and customise four reusable gear-list templates.

## What TrailDesk does not do

TrailDesk is not an emergency response, tracking, or navigation service. It does not download offline maps, monitor GPS, detect missed check-ins, send SMS alerts, synchronise weather, import or export GPX files, share plans, provide accounts, or synchronise data between devices. There is no subscription or checkout system.

Google Maps requires an internet connection. All destination information is a research starting point; users must confirm current access, route conditions, permits, guide requirements, and safety advice with official park authorities and qualified local operators.

## Local setup

Requirements: Node.js 22 and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality scripts

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm check
```

GitHub Actions runs install, lint, type checking, and a production build for pushes and pull requests targeting `master`.

## Browser storage

Trip plans use the `traildesk_trips` localStorage key. Reusable gear-list state uses `traildesk_gear_v1`. Data remains in the current browser profile only. Clearing site data, using private browsing, changing devices, or changing browsers may remove or isolate it. TrailDesk has no server backup.

Existing trip records are read defensively so corrupted or unavailable browser storage does not prevent the application from loading. Deletion always requires confirmation.

## Photo attribution

Destination photographs are stored in `public/explore`. Attribution is displayed with each expanded destination and documented in `public/explore/credits.json`. Preserve these records when changing imagery.

## Production roadmap

Future infrastructure should be treated as separate, security-reviewed work:

1. Versioned account storage, export, deletion, and cross-device sync.
2. Authoritative destination sources with review dates and structured citations.
3. A genuine offline mapping and GPX architecture with licensed map data.
4. Weather providers, freshness indicators, and failure states.
5. Explicitly consented sharing and contact workflows.
6. Safety and privacy review before any tracking or alert capability is described as operational.
7. Automated unit, integration, accessibility, and end-to-end tests.

## Safety limitation

Do not use TrailDesk as the sole record of a route or emergency plan. Carry appropriate maps, navigation tools, communications equipment, and emergency equipment; share plans through a dependable channel; and follow local professional guidance.

