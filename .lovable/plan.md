

## Align NOMI's visual identity with the pitch deck

Re-skin the app to match the deck's sky-cyan brand while keeping all current layouts and the soft warm-grey background intact.

### Palette shift (`src/index.css`)

| Token | Current | New |
|---|---|---|
| `--primary` | 210 65% 45% (navy) | **194 80% 49%** (sky cyan) |
| `--ring` | 210 65% 45% | 194 80% 49% |
| `--nomi-blue` | 210 65% 45% | 194 80% 49% |
| `--nomi-blue-soft` | 210 60% 94% | 194 75% 95% |
| `--nomi-blue-dark` | 215 50% 22% | 200 50% 18% |
| `--nav-active` | navy | cyan |
| `--ai-card` | 215 30% 95% | 194 60% 96% |
| `--nutrient-carbs` / `--nutrient-fluids` | navy/teal | nudged toward cyan family for chart cohesion |
| `--background` | 210 20% 98% (soft warm grey) | **unchanged** |
| `--foreground` | 215 25% 15% | 220 15% 10% (slightly deeper for headline contrast) |

Yellow / red / green / amber accents stay — they already match the deck's secondary palette.

### Logo

- Extract the hand-drawn cyan NOMI logo from the pitch deck and save to `src/assets/nomi-logo.png`.
- Use it in:
  - `Landing.tsx` hero (replaces / sits above the "NOMI" wordmark)
  - Top-left brand spot on `DietitianDashboard.tsx`
  - Small mark on `OneTimeVisit.tsx` header
- Bottom nav stays icon-only (no logo) to preserve space.

### Typography polish

Bump screen titles from `text-2xl font-bold` → `text-3xl font-bold tracking-tight` in:
- `TodayScreen.tsx`, `SummaryScreen.tsx`, `CalendarScreen.tsx`, `LogScreen.tsx`, `ProfileScreen.tsx`
- `Landing.tsx` and `OneTimeVisit.tsx` heroes

Body copy sizes unchanged (readability for older users preserved).

### Surface refinements

- `NomiIntelligence.tsx`: confirm it consumes `bg-ai-card` so insights pick up the new cyan tint automatically.
- `DietitianDashboard.tsx`: stat highlights and active row borders pick up new cyan via tokens — no structural change.
- `BottomNav.tsx`: active tab re-skins automatically via `--nav-active`.

### Files touched

- `src/index.css`
- `src/assets/nomi-logo.png` (new)
- `src/pages/Landing.tsx`
- `src/pages/OneTimeVisit.tsx`
- `src/pages/DietitianDashboard.tsx`
- `src/screens/TodayScreen.tsx`, `SummaryScreen.tsx`, `CalendarScreen.tsx`, `LogScreen.tsx`, `ProfileScreen.tsx`
- `src/components/NomiIntelligence.tsx` (verify token usage only)

### Out of scope

- No layout rewrites, no new screens, no component restructuring.
- No dark mode work.
- Background stays soft warm grey as requested.

