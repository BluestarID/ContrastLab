import React from "react";
import styled, { keyframes, css } from "styled-components";
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
  Bookmark,
  Save,
  FolderHeart,
} from "lucide-react";

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const IconWrapper = styled.span<{ $spinning?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;

  ${({ $spinning }) =>
    $spinning &&
    css`
      animation: ${spinAnimation} 0.7s linear infinite;
    `}
`;

export interface IconProps {
  className?: string;
  size?: number;
  width?: number;
  height?: number;
  spinning?: boolean;
  "aria-hidden"?: boolean;
}

export function CheckIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Check size={s} strokeWidth={2.2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function CrossIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <X size={s} strokeWidth={2.2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function RefreshIcon({
  className = "",
  size = 16,
  width,
  height,
  spinning = false,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className} $spinning={spinning}>
      <RefreshCw size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function PlusIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Plus size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function TrashIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Trash2 size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function ShuffleIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Shuffle size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function ArrowUpIcon({
  className = "",
  size = 14,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <ArrowUp size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function ArrowDownIcon({
  className = "",
  size = 14,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <ArrowDown size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function CopyIcon({
  className = "",
  size = 14,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Copy size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function SparklesIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Sparkles size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function AlertCircleIcon({
  className = "",
  size = 18,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <AlertCircle size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function EyeIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Eye size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function LayersIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Layers size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function BookmarkIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Bookmark size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function SaveIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <Save size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
}

export function FolderIcon({
  className = "",
  size = 16,
  width,
  height,
  "aria-hidden": ariaHidden = true,
}: IconProps): React.JSX.Element {
  const s = width || height || size;
  return (
    <IconWrapper className={className}>
      <FolderHeart size={s} strokeWidth={2} aria-hidden={ariaHidden} />
    </IconWrapper>
  );
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
  Bookmark,
  Save,
  FolderHeart,
};
