import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes, css } from "styled-components";

import { BIAS_MODES, PaletteItem, GeneratedSwatch } from "../types";
import { generateHarmoniousPalette } from "../utils/harmony";
import { isLightColor } from "../utils/colorMath";
import { ShuffleIcon, PlusIcon, SparklesIcon, CheckIcon } from "./Icons";

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SidebarContainer = styled.aside`
  width: var(--sidebar-width);
  min-width: 290px;
  max-width: 340px;
  height: 100%;
  max-height: 100%;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  padding: 20px 18px;
  gap: 16px;
  flex-shrink: 0;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    height: auto;
    max-height: none;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid var(--border-light);
    padding: 18px clamp(16px, 3vw, 24px);
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;
`;

const SidebarTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SidebarTitleIcon = styled.div`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: var(--radius-md);
  background-color: var(--accent-subtle);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SidebarTitleText = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarTitle = styled.h2`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
`;

const SidebarSubtitle = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 1px;
`;

const BiasFiltersGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BiasLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
`;

const BiasChips = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background-color: var(--bg-subtle);
  padding: 3px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BiasChip = styled.button<{ $isActive: boolean }>`
  padding: 6px 2px;
  font-size: 0.76rem;
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "600")};
  text-align: center;
  color: ${({ $isActive }) => ($isActive ? "var(--accent-primary)" : "var(--text-secondary)")};
  background-color: ${({ $isActive }) => ($isActive ? "var(--bg-primary)" : "transparent")};
  box-shadow: ${({ $isActive }) => ($isActive ? "var(--shadow-xs)" : "none")};
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: var(--text-primary);
  }
`;

const GenerateButton = styled.button<{ $isShuffling: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 42px;
  min-height: 42px;
  max-height: 42px;
  padding: 0 16px;
  background-color: #0F172A;
  color: #FFFFFF;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: var(--shadow-xs);
  transition: all 0.15s ease;
  flex-shrink: 0;
  box-sizing: border-box;

  &:hover {
    background-color: #1E293B;
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px !important;
    height: 16px !important;
    flex-shrink: 0;
    ${({ $isShuffling }) =>
      $isShuffling &&
      css`
        animation: ${spinAnimation} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      `}
  }
`;

const SwatchesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 auto;
  min-height: 0;
  overflow: visible;
`;

const SwatchesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
`;

const SwatchesCount = styled.span`
  font-weight: 600;
  color: var(--text-secondary);
`;

const SwatchesHint = styled.span`
  color: var(--text-subtle);
  font-size: 0.7rem;
`;

const SwatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  align-content: start;
  padding: 4px 2px 2px 2px;
  margin: -4px -2px 0 -2px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 680px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const GeneratorSwatchCard = styled.div<{ $bgColor: string }>`
  height: 84px;
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: var(--shadow-xs);
  background-color: ${({ $bgColor }) => $bgColor};
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    z-index: 5;
  }
`;

const SwatchCardContent = styled.div<{ $isLight: boolean }>`
  position: absolute;
  inset: 0;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${({ $isLight }) => ($isLight ? "#0F172A" : "#FFFFFF")};
`;

const SwatchTopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SwatchRuleTag = styled.span<{ $isLight: boolean }>`
  font-size: 0.64rem;
  padding: 1px 5px;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
  background: ${({ $isLight }) =>
    $isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(0, 0, 0, 0.35)"};
  color: ${({ $isLight }) => ($isLight ? "#0F172A" : "#FFFFFF")};
  border: 1px solid
    ${({ $isLight }) =>
      $isLight ? "rgba(15, 23, 42, 0.18)" : "rgba(255, 255, 255, 0.25)"};
  font-weight: ${({ $isLight }) => ($isLight ? "700" : "600")};
`;

const SwatchBottomInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const SwatchHexBtn = styled.button<{ $isLight: boolean }>`
  font-size: 0.72rem;
  font-family: var(--font-mono);
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: ${({ $isLight }) =>
    $isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(0, 0, 0, 0.35)"};
  color: ${({ $isLight }) => ($isLight ? "#0F172A" : "#FFFFFF")};
  border: 1px solid
    ${({ $isLight }) =>
      $isLight ? "rgba(15, 23, 42, 0.18)" : "rgba(255, 255, 255, 0.25)"};
  font-weight: 700;

  &:hover {
    opacity: 0.85;
  }
`;

