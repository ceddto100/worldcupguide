"use client";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterBar({ groups }: { groups: FilterGroup[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g) => (
          <div key={g.id}>
            <label htmlFor={g.id} className="text-xs uppercase tracking-wider text-white/50">
              {g.label}
            </label>
            <select
              id={g.id}
              className="input-base mt-2"
              value={g.value}
              onChange={(e) => g.onChange(e.target.value)}
            >
              {g.options.map((o) => (
                <option key={o.value} value={o.value} className="bg-navy-900">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
