export type ProjectCategory = "architecture" | "urban" | "interior";

export type SiteImage = {
  src: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  category: ProjectCategory;
  title: string;
  location: string;
  year: string;
  client: string;
  status: string;
  size: string;
  description: string;
  images: SiteImage[];
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
};

export type Faq = {
  question: string;
  answer: string;
};
