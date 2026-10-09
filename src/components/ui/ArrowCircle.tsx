import { cn } from "@/lib/cn";

type ArrowCircleProps = {
  className?: string;
  /** Size of the circle in px (Figma: 23px). */
  size?: number;
  /** "dark" for light surfaces (default), "light" for dark surfaces. */
  tone?: "dark" | "light";
};

/**
 * The circular arrow used across every pill button in the design.
 * Idle: black disc with a white → arrow.
 * Hover (via a parent `group`): white disc with a brand-red ↗ arrow.
 */
export function ArrowCircle({ className, size = 23, tone = "dark" }: ArrowCircleProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        "transition-colors duration-500 ease-out-expo group-hover:bg-white group-hover:text-brand",
        tone === "dark" ? "bg-ink text-white" : "bg-white text-ink",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 23 23"
        fill="none"
        className="size-full transition-transform duration-500 ease-out-expo group-hover:-rotate-45"
      >
        <path
          d="M12.8636 17L19 11.5L12.8636 6M19 11.5L4 11.5"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      </svg>
    </span>
  );
}
