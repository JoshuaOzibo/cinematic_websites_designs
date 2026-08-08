export function Crown({ className = "h-4 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M4 34 L4 8 L18 20 L32 3 L46 20 L60 8 L60 34 Z" />
    </svg>
  );
}
