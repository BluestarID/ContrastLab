import React, { useState, useMemo } from "react";
import styled from "styled-components";

import { PaletteItem, ContrastPair } from "../types";
import {
  getContrastRatio,
  evaluateWCAG,
  hexToRgb,
  formatRgb,
} from "../utils/colorMath";
import {
  RefreshIcon,
  CheckIcon,
  CrossIcon,
  AlertCircleIcon,
  EyeIcon,
  SparklesIcon,
} from "./Icons";
import { EmptyState } from "./ui/EmptyState";
import { ColorDot } from "./ui/ColorDot";
import { SectionHeading, SectionSubheading } from "./ui/Typography";

const ContrastViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 24px);
  width: 100%;
  min-width: 0;
`;

const StaleNotificationBanner = styled.div`
  background-color: var(--color-warn-bg);
  border: 1px solid var(--color-warn-border);
  border-radius: var(--radius-lg);
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  box-shadow: var(--shadow-xs);
  flex-wrap: wrap;
  width: 100%;
`;

const StaleBannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 240px;

  svg {
    width: 18px !important;
    height: 18px !important;
    color: #D97706;
  }
`;

const StaleBannerContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StaleTitle = styled.strong`
  display: block;
  font-size: 0.88rem;
  color: var(--color-warn-text);
  font-weight: 700;
`;

const StaleDesc = styled.p`
  font-size: 0.78rem;
  color: #78350F;
`;

const StaleRefreshBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background-color: #B45309;
  color: #FFFFFF;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: var(--radius-md);
  white-space: nowrap;
  box-shadow: var(--shadow-xs);
  flex-shrink: 0;

  svg {
    width: 14px !important;
    height: 14px !important;
  }

  &:hover {
    background-color: #92400E;
  }
`;

const ContrastTopBar = styled.section`
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: clamp(16px, 2vw, 22px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-xs);
  width: 100%;
  min-width: 0;
`;

const ContrastHeaderMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const ManualRefreshBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 16px;
  background-color: var(--accent-primary);
  color: #FFFFFF;
  font-size: 0.86rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  white-space: nowrap;

  svg {
    width: 15px !important;
    height: 15px !important;
  }

  &:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }
`;

const ContrastStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: 10px;
  width: 100%;
`;

const StatCard = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StatLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const StatNumber = styled.span<{ $colorVariant?: "default" | "success" | "warning" | "danger" | "accent" }>`
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.2;
  font-family: var(--font-mono);
  color: ${({ $colorVariant }) => {
    switch ($colorVariant) {
      case "success":
        return "#16A34A";
      case "warning":
        return "#D97706";
      case "danger":
        return "#DC2626";
      case "accent":
        return "var(--accent-primary)";
      default:
        return "var(--text-primary)";
    }
  }};
`;

const StatSub = styled.span`
  font-size: 0.7rem;
  color: var(--text-subtle);
`;

const ContrastFiltersRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterChipsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterPill = styled.button<{
  $isActive: boolean;
  $variant?: "default" | "fail" | "pass" | "aaa";
}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  font-size: 0.76rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background-color: ${({ $isActive, $variant }) => {
    if (!$isActive) return "var(--bg-surface)";
    if ($variant === "fail") return "var(--color-fail-text)";
    if ($variant === "pass") return "var(--color-pass-text)";
    if ($variant === "aaa") return "var(--accent-primary)";
    return "var(--text-primary)";
  }};
  border: 1px solid
    ${({ $isActive, $variant }) => {
      if (!$isActive) return "var(--border-light)";
      if ($variant === "fail") return "var(--color-fail-text)";
      if ($variant === "pass") return "var(--color-pass-text)";
      if ($variant === "aaa") return "var(--accent-primary)";
      return "var(--text-primary)";
    }};
  color: ${({ $isActive }) => ($isActive ? "#FFFFFF" : "var(--text-secondary)")};
  white-space: nowrap;

  svg {
    width: 13px !important;
    height: 13px !important;
  }

  &:hover {
    background-color: ${({ $isActive, $variant }) => {
      if (!$isActive) return "var(--bg-subtle)";
      if ($variant === "fail") return "var(--color-fail-text)";
      if ($variant === "pass") return "var(--color-pass-text)";
      if ($variant === "aaa") return "var(--accent-primary)";
      return "var(--text-primary)";
    }};
    color: ${({ $isActive }) => ($isActive ? "#FFFFFF" : "var(--text-primary)")};
  }
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 480px) {
    justify-content: space-between;
  }
`;

