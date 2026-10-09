import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** "ARCHITECTURE / DESIGN+ / DEVELOPMENT" logotype used in the header. */
export function LogoType({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="ADD Architects — home" className={cn("block shrink-0", className)}>
      <Image src="/brand/logo-type.svg" alt="" width={125} height={52} priority />
    </Link>
  );
}

/** Full red "ADD" mark + logotype, used in the footer. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="ADD Architects — home" className={cn("flex items-center gap-[9px]", className)}>
      <Image src="/brand/footer-a.svg" alt="" width={53} height={53} />
      <Image src="/brand/footer-d1.svg" alt="" width={53} height={53} />
      <Image src="/brand/footer-d2.svg" alt="" width={53} height={53} />
      <Image src="/brand/wordmark.svg" alt="" width={113} height={47} />
    </Link>
  );
}
