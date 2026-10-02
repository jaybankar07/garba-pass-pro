# Sanjivani Garba frontend prototype

## Build
- Replace the starter homepage with a polished public event page and a consistent, responsive university/event visual system.
- Create the student journey: register and log in with mock credentials, complete a profile with locally previewed/persisted photos, review the single ticket, simulate payment, and display a downloadable/printable ticket with a frontend-generated QR code.
- Create `/gate` as a mobile-first dark scanner view with camera scanning when supported and manual token entry. Validate the mock ticket, persist the first check-in and gate/time, and deny reuse.
- Create `/admin` with live local ticket statistics, gate availability, and recent check-ins. Student, gate, and admin screens read and update the same browser-stored prototype data.
- Add route metadata, accessible controls and validation, loading/success/error states, empty states, and narrow-screen layouts. Keep all behavior frontend-only; do not add Cloud, APIs, real authentication, or payment processing.

## Implementation approach
- Keep the existing TanStack Start/React/TypeScript foundation; it is the available Vercel-compatible React starter. Use file-based routes and shared UI/state helpers, with localStorage and cross-tab storage updates as the mock persistence layer.
- Reuse installed UI components and icons where practical. Add only lightweight QR-generation/scanning packages if required for real browser QR encoding and camera decoding. Compress selected images before storing them locally.
- Record the shared frontend state and route organization in the project guidance, then verify the booking-to-check-in flow, persistence, duplicate denial, admin updates, responsive layouts, tests, and current build status.
