import type { Article, Award, Faq, Service, Step, TeamMember } from "./types";

export const services: Service[] = [
  {
    slug: "architecture-design",
    title: "Architecture Design",
    description:
      "We offer striking approaches to push architectural boundaries, ensuring our designs are functional and impactful for users and surroundings.",
    image: "/images/home/services/architecture-design.webp",
    summary: "Concept-to-detail architecture for residential, commercial and cultural buildings.",
    deliverables: [
      "Site analysis, brief development and feasibility studies",
      "Concept design, massing studies and visualisation",
      "Design development and material strategy",
      "Construction drawings and specifications",
      "Authority submissions and approvals support",
    ],
    projectsHref: "/projects/architecture",
  },
  {
    slug: "urban-design",
    title: "Urban Design",
    description:
      "We offer unique designs creating an exceptional user experiences through the implantation of innovative, modern, and sustainable design approaches.",
    image: "/images/home/services/urban-design.webp",
    summary: "Masterplans, public realm and mixed-use districts that put people first.",
    deliverables: [
      "Urban analysis, mobility and context studies",
      "Masterplanning and land-use strategies",
      "Public realm, landscape and waterfront design",
      "Design codes and phasing strategies",
      "Competition entries and vision documents",
    ],
    projectsHref: "/projects/urban",
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    description:
      "We offer an innovative unique interior experience for each project tailored to meet each project specific needs and exceed all client expectations.",
    image: "/images/home/services/interior-design.webp",
    summary: "Residential, hospitality and workplace interiors tailored to every brief.",
    deliverables: [
      "Space planning and functional layouts",
      "Concept moodboards, materials and finishes",
      "Bespoke joinery and furniture design",
      "Lighting design and 3D visualisation",
      "FF&E specification, procurement and styling",
    ],
    projectsHref: "/projects/interior",
  },
  {
    slug: "construction-supervision",
    title: "Construction Supervision",
    description:
      "We offer supervision services to ensure a smooth construction process, providing site oversight, evaluations, and quality control management for project success.",
    image: "/images/home/services/construction-supervision.webp",
    summary: "On-site oversight that keeps quality, safety and design intent intact.",
    deliverables: [
      "Site supervision and daily inspection reports",
      "Quality control and materials approval",
      "Contractor coordination and shop-drawing review",
      "Progress evaluation and payment certification",
      "Snagging, handover and close-out documentation",
    ],
    projectsHref: "/projects",
  },
  {
    slug: "bim-service",
    title: "BIM Service",
    description:
      "We offer comprehensive BIM services tailored to meet the different needs of each project, ranging from design concept up to the as built stage.",
    image: "/images/home/services/bim-service.webp",
    summary: "Coordinated BIM models from concept through to the as-built stage.",
    deliverables: [
      "3D architectural and MEP coordination models",
      "Clash detection and resolution reports",
      "Quantity take-offs and model-based scheduling",
      "Construction documentation from the model",
      "As-built models for facility management",
    ],
    projectsHref: "/projects",
  },
  {
    slug: "projects-management",
    title: "Projects Managements",
    description:
      "We offer comprehensive project management services tailored to meet the unique needs of each project including managing both budget and schedule.",
    image: "/images/home/services/projects-management.webp",
    summary: "Budget, schedule and stakeholder control from inception to handover.",
    deliverables: [
      "Project planning, programming and scheduling",
      "Cost planning, budgeting and value engineering",
      "Procurement, tendering and contract management",
      "Risk management and progress reporting",
      "Stakeholder and consultant coordination",
    ],
    projectsHref: "/projects",
  },
];

export const loopImages = [
  "/images/home/loop/loop-01.webp",
  "/images/home/loop/loop-02.webp",
  "/images/home/loop/loop-03.webp",
  "/images/home/loop/loop-04.webp",
  "/images/home/loop/loop-05.webp",
  "/images/home/loop/loop-06.webp",
  "/images/home/loop/loop-07.webp",
  "/images/home/loop/loop-08.webp",
  "/images/home/loop/loop-09.webp",
  "/images/home/loop/loop-10.webp",
];

export const partnerLogos = Array.from(
  { length: 25 },
  (_, i) => `/images/partners/logo-${String(i + 1).padStart(2, "0")}.webp`,
);

export const articles: Article[] = [
  {
    slug: "architectural-symphony-luxor",
    title:
      "An Architectural Symphony in the Presence of Luxor: Toward an Urbanism That Restores the Rhythm",
    excerpt:
      "Luxor is a unique and inspiring living phenomenon. Luxor is a cumulative state as old as civilized humanity. It is not a city without an identity; rather, it is the deepest embodiment of identity itself. Yet, the city's urban landscape today has become jarring a chaotic visual noise that breaks its authentic rhythm.",
    date: "Apr 24, 2026",
    image: "/images/home/blog-1.webp",
  },
  {
    slug: "alexandria-corniche-crisis",
    title:
      "Alexandria's Corniche Crisis: Encroachment on Public Spaces and the Absence of Urban Justice",
    excerpt:
      "This critique addresses the recent projects on Alexandria's corniche, warning that they violate public spaces and waterfronts, prioritize private interests over public welfare, and rely on inadequate engineering solutions that threaten the city's identity.",
    date: "Nov 17, 2016",
    image: "/images/home/blog-2.webp",
  },
];

export const stats = [
  {
    value: 9,
    suffix: "+",
    title: "Years of Experience",
    description:
      "Established in 2017, ADD Architects has grown into a multidisciplinary architectural practice with experience across Egypt and the region.",
  },
  {
    value: 15,
    suffix: "+",
    title: "Countries & Locations",
    description:
      "Our portfolio extends across Egypt and international markets, with projects and collaborations spanning the Middle East and beyond.",
  },
  {
    value: 120,
    suffix: "+",
    title: "Featured Projects",
    description:
      "A diverse portfolio covering architecture, urban design, interior design, BIM, engineering, and project delivery across multiple sectors.",
  },
];

