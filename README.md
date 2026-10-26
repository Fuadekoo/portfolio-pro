# Developer Portfolio

An animated full-stack developer portfolio built with **Next.js 16 (App Router, Cache Components)**, **TypeScript**, **Tailwind CSS v4**, **Motion**, **shadcn/ui** conventions and **Lenis** smooth scrolling.

- Dark, custom design system: tokens, gradients, grain, glow and gradient borders in `app/globals.css`
- Hero with mask-reveal headline, rotating specialties, floating code window and ambient orbs
- About with animated counters and a "stack at a glance" visualization
- Bento skills grid with real technology logos (via `simple-icons`)
- Animated CI/CD pipeline (commit → CI → Docker build → registry → deploy) with a travelling
  container, progress rings, a streaming run log and play/pause controls
- Filterable projects with shared-layout transitions, pointer-reactive cards and a
  **view-transition morph** into `/projects/[slug]` case-study pages
- Scroll-linked career timeline, services, optional testimonials/achievements
- Working contact form (Server Action + Resend) with client and server validation
- Scroll progress bar, active-section navigation, accessible mobile menu, cursor glow
- Favicons and app icons built from the logo, Open Graph image, sitemap, robots, web manifest and JSON-LD
- Respects `prefers-reduced-motion` everywhere; keyboard accessible; fully static output

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

| Script          | What it does                    |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build (type-checked) |
| `npm run start` | Serve the production build      |
| `npm run lint`  | ESLint                          |

## Make it yours

All personal content lives in **`content/`**. You shouldn't need to touch components.

| File                      | Contents                                                                 |
| ------------------------- | ------------------------------------------------------------------------ |
| `content/site.ts`         | Name, intro, email, socials, availability, about text, highlights, stats |
| `content/skills.ts`       | Skill categories and technologies                                        |
| `content/projects.ts`     | Projects and case-study content                                          |
| `content/experience.ts`   | Work, education, certifications                                         |
| `content/pipeline.ts`     | CI/CD stages, log lines and facts for the animated pipeline section      |
| `content/services.ts`     | Services you offer                                                       |
| `content/recognition.ts`  | Verified testimonials and achievements                                   |

Honesty rules built into the content layer:

- **Placeholders are labelled.** Sample projects and timeline entries have `sample: true`,
  which shows a dashed "Sample" badge. Replace the content and delete the flag.
- **Unknown numbers stay hidden.** Stats with `value: null` don't render. The only stats shown
  by default are derived from real data (number of technologies and disciplines).
- **Empty sections disappear.** Testimonials/achievements render nothing until you add entries;
  an empty social `href` hides that icon.
- **CV:** put your file at `public/cv.pdf`. Until it exists, the button shows "CV coming soon".
- **Screenshots and photo:** source files live in `public/source/` (`projects/<folder>/`,
  `me/portrait.jpg`). They are served publicly, so crop browser chrome, taskbars and anything
  personal before adding one. Run `npm run media` to frame mobile screens, compose covers and
  regenerate `public/projects/` and `content/media.generated.ts` (sizes + blur placeholders).
  Choose which screenshots are published in `scripts/build-media.mjs`.
- **Logo and icons:** `public/logo.svg` is the source. Run `npm run brand` to rebuild the navbar
  mark (`public/brand/mark*.png`, with a light "F" for the dark theme), `app/favicon.ico`,
  `app/icon.png`, `app/apple-icon.png` and the manifest icons. Only the `<F>.` mark is used;
  the "Fuad" wordmark is unreadable at icon sizes.
- **Device mockups:** each project's `showcase` in `content/projects.ts` picks which screens
  appear on the laptop and the phone in its card and case-study hero.

### Light & dark theme

The toggle in the navbar switches themes (following the OS setting until a visitor chooses).
Colours are CSS variables in `app/globals.css`: `:root` for dark, `:root[data-theme="light"]` for
light. Use the `ink` colour (`bg-ink/5`, `border-ink/10`) for hairlines and tints instead of
white/black so they flip with the theme, and add `theme-dark` to any element that should stay
dark in both themes (screenshot frames, the pipeline console, the code window).

### Hero portrait

The hero uses a background-removed cutout of `public/source/me/portrait.jpg`, saved as
`public/source/me/portrait-cutout.png` (made with `@imgly/background-removal-node`). To use a new photo, replace both files and run
`npm run media`.

## Contact form

The form posts to a Server Action (`app/actions/contact.ts`) that sends mail through the
[Resend](https://resend.com) REST API.

| Variable               | Required | Notes                                                       |
| ---------------------- | -------- | ----------------------------------------------------------- |
| `RESEND_API_KEY`       | yes      | API key from Resend                                         |
| `CONTACT_TO_EMAIL`     | yes      | Where messages are delivered                                |
| `CONTACT_FROM_EMAIL`   | no       | Sender on a verified domain; defaults to Resend's test sender |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | Canonical URL for metadata, sitemap and OG tags           |

Without `RESEND_API_KEY`/`CONTACT_TO_EMAIL` the form tells visitors to email you directly. It
never claims a message was sent when it wasn't. Spam protection is a honeypot field plus an
in-memory rate limit (5 messages / 10 min / IP). On multi-instance hosting, swap
`lib/rate-limit.ts` for a shared store such as Upstash Redis.

## Project structure

```
app/
  actions/contact.ts        Server Action for the contact form
  projects/[slug]/          Case-study pages (statically generated)
  layout.tsx, page.tsx      Shell, metadata, home page
  favicon.ico, icon.png, apple-icon.png (from `npm run brand`), opengraph-image.tsx, sitemap.ts, robots.ts, manifest.ts
  globals.css               Design tokens, effect utilities, keyframes, view transitions
components/
  ui/                       shadcn/ui-style primitives (button, badge, input, …)
  motion/                   Reveal, Stagger, MaskLine, WordReveal, Counter, Magnetic
  layout/                   Navbar, Footer, ScrollProgress, CursorGlow
  sections/                 Hero, About, Skills, Projects, Experience, Services, Contact…
content/                    All editable data
lib/                        Utilities, contact validation, rate limiter
```

`components.json` is configured, so `npx shadcn@latest add <component>` works for adding more
shadcn/ui components.

### Animation conventions

- Motion handles UI animation; `<MotionConfig reducedMotion="user">` honours OS settings.
- Ambient effects (orbs, marquee, gradients, grain) are pure CSS and transform-only.
- Scroll reveals trigger once. Pointer effects write CSS variables directly, so they don't re-render.
- Pointer-driven effects are decorative only and disabled for touch and reduced motion.

## Deployment

**Vercel:** import the repo, set the environment variables above, deploy.

**VPS / Docker:** `npm ci && npm run build && npm run start` behind Nginx (or any reverse
proxy) on Node.js 20.9+. Set `NEXT_PUBLIC_SITE_URL` before building, since it's inlined at build time.
