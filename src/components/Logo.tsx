export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow`}>
      <svg viewBox="0 0 100 100" className="h-3/5 w-3/5">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.82 0.14 200)" />
            <stop offset="100%" stopColor="oklch(0.65 0.20 260)" />
          </linearGradient>
        </defs>
        <path 
          fill="white" 
          d="M30 20 Q20 20 20 30 L20 70 Q20 80 30 80 L45 80 L55 70 L70 70 Q80 70 80 60 L80 30 Q80 20 70 20 Z"
        />
        <circle cx="40" cy="50" r="8" fill="url(#logoGrad)" />
        <circle cx="60" cy="50" r="8" fill="url(#logoGrad)" />
        <rect x="55" y="42" width="20" height="16" rx="4" fill="url(#logoGrad)" />
      </svg>
    </div>
  );
}
