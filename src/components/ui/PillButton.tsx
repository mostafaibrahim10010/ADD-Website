import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowCircle } from "./ArrowCircle";

type Variant = "outline" | "solid";

const base =
  "group relative inline-flex h-[42px] shrink-0 items-center justify-center gap-[3px] overflow-hidden rounded-[28px] " +
  "border pl-[15px] pr-[13px] text-[15px] leading-8 whitespace-nowrap " +
  "transition-[color,border-color] duration-500 ease-out-expo hover:border-brand hover:text-white";

const variants: Record<Variant, string> = {
  /** White pill with black outline — the Figma default. */
  outline: "border-ink bg-white text-ink",
  /** Black pill for the primary action when two buttons sit side by side. */
  solid: "border-ink bg-ink text-white",
};

/** Brand-red fill that wipes up from the bottom on hover. */
function Fill() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 translate-y-full rounded-[28px] bg-brand transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
    />
  );
}

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      <Fill />
      <span className="relative">{children}</span>
      <span className="relative flex size-8 items-center justify-center">
        <ArrowCircle tone={variant === "solid" ? "light" : "dark"} />
      </span>
    </>
  );
}

type LinkPillProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  variant?: Variant;
};

/** Pill CTA from the design ("Contact us", "Know more", "View Projects" …). */
export function PillLink({ className, children, variant = "outline", ...props }: LinkPillProps) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

type AnchorPillProps = ComponentProps<"a"> & { children: ReactNode; variant?: Variant };

/** Same pill for plain anchors (mailto:, tel:, external). */
export function PillAnchor({ className, children, variant = "outline", ...props }: AnchorPillProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </a>
  );
}
