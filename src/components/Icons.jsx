/**
 * Lucide Icons collection for ContrastLab
 * Scalable, accessible, clean feather-style Lucide React icon wrappers
 */
import React from "react";
import {
  Check,
  X,
  RefreshCw,
  Plus,
  Trash2,
  Shuffle,
  ArrowUp,
  ArrowDown,
  Copy,
  Sparkles,
  AlertCircle,
  Eye,
  Layers,
} from "lucide-react";

export function CheckIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Check className={`app-icon ${className}`} size={s} strokeWidth={2.2} aria-hidden={ariaHidden} />;
}

export function CrossIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <X className={`app-icon ${className}`} size={s} strokeWidth={2.2} aria-hidden={ariaHidden} />;
}

export function RefreshIcon({ className = "", size = 16, width, height, spinning = false, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <RefreshCw className={`app-icon ${className} ${spinning ? "spin-animation" : ""}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function PlusIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Plus className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function TrashIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Trash2 className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function ShuffleIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Shuffle className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function ArrowUpIcon({ className = "", size = 14, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <ArrowUp className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function ArrowDownIcon({ className = "", size = 14, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <ArrowDown className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function CopyIcon({ className = "", size = 14, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Copy className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function SparklesIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Sparkles className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function AlertCircleIcon({ className = "", size = 18, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <AlertCircle className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function EyeIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Eye className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export function LayersIcon({ className = "", size = 16, width, height, "aria-hidden": ariaHidden = true }) {
  const s = width || height || size;
  return <Layers className={`app-icon ${className}`} size={s} strokeWidth={2} aria-hidden={ariaHidden} />;
}

export {
  Check,
  X,
  RefreshCw,
  Plus,
  Trash2,
  Shuffle,
  ArrowUp,
  ArrowDown,
  Copy,
  Sparkles,
  AlertCircle,
  Eye,
  Layers,
};
