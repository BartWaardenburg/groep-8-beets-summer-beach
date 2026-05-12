# Beets Groep 8 Eindfeest

Persoonlijke RSVP-site voor het Groep 8 eindfeest. Iedere kind krijgt
een eigen QR-code, scant 'm en doorloopt een scroll-gedreven Pixar-
intro die eindigt op een save-the-date kaart met countdown en RSVP.
Aangemelde kids zien hun emoji bij hun naam in een groepsoverzicht.

Live: https://beets-eindfeest.vercel.app

## Stack

- Next.js 16 (App Router) op Vercel met Fluid Compute
- GSAP ScrollTrigger voor de scroll-gedreven video scrub
- Upstash Redis (via Vercel Marketplace) als RSVP store
- Plus Jakarta Sans + Inter, Phosphor icons, Tailwind v4
- Vitest voor unit tests

## Lokaal draaien

```bash
npm install
vercel env pull .env.local      # eenmalig, haalt Upstash + RSVP_SALT
npm run dev                     # http://localhost:3001
```

Zonder `.env.local` werkt de site nog steeds, maar de RSVP store valt
terug op een in-memory map die resets bij iedere reload.

## URLs en QR codes genereren

Iedere kind heeft een eigen `?code=<hash>` link, afgeleid van zijn naam
en de `RSVP_SALT` env var (server-side only). De codes zijn stabiel
zolang `RSVP_SALT` niet verandert.

```bash
# Lokale URLs (voor testen)
npm run gen-urls

# Productie URLs + QR PNGs voor op de fysieke kaartjes
BASE_URL=https://beets-eindfeest.vercel.app npm run gen-urls
```

Resultaat in `./out/`:

- `urls.csv` voor spreadsheet / mail merge
- `urls.md` markdown tabel
- `qr/<Naam>.png` per kind, 800px, chocolate op cream

## RSVPs bekijken

```bash
curl -s https://beets-eindfeest.vercel.app/api/rsvps | jq
```

Of open een willekeurige kind-URL: het overzicht onderaan toont wie er
al aangemeld is (de pagina pollt elke 5s).

## Deploy

Iedere push naar `main` triggert een Vercel build. Na het renamen van
het project moet de productie-alias soms handmatig op de nieuwe deploy
gezet worden:

```bash
vercel ls | awk 'NR==7'                                             # nieuwste deploy
vercel alias set <deploy-url> beets-eindfeest.vercel.app            # als stale
```

## Tests

```bash
npm test         # vitest run
npm run lint     # oxlint
npm run analyze  # fallow code health
```

## Configuratie

| Env var             | Waar                        | Wat                                                        |
| ------------------- | --------------------------- | ---------------------------------------------------------- |
| `RSVP_SALT`         | Production, Development     | Random hex string voor HMAC, bepaalt de stabiele kid codes |
| `KV_REST_API_URL`   | Auto via Upstash integratie | Upstash Redis REST endpoint                                |
| `KV_REST_API_TOKEN` | Auto via Upstash integratie | Upstash auth token                                         |

## Wijzig de gastenlijst

Voeg of verwijder kids in `src/lib/kids.ts`. Codes worden automatisch
opnieuw afgeleid, dus genereer daarna nieuwe URLs + QR codes:

```bash
BASE_URL=https://beets-eindfeest.vercel.app npm run gen-urls
```

## Geheim houden

Het thema (Summer Beach) is bedoeld als verrassing tot na het
scannen. De Vercel project-URL is daarom hernoemd naar
`beets-eindfeest`. Voorzichtig met:

- Repo-naam: blijft `groep-8-beets-summer-beach.git` op GitHub
- `.vercel/project.json`: bevat de nieuwe naam
- Public meta tags: check `src/app/layout.tsx` voor lekken
