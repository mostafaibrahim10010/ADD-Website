"use client";

import Image from "next/image";
import { useState } from "react";

type ShareLinksProps = { slug: string; title: string };

/** X / Instagram / Facebook / LinkedIn share row from the project meta column. */
export function ShareLinks({ slug, title }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);

  const projectUrl = () => `${window.location.origin}/projects/${slug}`;

  const openShare = (build: (url: string, text: string) => string) => {
    const text = `${title} — ADD Architects`;
    window.open(build(encodeURIComponent(projectUrl()), encodeURIComponent(text)), "_blank", "noopener,noreferrer,width=640,height=560");
  };

  // Instagram has no web share intent, so it copies the project link instead.
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  const items = [
    { name: "X", icon: "/icons/x.svg", onClick: () => openShare((u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`) },
    { name: "Instagram (copy link)", icon: "/icons/instagram.svg", onClick: copyLink },
    { name: "Facebook", icon: "/icons/facebook.svg", onClick: () => openShare((u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`) },
    { name: "LinkedIn", icon: "/icons/linkedin.svg", onClick: () => openShare((u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`) },
  ];

  return (
    <div className="relative flex flex-col items-start gap-[3px] md:items-end">
      <p className="text-[13px] tracking-[0.78px]">SHARE</p>
      <ul className="flex gap-[2.6px]">
        {items.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              onClick={item.onClick}
              aria-label={`Share on ${item.name}`}
              className="block rounded-full transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Image src={item.icon} alt="" width={18} height={18} />
            </button>
          </li>
        ))}
      </ul>
      <span
        role="status"
        className={`pointer-events-none absolute top-full mt-1 text-[11px] whitespace-nowrap text-brand transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
      >
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
