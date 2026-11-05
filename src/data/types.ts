export type ProjectCategory = "architecture" | "urban" | "interior";

export type SiteImage = {
  src: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  /** Primary classification — where the project's own URL opens. */
  category: ProjectCategory;
  /** Further classifications the project is also listed under. */
  alsoIn?: ProjectCategory[];
  title: string;
  /** Meta fields may be empty ("") for projects without published details; the UI hides them. */
  location: string;
  year: string;
  /** "PROJECT TYPE" in the meta column, e.g. "Residential", "Mixed-Use". */
  type: string;
  client: string;
  status: string;
  size: string;
  /** Optional heading over the description column (long-form projects). */
  descriptionTitle?: string;
  /** Paragraphs are separated by a blank line ("\n\n"). */
  description: string;
  /** Further text columns placed inside the gallery strip, after the given image (1 = the lead image). */
  textBlocks?: ProjectTextBlock[];
  images: SiteImage[];
};

export type ProjectTextBlock = {
  afterImage: number;
  title?: string;
  /** Paragraphs are separated by a blank line ("\n\n"). */
  text: string;
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
  /** One-line summary used on cards and the overview grid. */
  summary: string;
  /** What the client receives — shown as a checklist on the Services page. */
  deliverables: string[];
  /** Where "View Projects" leads (a category on the Projects page). */
  projectsHref: string;
};

export type TeamMember = {
  name: string;
  role: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
};

export type Award = {
  title: string;
  description: string;
};

export type Step = {
  title: string;
  description: string;
  /** Optional sub-items listed under the description. */
  items?: string[];
};

export type Faq = {
  question: string;
  answer: string;
};
