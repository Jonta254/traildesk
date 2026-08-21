# Local data and recovery

TrailDesk stores trips under the stable `traildesk_trips` key using schema version 2. Compatible older records are migrated on read; malformed records are skipped and surfaced to the interface instead of silently overwriting the source value.

Deleted trips can be stored under `traildesk_trips_trash_v1`. The retention contract is 30 days. Expired trash is ignored during reads. A production UI must write both the active list and trash entry successfully before reporting a deletion as complete.

Imports are runtime-validated. A matching record ID is a conflict, not permission to overwrite. The interface should offer keep-existing, replace, or import-as-copy after showing a preview. Exported records include provenance timestamps and the schema version.

Browser storage is not encrypted by TrailDesk. Anyone with access to the browser profile may be able to read emergency contacts, dates, route details, and medical notes. Records do not synchronize automatically, and clearing site data removes them. Users should export backups and avoid unnecessary sensitive medical detail.

Storage quota, disabled storage, and corrupt JSON must result in a visible error. No mutation should be reported as saved until the storage write succeeds.
