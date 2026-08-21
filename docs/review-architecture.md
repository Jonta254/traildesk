# Production review architecture

TrailDesk currently has zero published community reviews. Browser-local drafts are unpublished and excluded from aggregate ratings.

A production service needs authenticated submission, explicit publication consent, server-side validation, rate limiting, abuse screening, and a moderation queue. Published entries should retain an audit history for edits, moderation decisions, reports, verification level, helpful votes, deletion requests, and appeals. Personal contact details, precise itineraries, and sensitive medical information must be rejected or redacted before publication.

Reviewer identity should be private by default. Public display names must be distinct from authentication identifiers. Verification levels should describe evidence reviewed without implying that TrailDesk verified safety or route conditions. Aggregate ratings may be computed only from genuine published records and must be removed when the underlying record is withdrawn.

Deletion and appeal workflows need documented response times and accountable moderator actions. Backups, retention periods, jurisdiction, breach response, and data-subject access must be settled before enabling backend submission.
