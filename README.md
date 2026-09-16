# NUQTE platform

Next.js website, client workspace and staff CRM for Scan, Trade Mark and Bridge.

## Development

`npm ci`, `npm test`, `npm run build`, `npm run dev`.

## Launch configuration

Copy `.env.example` into a private environment. Configure PostgreSQL, APP_ORIGIN (exact HTTPS origin, no trailing slash), AUTH_PEPPER (random secret, at least 32 characters), Resend API key and verified MAIL_FROM. Run `npm run db:migrate` against the target database. After legal review of personal-data processing, hosting, retention, contracts and published policies, set PERSONAL_DATA_LAUNCH_APPROVED=true. Never commit credentials.

Users sign in through single-use email links. After a user verifies their email, an operator can run `npm run staff:grant -- email@example.com admin`. Role changes revoke existing sessions. No public role selection is available.

## Implemented

- Existing marketing design and service artwork preserved.
- Email-link authentication, revocable sessions, rate limits, origin validation.
- Three service applications, classes, attachments, case stages and evidence requirements.
- Owner/assigned-staff access checks, administrative assignment, task deadlines, correspondence, internal notes, audit events and in-app notifications.
- Migration and policy tests. PDF/PNG/JPEG attachments have a 3 MB limit and are stored in PostgreSQL for this initial implementation.

## Not connected / not complete

This is an initial implementation, not the complete business specification. Production authentication requires configured database and email. Qazpatent/WIPO search, image/phonetic similarity, generated expert reports, payment processing, token purchases, partner referrals/commissions, electronic signatures, automated statutory deadlines and external notifications are not implemented. Finance currently displays ledger entries only. Partner section accepts requests only. No registration or clearance guarantee is made. Full Kazakh workspace translation, licensed Gilroy webfonts, legal entity/contact details, approved legal documents, storage/backup/retention policies and production end-to-end verification remain launch work.

Deployment without configuration intentionally exposes the public site and a clearly labelled unavailable workspace, and does not accept client submissions.
