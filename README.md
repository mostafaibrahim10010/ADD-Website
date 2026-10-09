# ADD Architects — Website

Next.js 16 (App Router) + Tailwind CSS v4 + Motion + Lenis, built from the Figma file
[ADD-Website › MAIN PAGES](https://www.figma.com/design/TS8oS7SLtECEJph06SePR9/ADD-Website?node-id=58-122).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (what Vercel runs)
npm run lint
npm run typecheck
```

Requires Node.js 20.9 or newer.

## Deploying to Vercel

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel, **Add New → Project** and import the repository. The framework preset
   (Next.js), build command and output are detected automatically — no `vercel.json` needed.
3. Under **Settings → Environment Variables**, set `NEXT_PUBLIC_SITE_URL` to the
   production URL (see `.env.example`). It drives canonical links, `sitemap.xml`,
   `robots.txt` and social-share previews; it defaults to `https://addarchitects.net`.
4. Deploy. Every page is pre-rendered at build time.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Us |
| `/services` | Services (disciplines, process, sectors, selected work) |
| `/projects/architecture` · `/urban` · `/interior` | One page per classification (`/projects` redirects to Architecture) |
| `/projects/<project>` | Classification feed with that project opened |
| `/partners` | Partners & Clients |
| `/contact` | Contact details, enquiry form, map, FAQ |

## Structure

```
src/
  app/                  routes, metadata files (icon, opengraph-image, sitemap, robots, manifest)
    fonts/              Montserrat (Latin subset, woff2)
    globals.css         design tokens (@theme), container + fluid type utilities
  components/
    layout/             Header (+ mobile menu), Footer, CtaBanner, Logo, Providers (Lenis, MotionConfig)
    home/               Hero (animated ADD mark), ImageLoop, Intro, About, Services, Expertise, Partners, Blog
    about/ services/ contact/ sections/   page sections and shared blocks
    projects/           ProjectsExplorer (feed + velocity zoom), FeedItem, ProjectsBar, Lightbox, ShareLinks
    motion/             Reveal / Stagger, TextReveal, ParallaxImage, CountUp, easing curves
    ui/                 PillButton, ArrowCircle, SectionHeading, Breadcrumb, PageHeader
  data/                 all copy & content — edit text here, not in components
public/
  brand/ icons/         SVGs exported from Figma
  images/               home, about, partners, projects/<slug>/NN.webp
```

## Content

- **Projects** live in `src/data/projects.ts`. To add one, drop images in
  `public/images/projects/<slug>/` and add an entry; its page is generated automatically.
- **Copy** for services, process, FAQ, team, awards, etc. is in `src/data/content.ts`.
- **Social profile links** in `src/data/site.ts` are `#` placeholders — add the real URLs.
- The contact form opens the visitor's email app pre-filled (no backend required).

## Motion

All animation respects `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`).
