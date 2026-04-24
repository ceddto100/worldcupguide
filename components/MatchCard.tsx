import Link from "next/link";
import type { Match } from "@/lib/types";

export function MatchCard({ match }: { match: Match }) {
  return (
    <article className="card flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="badge-gold">{match.stage}</span>
        <span className="text-xs text-white/60">{match.venue}</span>
      </div>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-wider text-white/50">{match.date}</p>
        <h3 className="mt-1 text-lg font-semibold">
          {match.teamA} <span className="text-white/40">vs</span> {match.teamB}
        </h3>
        <p className="mt-1 text-sm text-white/70">{match.time}</p>
      </div>
      <div className="mt-auto pt-5">
        <Link href={match.ctaUrl ?? `/matches`} className="btn-secondary w-full">
          View Matchday Guide
        </Link>
      </div>
    </article>
  );
}