export const awards: Award[] = [
  {
    title: "UIA Award (International Union of Architects)",
    description:
      "Winning first place in UNESCO’s international design competition for the rehabilitation of historic sites earned our practice global recognition.",
  },
  {
    title: "AIA Award (American Institute of Architects)",
    description:
      "Honor Award, recognizing exceptional design quality and innovation in the Cultural and Historical Heritage category.",
  },
  {
    title: "Arab Architects Awards",
    description:
      "2nd place, recognizing a commitment to professional standards in culturally significant urban projects.",
  },
  {
    title: "Tamayouz Excellence Award (Dewan Award for Architecture)",
    description:
      "Winning first place in the competition for the Dakeer Island waterfront development project in Basra, recognizing innovative urban transformation.",
  },
];

export const team: TeamMember[] = [
  { name: "Sherif Farag", role: "Founder-Chairman" },
  { name: "Noha Ryan", role: "Head of Architectural Department" },
  { name: "Engy El-Meligy", role: "Senior Urbanist" },
  { name: "Farah Ahmed", role: "Senior Architect" },
  { name: "Noha Abd-Elaziz", role: "Architect" },
  { name: "Omar Farag", role: "BIM Architect" },
  { name: "Ibrahim Ahmed", role: "BIM Architect" },
  { name: "Sara Mohamed", role: "Junior Architect" },
  { name: "Reem Tarek", role: "Interior Designer" },
  { name: "Reem Ghanem", role: "Interior Designer" },
  { name: "Haneen Nabil", role: "Graphic Designer" },
];

/** How a commission moves through the studio (Services page). */
export const process: Step[] = [
  {
    title: "Brief & Research",
    description:
      "We listen first — studying the site, its context and its history, and shaping a clear brief with you before any line is drawn.",
  },
  {
    title: "Concept Design",
    description:
      "Ideas are tested through sketches, massing and visualisation until a strong, buildable concept emerges.",
  },
  {
    title: "Design Development",
    description:
      "The concept is refined into coordinated architecture, interiors and landscape, with materials and systems resolved in detail.",
  },
  {
    title: "Documentation & BIM",
    description:
      "Construction drawings, specifications and coordinated BIM models give contractors everything needed to build with confidence.",
  },
  {
    title: "Delivery & Supervision",
    description:
      "On site, we supervise quality, schedule and budget through to handover — protecting the design intent at every stage.",
  },
];

/** Sectors the portfolio spans (Services page). */
export const sectors = [
  { title: "Residential", description: "Villas, apartments and residential compounds." },
  { title: "Commercial & Mixed-Use", description: "Business hubs, offices and mixed-use districts." },
  { title: "Hospitality", description: "Hotels, serviced apartments and leisure." },
  { title: "Cultural & Heritage", description: "Museums, rehabilitation of historic sites." },
  { title: "Urban & Waterfront", description: "Masterplans, public realm and waterfronts." },
  { title: "Education & Civic", description: "Schools, pavilions and community buildings." },
];

/** Why clients and partners choose ADD (Partners page). */
export const values: Step[] = [
  {
    title: "One Integrated Team",
    description:
      "Architecture, urban, interiors, BIM, supervision and project management under one roof — one point of responsibility.",
  },
  {
    title: "Heritage-Grounded Design",
    description:
      "Award-winning experience rehabilitating historic sites informs contemporary work that respects its context.",
  },
  {
    title: "Recognised Excellence",
    description:
      "Honoured by UIA, AIA Middle East, the Arab Architects Awards and Tamayouz for design quality and innovation.",
  },
  {
    title: "Regional Reach",
    description:
      "Projects and collaborations across Egypt, Saudi Arabia, Iraq, Tunisia and beyond, delivered with local insight.",
  },
];

/** What happens after an enquiry (Contact page). */
export const nextSteps: Step[] = [
  {
    title: "We Review Your Brief",
    description: "Our team reads your enquiry and gets back to you to understand the project, site and ambitions.",
  },
  {
    title: "Introductory Meeting",
    description: "We meet — in our Alexandria studio, on site or online — to discuss scope, programme and budget.",
  },
  {
    title: "Tailored Proposal",
    description: "You receive a clear proposal outlining services, stages, deliverables and fees for your project.",
  },
];

export const faqs: Faq[] = [
  {
    question: "Which services does ADD Architects offer?",
    answer:
      "Architecture design, urban design, interior design, construction supervision, BIM services and project management — individually or as one integrated package from concept to handover.",
  },
  {
    question: "Do you work on projects outside Egypt?",
    answer:
      "Yes. Alongside our work across Egypt, we have delivered and designed projects in Saudi Arabia, Iraq, Tunisia and Mozambique, and we collaborate with partners across the Middle East.",
  },
  {
    question: "Can you take a project from concept all the way to construction?",
    answer:
      "Yes. Our design teams work alongside our BIM, supervision and project-management teams, so a single studio can carry your project from the first brief to the final handover.",
  },
  {
    question: "Do you take part in design competitions?",
    answer:
      "Regularly. Competition work has earned the studio first place in the Tamayouz Dewan Award for the Dakeer Island waterfront and first place in UNESCO’s international competition for the rehabilitation of historic sites.",
  },
  {
    question: "What information should I include in my enquiry?",
    answer:
      "The project location, type and approximate size, your timeline and budget range, and any drawings or references you already have. Don’t worry if you don’t have everything — we’ll shape the brief together.",
  },
];
