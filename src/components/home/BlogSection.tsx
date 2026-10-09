import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleList } from "@/components/sections/ArticleList";
import { TextReveal } from "@/components/motion/TextReveal";

export function BlogSection() {
  return (
    <section
      id="blog"
      className="container-content scroll-mt-28 pt-[clamp(5rem,8vw,6.5rem)] pb-[clamp(4rem,7vw,7.5rem)]"
    >
      <SectionHeading>Our Articles &amp; Blogs</SectionHeading>
      <TextReveal text="Urban Perspectives & Critical Essays" className="mt-[36px] text-display-sm leading-[1.1]" />
      <div className="mt-[36px]">
        <ArticleList />
      </div>
    </section>
  );
}
