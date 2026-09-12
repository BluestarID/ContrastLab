import React from "react";
import styled from "styled-components";

export const EmptyCard = styled.div`
  background-color: var(--bg-primary);
  border: 2px dashed var(--border-medium);
  border-radius: var(--radius-xl);
  padding: clamp(32px, 5vw, 48px) 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 580px;
  margin: 30px auto;
  width: 100%;
`;

export const EmptyIconWrap = styled.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  background-color: var(--accent-subtle);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
`;

export const EmptyDesc = styled.p`
  font-size: 0.85rem;
  color: var(--text-muted);
  max-width: 420px;
  line-height: 1.5;
`;

export const EmptyActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background-color: var(--accent-primary);
  color: #FFFFFF;
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }
`;

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionIcon,
  onAction,
}: EmptyStateProps): React.JSX.Element {
  return (
    <EmptyCard>
      <EmptyIconWrap>{icon}</EmptyIconWrap>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDesc>{description}</EmptyDesc>
      {actionText && onAction && (
        <EmptyActionBtn type="button" onClick={onAction}>
          {actionIcon}
          <span>{actionText}</span>
        </EmptyActionBtn>
      )}
    </EmptyCard>
  );
}

export default EmptyState;
