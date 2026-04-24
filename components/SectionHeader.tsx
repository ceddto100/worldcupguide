import Link from "next/link";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function SectionHeader({ eyebrow, title, description, ctaHref, ctaLabel }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <span className="badge-gold">{eyebrow}</span>}
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">{description}</p>
        )}
      </div>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref} className="btn-ghost self-start sm:self-auto">
          {ctaLabel} &rarr;
        </Link>
      )}
    </div>
  );
}
