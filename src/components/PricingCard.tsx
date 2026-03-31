"use client";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  badge?: string;
  highlighted?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  badge,
  highlighted,
  disabled,
  loading,
  onSelect,
}: PricingCardProps) {
  const isDisabled = disabled || !onSelect;

  return (
    <div
      className={`relative rounded-xl border p-6 ${
        highlighted
          ? "border-accent bg-bg-card shadow-md"
          : "border-border bg-bg-card"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
          {badge}
        </span>
      )}
      <h3 className="font-serif text-xl font-semibold text-text-primary">{name}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-text-primary">{price}</span>
        {period && <span className="text-sm text-text-muted">{period}</span>}
      </div>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={isDisabled}
        className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          highlighted
            ? "bg-accent text-white hover:bg-accent-hover"
            : onSelect && !disabled
              ? "border border-border text-text-secondary hover:bg-bg-primary hover:text-text-primary"
              : "border border-border text-text-muted cursor-default"
        }`}
      >
        {loading ? "..." : cta}
      </button>
    </div>
  );
}