const SortLabel = styled.label`
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
`;

const SortSelect = styled.select`
  padding: 5px 8px;
  font-size: 0.76rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-medium);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  outline: none;

  &:focus {
    border-color: var(--accent-primary);
  }
`;

const ContrastListSection = styled.section`
  width: 100%;
`;

const ContrastPairsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const ContrastCard = styled.article`
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
  min-width: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ContrastCardMeta = styled.div`
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid var(--border-light);
  background-color: var(--bg-primary);
  min-width: 0;

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid var(--border-light);
  }
`;

const ColorPairIdentifiers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background-color: var(--bg-surface);
  padding: 7px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
`;

const ColorIdItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const IdLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-subtle);
  letter-spacing: 0.04em;
`;

const IdSwatchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const IdHex = styled.span`
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`;

const ColorIdSeparator = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
`;

const ContrastRatioBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RatioHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RatioLabel = styled.span`
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-secondary);
`;

const RatioProminentBadge = styled.span<{ $isPass: boolean }>`
  font-size: 1.15rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  background-color: ${({ $isPass }) =>
    $isPass ? "var(--color-pass-bg)" : "var(--color-fail-bg)"};
  color: ${({ $isPass }) =>
    $isPass ? "var(--color-pass-text)" : "var(--color-fail-text)"};
  border: 1px solid
    ${({ $isPass }) =>
      $isPass ? "var(--color-pass-border)" : "var(--color-fail-border)"};
`;

