# Security

## Security Boundary

Firebase Auth and Firestore rules are the primary security boundary.

Frontend checks improve user experience, but they do not replace Firestore rules.

## Data Access Rules

Security-sensitive files:

- `firestore.rules`
- `(storage.rules)`
- `src/app/services/auth.service.ts`
- `src/app/guards/auth.guard.ts`
- `src/app/guards/admin.guard.ts`
- Firebase and deployment configuration files

## Secrets

Never commit:

- Firebase service account keys
- SSH private keys
- ALL-INKL credentials
- API keys that are not intended for public frontend use
- `.env` files with real credentials

GitHub deployment secrets must stay in GitHub Secrets.

## Review Checklist

For any auth, rules, or deployment change, check:

- Can an unauthenticated user access protected data?
- Can a normal user create or edit another user's data?
- Can a normal user create non-open bookings?
- Can a normal user update or delete bookings?
- Are admin-only operations protected by Firestore rules?
- Are secrets excluded from logs and commits?

## Known Security Questions

- Confirm whether signed-in users should be allowed to read all bookings or only their own bookings.
- Confirm whether users should be able to read all user documents during the current registration flow.

## Latest Review

See `docs/firestore-rules-review.md` for the 2026-06-24 review of the current Firestore rules and the accepted MVP risks.
