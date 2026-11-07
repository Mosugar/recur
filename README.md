# Recur

A minimalist, offline-first subscription tracker for iOS and Android.  
Track recurring payments, never miss a renewal, and understand where your money goes.

---

## Features

- **Dashboard** — monthly and yearly totals at a glance
- **Coming up** — payments due in the next 7 days highlighted with Today / Tomorrow labels
- **Add & Edit** — name, price, currency (EUR / USD / GBP / MAD), billing cycle, category, colour, notes
- **Swipe / long-press to delete** — with confirm dialog and haptic feedback
- **Stats** — animated SVG donut chart of spending by category, top-3 most expensive
- **Local notifications** — reminder the day before each payment, at a user-chosen time
- **FR / EN** — full localisation, switches instantly in Settings
- **Dark mode** — follows system by default, overridable in Settings
- **100% offline** — SQLite on-device storage, no account, no cloud

---

## Screenshots

> _Add screenshots / GIF here once available_

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | [Expo SDK 58](https://expo.dev) + [Expo Router v4](https://expo.github.io/router/) |
| Language | TypeScript (strict) |
| Styling | [NativeWind v4](https://nativewind.dev) (Tailwind CSS for React Native) |
| Animations | [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) |
| Gestures | react-native-gesture-handler |
| Charts | react-native-svg (custom animated donut) |
| Database | expo-sqlite (local, no server) |
| State | Zustand |
| i18n | i18next + react-i18next |
| Notifications | expo-notifications (local only) |
| Tests | Jest + jest-expo |

---

## Architecture

```
src/
├── app/                  # Expo Router screens
│   ├── (tabs)/           # Home · Stats · Settings tabs
│   └── subscription/     # new · [id] · edit/[id]
├── components/           # Shared UI (AmountText, DonutChart, EmptyState, …)
├── db/                   # SQLite schema, migrations, CRUD queries
├── store/                # Zustand stores (subscriptions, settings)
├── lib/                  # Pure business logic
│   ├── dates.ts          # nextPaymentDate, addMonths (month-end safe), daysUntil
│   ├── money.ts          # monthlyEquivalent, yearlyEquivalent, formatMoney
│   └── notifications.ts  # rescheduleAll, permission helpers
├── i18n/                 # en.json · fr.json
└── theme/                # Design tokens (colours, spacing, radii)
__tests__/                # Jest unit tests for src/lib
```

**Key decisions:**
- Prices stored as **integer cents** to avoid floating-point errors.
- `nextPaymentDate` is always **computed** from `firstPaymentDate + cycle`, never stored.
- Month-end handling: `addMonths` clamps to the last day of the target month (Jan 31 + 1 month → Feb 28/29).
- Notifications re-scheduled after every mutation so they stay accurate.

---

## Run locally

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then scan the QR code with **Expo Go** (iOS App Store / Android Play Store).  
Your phone and computer must be on the same Wi-Fi network.  
If the QR scan fails, press `s` in the terminal to switch to tunnel mode.

---

## Run tests

```bash
npm test
```

---

## Type-check & lint

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint src
```

---

## Build a production APK with EAS

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Configure your project (first time only):
   ```bash
   eas build:configure
   ```

3. Build an APK for Android:
   ```bash
   eas build --platform android --profile preview
   ```
   The `preview` profile produces an `.apk` (sideloadable). Use `production` for a Play Store `.aab`.

4. Build for iOS (requires Apple Developer account):
   ```bash
   eas build --platform ios
   ```

> See [EAS Build docs](https://docs.expo.dev/build/introduction/) for full configuration options.

---

## License

MIT