const SwatchAddBtn = styled.button<{ $isLight: boolean; $isAdded: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.15s ease;
  flex-shrink: 0;
  background: ${({ $isAdded, $isLight }) =>
    $isAdded ? "#16A34A !important" : $isLight ? "#0F172A" : "#FFFFFF"};
  color: ${({ $isAdded, $isLight }) =>
    $isAdded ? "#FFFFFF !important" : $isLight ? "#FFFFFF" : "#0F172A"};

  svg {
    width: 13px !important;
    height: 13px !important;
  }

  &:hover {
    background: var(--accent-primary) !important;
    color: #FFFFFF !important;
  }
`;

const SidebarFooter = styled.div`
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
  flex-shrink: 0;
`;

const SidebarFooterTip = styled.p`
  font-size: 0.74rem;
  color: var(--text-secondary);
  line-height: 1.55;
  display: block;
  word-break: normal;
  overflow-wrap: break-word;
`;

export interface SidebarGeneratorProps {
  palette: PaletteItem[];
  onAddColor: (hex: string) => void;
}

export function SidebarGenerator({
  palette,
  onAddColor,
}: SidebarGeneratorProps): React.JSX.Element {
  const [biasMode, setBiasMode] = useState<string>(BIAS_MODES.ANY);
  const [swatches, setSwatches] = useState<GeneratedSwatch[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const paletteRef = useRef<PaletteItem[]>(palette);
  paletteRef.current = palette;

  const handleGenerate = useCallback(
    (targetBias?: string): void => {
      const activeBias = targetBias || biasMode;
      setIsShuffling(true);
      const newSwatches = generateHarmoniousPalette(paletteRef.current, activeBias, 8);
      setSwatches(newSwatches);
      setTimeout(() => setIsShuffling(false), 200);
    },
    [biasMode]
  );

  useEffect(() => {
    handleGenerate(biasMode);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBiasSelect = (filterId: string): void => {
    setBiasMode(filterId);
    handleGenerate(filterId);
  };

  const handleCopy = (hex: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleAdd = (swatch: GeneratedSwatch, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onAddColor(swatch.hex);
    setRecentlyAddedId(swatch.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  return (
    <SidebarContainer aria-label="Color Harmony Generator">
      <SidebarHeader>
        <SidebarTitleRow>
          <SidebarTitleIcon>
            <SparklesIcon size={16} />
          </SidebarTitleIcon>
          <SidebarTitleText>
            <SidebarTitle>Color Generator</SidebarTitle>
            <SidebarSubtitle>Harmonious suggestions for your palette</SidebarSubtitle>
          </SidebarTitleText>
        </SidebarTitleRow>

        <BiasFiltersGroup>
          <BiasLabel>Target Lightness:</BiasLabel>
          <BiasChips role="group" aria-label="Lightness Bias Filter">
            {[
              { id: BIAS_MODES.ANY, label: "Any", desc: "Full spectrum harmony" },
              { id: BIAS_MODES.LIGHT, label: "Light", desc: "Pastels & tints for dark backgrounds" },
              { id: BIAS_MODES.DARK, label: "Dark", desc: "Deep rich tones for light backgrounds" },
              { id: BIAS_MODES.NEUTRAL, label: "Neutral", desc: "Low-saturation background greys" },
            ].map((filter) => (
              <BiasChip
                key={filter.id}
                type="button"
                $isActive={biasMode === filter.id}
                onClick={() => handleBiasSelect(filter.id)}
                title={filter.desc}
                aria-pressed={biasMode === filter.id}
              >
                {filter.label}
              </BiasChip>
            ))}
          </BiasChips>
        </BiasFiltersGroup>

        <GenerateButton
          type="button"
          $isShuffling={isShuffling}
          onClick={() => handleGenerate(biasMode)}
          title="Roll fresh harmonious color suggestions"
        >
          <ShuffleIcon size={16} />
          <span>Generate New Colors</span>
        </GenerateButton>
      </SidebarHeader>

      <SwatchesSection>
        <SwatchesHeader>
          <SwatchesCount>Suggestions ({swatches.length})</SwatchesCount>
          <SwatchesHint>Click + to add to palette</SwatchesHint>
        </SwatchesHeader>

        <SwatchesGrid>
          {swatches.map((swatch) => {
            const isLight = isLightColor(swatch.hex);
            const isCopied = copiedHex === swatch.hex;
            const isAdded = recentlyAddedId === swatch.id;

            return (
              <GeneratorSwatchCard key={swatch.id} $bgColor={swatch.hex}>
                <SwatchCardContent $isLight={isLight}>
                  <SwatchTopInfo>
                    <SwatchRuleTag $isLight={isLight}>{swatch.rule}</SwatchRuleTag>
                  </SwatchTopInfo>

                  <SwatchBottomInfo>
                    <SwatchHexBtn
                      type="button"
                      $isLight={isLight}
                      onClick={(e) => handleCopy(swatch.hex, e)}
                      title={`Copy ${swatch.hex}`}
                    >
                      {isCopied ? (
                        <span>
                          <CheckIcon size={12} /> Copied
                        </span>
                      ) : (
                        <span>{swatch.hex}</span>
                      )}
                    </SwatchHexBtn>

                    <SwatchAddBtn
                      type="button"
                      $isLight={isLight}
                      $isAdded={isAdded}
                      onClick={(e) => handleAdd(swatch, e)}
                      title={`Add ${swatch.hex} to palette`}
                      aria-label={`Add ${swatch.hex} to palette`}
                    >
                      {isAdded ? (
                        <CheckIcon size={13} />
                      ) : (
                        <>
                          <PlusIcon size={13} />
                          <span>Add</span>
                        </>
                      )}
                    </SwatchAddBtn>
                  </SwatchBottomInfo>
                </SwatchCardContent>
              </GeneratorSwatchCard>
            );
          })}
        </SwatchesGrid>
      </SwatchesSection>

      <SidebarFooter>
        <SidebarFooterTip>
          💡 <strong>Tip:</strong> Need to fix failing contrast? Choose <strong>Light</strong> or{" "}
          <strong>Dark</strong> to find accessible pair colors.
        </SidebarFooterTip>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default SidebarGenerator;
