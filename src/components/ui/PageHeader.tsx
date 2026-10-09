import type { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

type PageHeaderProps = {
  /** Breadcrumb label for the current page. */
  crumb: string;
  title: string | string[];
  lead?: ReactNode;
  children?: ReactNode;
};

/** Opening block shared by every inner page: breadcrumb, display title, lead copy. */
export function PageHeader({ crumb, title, lead, children }: PageHeaderProps) {
  return (
    <header>
      <div className="container-wide pt-[clamp(8rem,10.5vw,10.5rem)]">
        <Breadcrumb current={crumb} />
      </div>
      <div className="container-content pt-[clamp(2.5rem,4vw,4rem)]">
        <TextReveal as="h1" text={title} className="text-display font-medium" />
        {lead && (
          <Reveal delay={0.2} className="mt-6 max-w-[880px]">
            <div className="md:text-justify text-[clamp(1.0625rem,0.95rem+0.45vw,1.375rem)] leading-[1.45] text-ink/85">
              {lead}
            </div>
          </Reveal>
        )}
        {children}
      </div>
    </header>
  );
}