const WcagThresholdsMatrix = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ThresholdBadge = styled.div<{ $isPass: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  border-radius: var(--radius-md);
  border: 1px solid
    ${({ $isPass }) =>
      $isPass ? "var(--color-pass-border)" : "var(--color-fail-border)"};
  background-color: ${({ $isPass }) =>
    $isPass ? "var(--color-pass-bg)" : "var(--color-fail-bg)"};
  color: ${({ $isPass }) =>
    $isPass ? "var(--color-pass-text)" : "var(--color-fail-text)"};
  min-width: 0;
`;

const ThresholdIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;

  svg {
    width: 13px !important;
    height: 13px !important;
  }
`;

const ThresholdInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const ThresholdTitle = styled.span`
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ThresholdSpec = styled.span`
  font-size: 0.6rem;
  opacity: 0.8;
  font-family: var(--font-mono);
`;

const ThresholdStatus = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  flex-shrink: 0;
`;

const ContrastLivePreviewBox = styled.div<{ $bgHex: string; $fgHex: string }>`
  padding: clamp(16px, 2.5vw, 24px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  position: relative;
  min-height: 140px;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
  background-color: ${({ $bgHex }) => $bgHex};
  color: ${({ $fgHex }) => $fgHex};
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

const SampleSentenceLarge = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
  line-height: 1.3;
`;

const SampleSentenceNormal = styled.p`
  font-size: clamp(0.85rem, 1.5vw, 0.92rem);
  font-weight: 400;
  line-height: 1.4;
`;

const SampleUiElements = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

const SamplePillBtn = styled.button<{ $bgHex: string; $fgHex: string }>`
  position: relative;
  z-index: 1;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  display: inline-block;
  white-space: nowrap;
  outline: 1px solid ${({ $fgHex }) => $fgHex};
  border: none;
  background-color: transparent;
  color: ${({ $fgHex }) => $fgHex};
  opacity: 1;
  transform: none;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover,
  &:focus-visible {
    background-color: ${({ $fgHex }) => $fgHex};
    color: ${({ $bgHex }) => $bgHex};
    transform: translateY(-1px);
  }

  &:active {
    opacity: 0.75;
    transform: scale(0.97);
  }
`;

const SampleCaptionText = styled.span`
  font-size: 0.72rem;
  opacity: 0.85;
`;

const PreviewFooterTag = styled.div`
  font-size: 0.65rem;
  font-family: var(--font-mono);
  opacity: 0.7;
  text-align: right;
`;

const NoFilterResults = styled.div`
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
  color: var(--text-secondary);
`;

const ResetFilterBtn = styled.button`
  margin-top: 10px;
  padding: 6px 14px;
  background-color: var(--accent-primary);
  color: #FFFFFF;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 600;
`;

export interface InteractivePreviewButtonProps {
  bgHex: string;
  fgHex: string;
}

export function InteractivePreviewButton({
  bgHex,
  fgHex,
}: InteractivePreviewButtonProps): React.JSX.Element {
  return (
    <SamplePillBtn
      type="button"
      $bgHex={bgHex}
      $fgHex={fgHex}
      title="Hover or click to preview active/hover states"
    >
      Interactive Button Preview
    </SamplePillBtn>
  );
}

export interface ContrastCheckerProps {
  snapshotPalette: PaletteItem[];
  isStale: boolean;
  onRefresh: () => void;
  onSwitchToPalette: () => void;
}

export function ContrastChecker({
  snapshotPalette,
  isStale,
  onRefresh,
  onSwitchToPalette,
}: ContrastCheckerProps): React.JSX.Element {
  const [filterMode, setFilterMode] = useState<string>("all");
  const [sortMode, setSortMode] = useState<string>("default");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefreshClick = (): void => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const contrastPairs = useMemo<ContrastPair[]>(() => {
    if (!snapshotPalette || snapshotPalette.length < 2) return [];

    const pairs: ContrastPair[] = [];
    for (let i = 0; i < snapshotPalette.length; i++) {
      for (let j = 0; j < snapshotPalette.length; j++) {
        if (i !== j) {
          const bg = snapshotPalette[i].hex;
          const fg = snapshotPalette[j].hex;
          const ratio = getContrastRatio(fg, bg);
          const wcag = evaluateWCAG(ratio);

          pairs.push({
            id: `pair-${i}-${j}-${bg}-${fg}`,
            bgHex: bg,
            fgHex: fg,
            bgIndex: i + 1,
            fgIndex: j + 1,
            bgRgb: formatRgb(hexToRgb(bg)),
            fgRgb: formatRgb(hexToRgb(fg)),
            ratio,
            wcag,
          });
        }
      }
    }
    return pairs;
  }, [snapshotPalette]);

  const filteredPairs = useMemo<ContrastPair[]>(() => {
    let result = [...contrastPairs];

    if (filterMode === "failing") {
      result = result.filter((p) => !p.wcag.aaNormal);
    } else if (filterMode === "passing") {
      result = result.filter((p) => p.wcag.aaNormal);
    } else if (filterMode === "aaa") {
      result = result.filter((p) => p.wcag.aaaNormal);
    }

    if (sortMode === "lowest") {
      result.sort((a, b) => a.ratio - b.ratio);
    } else if (sortMode === "highest") {
      result.sort((a, b) => b.ratio - a.ratio);
    }

    return result;
  }, [contrastPairs, filterMode, sortMode]);

  const totalCount = contrastPairs.length;
  const passingAaCount = contrastPairs.filter((p) => p.wcag.aaNormal).length;
  const passingAaaCount = contrastPairs.filter((p) => p.wcag.aaaNormal).length;
  const passRate = totalCount > 0 ? Math.round((passingAaCount / totalCount) * 100) : 0;

  return (
    <ContrastViewContainer id="panel-contrast" role="tabpanel" aria-labelledby="tab-contrast">
      {isStale && (
        <StaleNotificationBanner role="alert">
          <StaleBannerLeft>
            <AlertCircleIcon size={18} />
            <StaleBannerContent>
              <StaleTitle>Your palette has changed</StaleTitle>
              <StaleDesc>
                The contrast results below reflect your previous snapshot. Refresh to test your
                updated colors.
              </StaleDesc>
            </StaleBannerContent>
          </StaleBannerLeft>
          <StaleRefreshBtn type="button" onClick={handleRefreshClick}>
            <RefreshIcon size={14} spinning={isRefreshing} />
            <span>Refresh Results</span>
          </StaleRefreshBtn>
        </StaleNotificationBanner>
      )}

      <ContrastTopBar aria-label="Contrast Controls">
        <ContrastHeaderMain>
          <div>
            <SectionHeading>WCAG Contrast Matrix</SectionHeading>
            <SectionSubheading>
              Testing all directional combinations (Background vs. Text) for compliance
            </SectionSubheading>
          </div>

          <ManualRefreshBtn
            type="button"
            onClick={handleRefreshClick}
            title="Recompute contrast pairs from current palette"
          >
            <RefreshIcon size={15} spinning={isRefreshing} />
            <span>Refresh Checker</span>
          </ManualRefreshBtn>
        </ContrastHeaderMain>

        {totalCount > 0 && (
          <ContrastStatsGrid>
            <StatCard>
              <StatLabel>Total Combinations</StatLabel>
              <StatNumber>{totalCount}</StatNumber>
            </StatCard>
            <StatCard>
              <StatLabel>WCAG AA Pass Rate</StatLabel>
              <StatNumber
                $colorVariant={
                  passRate >= 70 ? "success" : passRate >= 40 ? "warning" : "danger"
                }
              >
                {passRate}%
              </StatNumber>
              <StatSub>
                {passingAaCount} of {totalCount} pairs
              </StatSub>
            </StatCard>
            <StatCard>
              <StatLabel>WCAG AAA Passing</StatLabel>
              <StatNumber $colorVariant="accent">{passingAaaCount}</StatNumber>
              <StatSub>Strict compliance (≥ 7:1)</StatSub>
            </StatCard>
          </ContrastStatsGrid>
        )}

        {totalCount > 0 && (
          <ContrastFiltersRow>
            <FilterChipsGroup role="group" aria-label="Filter Pairs">
              <FilterPill
                type="button"
                $isActive={filterMode === "all"}
                onClick={() => setFilterMode("all")}
              >
                All Pairs ({totalCount})
              </FilterPill>
              <FilterPill
                type="button"
                $variant="fail"
                $isActive={filterMode === "failing"}
                onClick={() => setFilterMode("failing")}
              >
                <CrossIcon size={13} />
                Failing AA ({totalCount - passingAaCount})
              </FilterPill>
              <FilterPill
                type="button"
                $variant="pass"
                $isActive={filterMode === "passing"}
                onClick={() => setFilterMode("passing")}
              >
                <CheckIcon size={13} />
                Passing AA ({passingAaCount})
              </FilterPill>
              <FilterPill
                type="button"
                $variant="aaa"
                $isActive={filterMode === "aaa"}
                onClick={() => setFilterMode("aaa")}
              >
                AAA Perfect ({passingAaaCount})
              </FilterPill>
            </FilterChipsGroup>

            <SortControls>
              <SortLabel htmlFor="contrast-sort">Sort by:</SortLabel>
              <SortSelect
                id="contrast-sort"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="default">Palette Order</option>
                <option value="lowest">Lowest Ratio (Fix first)</option>
                <option value="highest">Highest Ratio First</option>
              </SortSelect>
            </SortControls>
          </ContrastFiltersRow>
        )}
      </ContrastTopBar>

      <ContrastListSection aria-label="Contrast Pairs Results">
        {!snapshotPalette || snapshotPalette.length < 2 ? (
          <EmptyState
            icon={<EyeIcon size={22} />}
            title="Need at least 2 colors to check contrast"
            description={`Your snapshot currently has ${
              snapshotPalette ? snapshotPalette.length : 0
            } color(s). Add at least two colors to your palette and click Refresh to test every combination.`}
            actionText="Go to Color Palette"
            actionIcon={<SparklesIcon size={15} />}
            onAction={onSwitchToPalette}
          />
        ) : filteredPairs.length === 0 ? (
          <NoFilterResults>
            <p>No contrast pairs match the selected filter.</p>
            <ResetFilterBtn type="button" onClick={() => setFilterMode("all")}>
              Show All Pairs
            </ResetFilterBtn>
          </NoFilterResults>
        ) : (
          <ContrastPairsList>
            {filteredPairs.map((pair) => {
              const { wcag } = pair;

              return (
                <ContrastCard key={pair.id}>
                  <ContrastCardMeta>
                    <ColorPairIdentifiers>
                      <ColorIdItem>
                        <IdLabel>BACKGROUND</IdLabel>
                        <IdSwatchWrap>
                          <ColorDot $color={pair.bgHex} $size={13} />
                          <IdHex>{pair.bgHex}</IdHex>
                        </IdSwatchWrap>
                      </ColorIdItem>

                      <ColorIdSeparator>vs</ColorIdSeparator>

                      <ColorIdItem>
                        <IdLabel>TEXT</IdLabel>
                        <IdSwatchWrap>
                          <ColorDot $color={pair.fgHex} $size={13} />
                          <IdHex>{pair.fgHex}</IdHex>
                        </IdSwatchWrap>
                      </ColorIdItem>
                    </ColorPairIdentifiers>

                    <ContrastRatioBlock>
                      <RatioHeader>
                        <RatioLabel>Contrast Ratio</RatioLabel>
                        <RatioProminentBadge $isPass={wcag.aaNormal}>
                          {wcag.formattedRatio}
                        </RatioProminentBadge>
                      </RatioHeader>
                    </ContrastRatioBlock>

                    <WcagThresholdsMatrix>
                      <ThresholdBadge $isPass={wcag.aaNormal}>
                        <ThresholdIcon>
                          {wcag.aaNormal ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </ThresholdIcon>
                        <ThresholdInfo>
                          <ThresholdTitle>AA Normal Text</ThresholdTitle>
                          <ThresholdSpec>≥ 4.5:1</ThresholdSpec>
                        </ThresholdInfo>
                        <ThresholdStatus>{wcag.aaNormal ? "PASS" : "FAIL"}</ThresholdStatus>
                      </ThresholdBadge>

                      <ThresholdBadge $isPass={wcag.aaLarge}>
                        <ThresholdIcon>
                          {wcag.aaLarge ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </ThresholdIcon>
                        <ThresholdInfo>
                          <ThresholdTitle>AA Large Text</ThresholdTitle>
                          <ThresholdSpec>≥ 3.0:1</ThresholdSpec>
                        </ThresholdInfo>
                        <ThresholdStatus>{wcag.aaLarge ? "PASS" : "FAIL"}</ThresholdStatus>
                      </ThresholdBadge>

                      <ThresholdBadge $isPass={wcag.aaaNormal}>
                        <ThresholdIcon>
                          {wcag.aaaNormal ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </ThresholdIcon>
                        <ThresholdInfo>
                          <ThresholdTitle>AAA Normal Text</ThresholdTitle>
                          <ThresholdSpec>≥ 7.0:1</ThresholdSpec>
                        </ThresholdInfo>
                        <ThresholdStatus>{wcag.aaaNormal ? "PASS" : "FAIL"}</ThresholdStatus>
                      </ThresholdBadge>

                      <ThresholdBadge $isPass={wcag.aaaLarge}>
                        <ThresholdIcon>
                          {wcag.aaaLarge ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
                        </ThresholdIcon>
                        <ThresholdInfo>
                          <ThresholdTitle>AAA Large Text</ThresholdTitle>
                          <ThresholdSpec>≥ 4.5:1</ThresholdSpec>
                        </ThresholdInfo>
                        <ThresholdStatus>{wcag.aaaLarge ? "PASS" : "FAIL"}</ThresholdStatus>
                      </ThresholdBadge>
                    </WcagThresholdsMatrix>
                  </ContrastCardMeta>

                  <ContrastLivePreviewBox $bgHex={pair.bgHex} $fgHex={pair.fgHex}>
                    <PreviewContent>
                      <SampleSentenceLarge>
                        The quick brown fox jumps over the lazy dog
                      </SampleSentenceLarge>
                      <SampleSentenceNormal>
                        The quick brown fox jumps over the lazy dog. 1234567890 &amp; @#$
                      </SampleSentenceNormal>
                      <SampleUiElements>
                        <InteractivePreviewButton bgHex={pair.bgHex} fgHex={pair.fgHex} />
                        <SampleCaptionText>Sample caption (12px text)</SampleCaptionText>
                      </SampleUiElements>
                    </PreviewContent>

                    <PreviewFooterTag>
                      <span>
                        Live Render ({pair.fgHex} on {pair.bgHex})
                      </span>
                    </PreviewFooterTag>
                  </ContrastLivePreviewBox>
                </ContrastCard>
              );
            })}
          </ContrastPairsList>
        )}
      </ContrastListSection>
    </ContrastViewContainer>
  );
}

export default ContrastChecker;
