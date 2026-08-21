# TrailDesk

TrailDesk is a practical international trail discovery and trip-preparation workspace. It combines a structured, cited destination catalogue with browser-local trip records, gear reviews, and unpublished traveller-review drafts.

## Current product

- Search and filter 36 destinations across Africa, Europe, Asia, North America, South America, and Oceania.
- Open a statically generated editorial guide for every destination.
- Review coordinates, precision labels, real Google Maps searches and directions, and official-reference links.
- Start an editable plan with only reliable destination context prefilled.
- Create, edit, duplicate, search, sort, update, copy, print, export, and import browser-local trips.
- Review ten structured gear templates with base, consumable, worn, and total selected weight.
- Prepare a local traveller-review draft. No review is published and no aggregate rating is displayed.

Africa remains the catalogue's largest regional collection with 12 destinations and 12 credited local photographs. International entries without a completed local photography licence review use a geographic coordinate treatment instead of a fabricated or miscredited image.

## Product boundaries

TrailDesk is not a booking service, navigation system, live tracker, weather provider, emergency-response service, guide marketplace, park authority, or social network. It does not draw route polylines, download offline maps, verify conditions, contact emergency contacts, or publish review drafts.

Google Maps and external official sources require internet. A location pin identifies a stated destination, access area, or trailhead; it is not a complete hiking route.

## Local storage and compatibility

- Trips preserve the existing `traildesk_trips` key and migrate compatible version-one records into schema version 2 when read.
- Gear preserves the existing `traildesk_gear_v1` key.
- Review drafts use one `traildesk_review_draft_v1_<destination-id>` key per destination.

All three remain in the current browser profile. There is no account, cloud backup, cross-device sync, moderation database, or server recovery. Trip backup export and validated import are available.

## Data and photography

Each destination record includes coordinates with a precision label, structured route facts, planning notes, official-source links, related routes, and a `lastReviewedAt` date. `validateDestinations` checks IDs, slugs, coordinates, difficulty and continent values, official sources, image paths, and related IDs.

Verified African photographs are stored in `public/explore`. Credits are exposed in the interface and in `public/explore/credits.json`. Do not add a photograph without recording its author, source, and licence.

## Development

Requires Node.js 22 and pnpm 10.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Production roadmap

The following require separate infrastructure and policy work:

1. A moderation backend and genuine published-review retrieval.
2. Accounts, encrypted server storage, export/deletion controls, and cross-device sync.
3. Licensed offline map tiles, GPX architecture, and specialist navigation review.
4. Current weather and closure providers with freshness and failure states.
5. Real guide, permit, booking, or emergency integrations.
6. A completed licence review and locally hosted photography set for every international record.
7. Ongoing editorial review with responsible regional authorities.
