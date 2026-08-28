/**
 * Lucide icon wrappers. Uses the official lucide UMD bundle when available
 * (index.html), with inline Lucide SVG fallbacks for module usage.
 */
import React from "react";

function getLucideNode(name) {
  const pack =
    (typeof lucide !== "undefined" && lucide) ||
    (typeof window !== "undefined" && window.lucide) ||
    null;
  if (!pack) return null;
  return pack.icons?.[name] || pack[name] || null;
}

function LucideIcon({
  name,
  className = "",
  size = 16,
  spinning = false,
  fallback = null,
  "aria-hidden": ariaHidden = true
}) {
  const node = getLucideNode(name);
  const classNames = `app-icon lucide ${className} ${spinning ? "spin-animation" : ""}`.trim();

  if (node) {
    const children = Array.isArray(node[2]) ? node[2] : [];
    return (
      <svg
        className={classNames}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={ariaHidden}
      >
        {children.map((child, i) => {
          const [tag, attrs] = child;
          return React.createElement(tag, { key: i, ...attrs });
        })}
      </svg>
    );
  }

  return fallback ? fallback({ className: classNames, size, ariaHidden }) : null;
}

function FallbackSvg({ className, size, ariaHidden, children }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
    >
      {children}
    </svg>
  );
}

export function CheckIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="Check"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <polyline points="20 6 9 17 4 12" />
        </FallbackSvg>
      )}
    />
  );
}

export function CrossIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="X"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </FallbackSvg>
      )}
    />
  );
}

export function RefreshIcon({ className = "", size = 16, spinning = false }) {
  return (
    <LucideIcon
      name="RefreshCw"
      className={className}
      size={size}
      spinning={spinning}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </FallbackSvg>
      )}
    />
  );
}

export function PlusIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="Plus"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </FallbackSvg>
      )}
    />
  );
}

export function TrashIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="Trash2"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </FallbackSvg>
      )}
    />
  );
}

export function ShuffleIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="Shuffle"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
          <path d="m18 2 4 4-4 4" />
          <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
          <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
          <path d="m18 14 4 4-4 4" />
        </FallbackSvg>
      )}
    />
  );
}

export function ArrowUpIcon({ className = "", size = 14 }) {
  return (
    <LucideIcon
      name="ArrowUp"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </FallbackSvg>
      )}
    />
  );
}

export function ArrowDownIcon({ className = "", size = 14 }) {
  return (
    <LucideIcon
      name="ArrowDown"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </FallbackSvg>
      )}
    />
  );
}

export function CopyIcon({ className = "", size = 14 }) {
  return (
    <LucideIcon
      name="Copy"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </FallbackSvg>
      )}
    />
  );
}

export function SparklesIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="Sparkles"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </FallbackSvg>
      )}
    />
  );
}

export function AlertCircleIcon({ className = "", size = 18 }) {
  return (
    <LucideIcon
      name="CircleAlert"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </FallbackSvg>
      )}
    />
  );
}

export function EyeIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="Eye"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </FallbackSvg>
      )}
    />
  );
}

export function LayersIcon({ className = "", size = 16 }) {
  return (
    <LucideIcon
      name="Layers"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </FallbackSvg>
      )}
    />
  );
}

export function LightbulbIcon({ className = "", size = 14 }) {
  return (
    <LucideIcon
      name="Lightbulb"
      className={className}
      size={size}
      fallback={({ className: cls, size: s, ariaHidden }) => (
        <FallbackSvg className={cls} size={s} ariaHidden={ariaHidden}>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </FallbackSvg>
      )}
    />
  );
}
