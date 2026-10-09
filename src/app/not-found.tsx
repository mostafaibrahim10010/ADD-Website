import { PillLink } from "@/components/ui/PillButton";

export default function NotFound() {
  return (
    <section className="container-content flex min-h-[70vh] flex-col items-start justify-center gap-8 pt-32 pb-20">
      <p className="text-[clamp(5rem,14vw,11rem)] leading-none font-medium text-brand">404</p>
      <h1 className="text-display font-medium">This page could not be found.</h1>
      <PillLink href="/">Back to home</PillLink>
    </section>
  );
}
