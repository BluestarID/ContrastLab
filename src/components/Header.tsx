import React from "react";
import styled from "styled-components";

import { TABS, TabValue } from "../types";
import { LayersIcon, EyeIcon } from "./Icons";

const HeaderContainer = styled.header`
  height: var(--header-height);
  min-height: var(--header-height);
  max-height: var(--header-height);
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 3vw, 28px);
  position: relative;
  z-index: 40;
  box-shadow: var(--shadow-xs);
  flex-shrink: 0;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
    height: auto;
    min-height: auto;
    max-height: none;
    gap: 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 680px) {
    justify-content: center;
  }
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIconWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 5px 7px;
  background: #0F172A;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
`;

const LogoDot = styled.div<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const BrandText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BrandTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
`;

const BrandBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  background-color: var(--accent-subtle);
  color: var(--accent-primary);
  border: 1px solid var(--accent-border);
`;

const HeaderCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 680px) {
    justify-content: center;
  }
`;

const TabPillContainer = styled.nav`
  display: inline-flex;
  align-items: center;
  background-color: var(--bg-subtle);
  padding: 3px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
`;

const TabPill = styled.button<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $isActive }) => ($isActive ? "#FFFFFF" : "var(--text-secondary)")};
  background-color: ${({ $isActive }) => ($isActive ? "var(--accent-primary)" : "transparent")};
  box-shadow: ${({ $isActive }) => ($isActive ? "0 2px 6px rgba(48, 124, 255, 0.35)" : "none")};
  border-radius: var(--radius-full);
  position: relative;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  &:hover {
    color: ${({ $isActive }) => ($isActive ? "#FFFFFF" : "var(--text-primary)")};
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.78rem;
  }
`;

const TabCountBadge = styled.span<{ $isActive: boolean }>`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  background: ${({ $isActive }) => ($isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(15, 23, 42, 0.08)")};
  color: inherit;
`;

const TabStaleDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #F59E0B;
  box-shadow: 0 0 0 2px #FFFFFF;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  min-width: 40px;

  @media (max-width: 680px) {
    display: none;
  }
`;

export interface HeaderProps {
  activeTab: TabValue;
  setActiveTab: (tab: TabValue) => void;
  paletteCount: number;
  isStale: boolean;
}

export function Header({
  activeTab,
  setActiveTab,
  paletteCount,
  isStale,
}: HeaderProps): React.JSX.Element {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <BrandLogo>
          <LogoIconWrap>
            <LogoDot $color="#307CFF" />
            <LogoDot $color="#10B981" />
            <LogoDot $color="#F59E0B" />
          </LogoIconWrap>
          <BrandText>
            <BrandTitle>ContrastLab</BrandTitle>
            <BrandBadge>WCAG 2.1</BrandBadge>
          </BrandText>
        </BrandLogo>
      </HeaderLeft>

      <HeaderCenter>
        <TabPillContainer role="tablist" aria-label="Main Navigation">
          <TabPill
            type="button"
            role="tab"
            id="tab-palette"
            aria-selected={activeTab === TABS.PALETTE}
            aria-controls="panel-palette"
            tabIndex={0}
            $isActive={activeTab === TABS.PALETTE}
            onClick={() => setActiveTab(TABS.PALETTE)}
          >
            <LayersIcon size={15} />
            <span>Color Palette</span>
            <TabCountBadge $isActive={activeTab === TABS.PALETTE}>
              {paletteCount}
            </TabCountBadge>
          </TabPill>

          <TabPill
            type="button"
            role="tab"
            id="tab-contrast"
            aria-selected={activeTab === TABS.CONTRAST}
            aria-controls="panel-contrast"
            tabIndex={0}
            $isActive={activeTab === TABS.CONTRAST}
            onClick={() => setActiveTab(TABS.CONTRAST)}
          >
            <EyeIcon size={15} />
            <span>Contrast Checker</span>
            {isStale && <TabStaleDot title="Palette changed - refresh needed" />}
          </TabPill>
        </TabPillContainer>
      </HeaderCenter>

      <HeaderRight />
    </HeaderContainer>
  );
}

export default Header;
