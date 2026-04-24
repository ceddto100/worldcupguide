import Link from "next/link";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CTASection({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: Props) {
  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-navy-700 to-navy-900 p-8 sm:p-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            {eyebrow && <span className="badge-gold">{eyebrow}</span>}
            <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            {description && <p className="mt-3 max-w-2xl text-white/75">{description}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={primaryHref} className="btn-primary">{primaryLabel}</Link>
              {secondaryHref && secondaryLabel && (
                <Link href={secondaryHref} className="btn-secondary">{secondaryLabel}</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
