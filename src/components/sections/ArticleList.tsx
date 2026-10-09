import Image from "next/image";
import { articles } from "@/data/content";
import { Reveal } from "@/components/motion/Reveal";

/** Image + title + excerpt rows separated by a rule (Figma "Our Articles & Blogs"). */
export function ArticleList() {
  return (
    <div className="flex flex-col">
      {articles.map((article, i) => (
        <Reveal key={article.slug}>
          <article
            id={article.slug}
            className="group grid scroll-mt-32 items-end gap-6 md:grid-cols-2 md:gap-x-[34px]"
          >
            <div className="relative aspect-[524/305] overflow-hidden bg-surface">
              <Image
                src={article.image}
                alt=""
                fill
                sizes="(min-width: 768px) 524px, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
              />
            </div>
            <div className="flex flex-col gap-[25px]">
              <div className="flex flex-col gap-3 md:text-justify">
                <h3 className="text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.36] font-semibold capitalize transition-colors duration-500 group-hover:text-brand">
                  {article.title}
                </h3>
                <p className="text-[clamp(0.9375rem,0.9rem+0.15vw,1rem)] leading-[1.69] capitalize">
                  {article.excerpt}
                </p>
              </div>
              <time className="text-base leading-[29px] font-semibold">{article.date}</time>
            </div>
          </article>
          {i < articles.length - 1 && <hr className="my-[36px] border-ink" />}
        </Reveal>
      ))}
    </div>
  );
}
