import React, { useState } from "react";
import styled from "styled-components";

import { PaletteItem, SavedPalette, STARTER_PRESETS } from "../types";
import {
  normalizeHex,
  isValidHex,
  hexToRgb,
  formatRgb,
  isLightColor,
  getRelativeLuminance,
} from "../utils/colorMath";
import {
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CopyIcon,
  CheckIcon,
  SparklesIcon,
  LayersIcon,
  BookmarkIcon,
  SaveIcon,
  CrossIcon,
} from "./Icons";
import { EmptyState } from "./ui/EmptyState";
import { ColorDot } from "./ui/ColorDot";
import { SectionHeading, SectionSubheading } from "./ui/Typography";

const PaletteViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 24px);
  width: 100%;
  min-width: 0;
`;

const PaletteInputSection = styled.section`
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: clamp(16px, 2vw, 22px);
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
`;

const PaletteInputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ColorPreviewTrigger = styled.div<{ $bgColor: string }>`
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-medium);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  background-color: ${({ $bgColor }) => $bgColor};
`;

const NativeColorInput = styled.input`
  position: absolute;
  inset: -10px;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  opacity: 0;
  cursor: pointer;
`;

const HexInputWrap = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-medium);
  border-radius: var(--radius-md);
  padding: 0 12px;
  height: 42px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  min-width: 160px;
  flex: 1;
  max-width: 260px;

  &:focus-within {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-focus);
    background-color: #FFFFFF;
  }

  @media (max-width: 680px) {
    max-width: 100%;
    width: 100%;
  }
`;

const HexPrefix = styled.span`
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
  margin-right: 4px;
`;

const HexTextInput = styled.input<{ $hasError?: boolean }>`
  border: none;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $hasError }) => ($hasError ? "var(--color-fail-text)" : "var(--text-primary)")};
  width: 100%;
  outline: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const PrimaryAddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 42px;
  padding: 0 20px;
  background-color: var(--accent-primary);
  color: #FFFFFF;
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  white-space: nowrap;

  svg {
    width: 15px !important;
    height: 15px !important;
  }

  &:hover:not(:disabled) {
    background-color: var(--accent-hover);
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 680px) {
    width: 100%;
  }
`;

const InputErrorMsg = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-fail-text);
`;

const PresetsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
`;

const PresetsTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

const PresetButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
`;

const PresetBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;

  &:hover {
    background-color: var(--bg-subtle);
    border-color: var(--border-medium);
    color: var(--text-primary);
  }
`;

const PresetDots = styled.div`
  display: flex;
  gap: 3px;
`;

const ClearPaletteBtn = styled.button`
  padding: 5px 12px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--color-fail-text);
  border-radius: var(--radius-full);
  white-space: nowrap;

  &:hover {
    background-color: var(--color-fail-bg);
  }
`;

const SavedPalettesBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
`;

const SavedBarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const SavedTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SavedBarTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const SavedActionsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SaveSuccessTag = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: #15803D;
  background-color: #DCFCE7;
  padding: 2px 7px;
  border-radius: var(--radius-full);
`;

const SavePaletteTriggerBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: var(--accent-subtle);
    border-color: var(--accent-border);
    color: var(--accent-primary);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SavePaletteInlineForm = styled.form`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SavePaletteInput = styled.input`
  padding: 3px 8px;
  font-size: 0.76rem;
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-sm);
  outline: none;
  background-color: #FFFFFF;
  min-width: 140px;
  box-shadow: var(--shadow-focus);
`;

const SaveConfirmBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 9px;
  background-color: var(--accent-primary);
  color: #FFFFFF;
  font-size: 0.74rem;
  font-weight: 700;
  border-radius: var(--radius-sm);

  &:hover {
    background-color: var(--accent-hover);
  }
`;

const SaveCancelBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--text-muted);
  border-radius: var(--radius-sm);

  &:hover {
    color: var(--color-fail-text);
    background-color: var(--color-fail-bg);
  }
`;

const SavedPalettesList = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SavedPaletteChip = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--border-medium);
    box-shadow: var(--shadow-sm);
  }
`;

const SavedChipLoadBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 9px 5px 10px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-subtle);
  }
`;

const SavedChipDots = styled.div`
  display: flex;
  gap: 2.5px;
`;

const SavedChipName = styled.span`
  font-weight: 600;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SavedChipCount = styled.span`
  font-size: 0.65rem;
  font-family: var(--font-mono);
  background: rgba(15, 23, 42, 0.08);
  padding: 1px 5px;
  border-radius: var(--radius-full);
  color: var(--text-muted);
`;

const SavedChipDelBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 100%;
  padding: 5px 6px;
  color: var(--text-muted);
  border-left: 1px solid var(--border-light);
  cursor: pointer;

  &:hover {
    color: var(--color-fail-text);
    background-color: var(--color-fail-bg);
  }
`;

const SavedEmptyHint = styled.p`
  font-size: 0.74rem;
  color: var(--text-subtle);
  line-height: 1.4;
`;

const PaletteGridSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 8px;
`;

const ReorderTip = styled.div`
  font-size: 0.75rem;
  color: var(--text-subtle);
`;

const PaletteCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: clamp(12px, 2vw, 18px);
  width: 100%;

  @media (max-width: 680px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PaletteColorCard = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  min-width: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const PaletteSwatchBox = styled.div<{ $bgColor: string }>`
  height: 150px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background-color: ${({ $bgColor }) => $bgColor};
`;

const CardTopOverlay = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.9;
  transition: opacity 0.15s ease;

  ${PaletteColorCard}:hover & {
    opacity: 1;
  }
`;

const CardReorderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  padding: 2px 4px;
  border-radius: var(--radius-md);
`;

const CardRightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  padding: 2px 4px;
  border-radius: var(--radius-md);
`;

const CardActionIconBtn = styled.button<{ $isDelete?: boolean }>`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  border-radius: var(--radius-sm);

  svg {
    width: 13px !important;
    height: 13px !important;
  }

  &:hover:not(:disabled) {
    background: ${({ $isDelete }) =>
      $isDelete ? "#DC2626" : "rgba(255, 255, 255, 0.25)"};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CardPickerLabel = styled.label`
  position: relative;
  cursor: pointer;
`;

const CardHiddenPicker = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CardPickerBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: #FFFFFF;
  padding: 2px 6px;
  border-radius: var(--radius-sm);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const SwatchCenterLabel = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

const SwatchIndexTag = styled.span<{ $isLight: boolean }>`
  font-size: 0.68rem;
  font-family: var(--font-mono);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  display: inline-block;
  font-weight: 700;
  background: ${({ $isLight }) =>
    $isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.25)"};
  color: ${({ $isLight }) => ($isLight ? "#0F172A" : "#FFFFFF")};
  border: 1px solid
    ${({ $isLight }) =>
      $isLight ? "rgba(15, 23, 42, 0.2)" : "rgba(255, 255, 255, 0.35)"};
  ${({ $isLight }) => (!$isLight ? "backdrop-filter: blur(4px);" : "")}
`;

const PaletteCardFooter = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: var(--bg-primary);
`;

const ColorCodeRow = styled.div`
  display: flex;
  align-items: center;
`;

const CopyableCodeBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 3px 5px;
  margin: -3px -5px;
  border-radius: var(--radius-sm);
  text-align: left;

  &:hover {
    background-color: var(--bg-subtle);
  }

  svg {
    width: 13px !important;
    height: 13px !important;
  }
`;

const CodeLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
`;

const CodeValue = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-mono);
`;

const ColorMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--border-light);
  padding-top: 5px;
  font-size: 0.7rem;
`;

const MetaLabel = styled.span`
  color: var(--text-subtle);
`;

const MetaValue = styled.span`
  color: var(--text-secondary);
  font-weight: 600;
  font-family: var(--font-mono);
`;

export interface PaletteManagerProps {
  palette: PaletteItem[];
  onAddColor: (hex: string) => void;
  onRemoveColor: (index: number) => void;
  onUpdateColor: (index: number, newHex: string) => void;
  onReorderColor: (fromIndex: number, toIndex: number) => void;
  onLoadPreset: (colorHexes: string[]) => void;
  onClearPalette: () => void;
  savedPalettes: SavedPalette[];
  onSavePalette: (customName: string) => void;
  onDeleteSavedPalette: (id: string) => void;
  onLoadSavedPalette: (colorHexes: string[]) => void;
}

export function PaletteManager({
  palette,
  onAddColor,
  onRemoveColor,
  onUpdateColor,
  onReorderColor,
  onLoadPreset,
  onClearPalette,
  savedPalettes = [],
  onSavePalette,
  onDeleteSavedPalette,
  onLoadSavedPalette,
}: PaletteManagerProps): React.JSX.Element {
  const [inputHex, setInputHex] = useState<string>("#307CFF");
  const [pickerHex, setPickerHex] = useState<string>("#307CFF");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string>("");

  const [isSavingPalette, setIsSavingPalette] = useState<boolean>(false);
  const [paletteSaveName, setPaletteSaveName] = useState<string>("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setInputHex(val);
    if (val.trim() === "") {
      setInputError("");
      return;
    }
    const normalized = normalizeHex(val);
    if (normalized) {
      setPickerHex(normalized);
      setInputError("");
    } else {
      setInputError("Invalid hex code");
    }
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value.toUpperCase();
    setPickerHex(val);
    setInputHex(val);
    setInputError("");
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const normalized = normalizeHex(inputHex);
    if (!normalized) {
      setInputError("Please enter a valid 3 or 6 digit hex color (e.g. #307CFF)");
      return;
    }
    onAddColor(normalized);
    setInputError("");
  };

  const handleCopyText = (text: string, key: string): void => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleTriggerSave = (): void => {
    if (!palette || palette.length === 0) return;
    setIsSavingPalette(true);
    setPaletteSaveName(`Palette ${savedPalettes.length + 1}`);
  };

  const handleConfirmSave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!palette || palette.length === 0) return;
    onSavePalette(paletteSaveName);
    setIsSavingPalette(false);
    setSaveSuccessMsg("Saved to browser!");
    setTimeout(() => setSaveSuccessMsg(""), 2000);
  };

  const handleCancelSave = (): void => {
    setIsSavingPalette(false);
    setPaletteSaveName("");
  };

  const previewBgColor = isValidHex(inputHex) ? normalizeHex(inputHex) || "#FFFFFF" : "#E2E8F0";

  return (
    <PaletteViewContainer id="panel-palette" role="tabpanel" aria-labelledby="tab-palette">
      <PaletteInputSection aria-label="Add New Color">
        <PaletteInputForm onSubmit={handleAdd}>
          <InputGroup>
            <ColorPreviewTrigger $bgColor={previewBgColor}>
              <NativeColorInput
                type="color"
                value={pickerHex}
                onChange={handlePickerChange}
                aria-label="Pick color visually"
                title="Click to open color picker"
              />
            </ColorPreviewTrigger>

            <HexInputWrap>
              <HexPrefix>#</HexPrefix>
              <HexTextInput
                type="text"
                $hasError={Boolean(inputError)}
                value={inputHex.replace(/^#/, "")}
                onChange={(e) => handleInputChange({ target: { value: "#" + e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                placeholder="307CFF"
                maxLength={7}
                aria-label="Hex color value"
              />
            </HexInputWrap>

            <PrimaryAddBtn type="submit" disabled={!isValidHex(inputHex)}>
              <PlusIcon size={15} />
              <span>Add to Palette</span>
            </PrimaryAddBtn>
          </InputGroup>

          {inputError && <InputErrorMsg role="alert">{inputError}</InputErrorMsg>}
        </PaletteInputForm>

        {/* Starter Presets Bar */}
        <PresetsBar>
          <PresetsTitle>Starter Presets:</PresetsTitle>
          <PresetButtons>
            {STARTER_PRESETS.map((preset, idx) => (
              <PresetBtn
                key={idx}
                type="button"
                onClick={() => onLoadPreset(preset.colors)}
                title={`Load ${preset.name} palette`}
              >
                <PresetDots>
                  {preset.colors.slice(0, 4).map((c, i) => (
                    <ColorDot key={i} $color={c} $size={8} />
                  ))}
                </PresetDots>
                <span>{preset.name}</span>
              </PresetBtn>
            ))}

            {palette.length > 0 && (
              <ClearPaletteBtn
                type="button"
                onClick={onClearPalette}
                title="Clear all colors in palette"
              >
                Clear All
              </ClearPaletteBtn>
            )}
          </PresetButtons>
        </PresetsBar>

        {/* Saved Palettes Bar */}
        <SavedPalettesBar>
          <SavedBarHeader>
            <SavedTitleWrap>
              <BookmarkIcon size={14} />
              <SavedBarTitle>Saved Palettes ({savedPalettes.length})</SavedBarTitle>
            </SavedTitleWrap>

            {!isSavingPalette ? (
              <SavedActionsWrap>
                {saveSuccessMsg && <SaveSuccessTag>{saveSuccessMsg}</SaveSuccessTag>}
                <SavePaletteTriggerBtn
                  type="button"
                  onClick={handleTriggerSave}
                  disabled={!palette || palette.length === 0}
                  title="Save active palette to your browser storage"
                >
                  <SaveIcon size={13} />
                  <span>Save Current Palette</span>
                </SavePaletteTriggerBtn>
              </SavedActionsWrap>
            ) : (
              <SavePaletteInlineForm onSubmit={handleConfirmSave}>
                <SavePaletteInput
                  type="text"
                  value={paletteSaveName}
                  onChange={(e) => setPaletteSaveName(e.target.value)}
                  placeholder="Palette Name"
                  maxLength={30}
                  autoFocus
                />
                <SaveConfirmBtn type="submit" title="Save">
                  <CheckIcon size={13} />
                  <span>Save</span>
                </SaveConfirmBtn>
                <SaveCancelBtn type="button" onClick={handleCancelSave} title="Cancel">
                  <CrossIcon size={13} />
                </SaveCancelBtn>
              </SavePaletteInlineForm>
            )}
          </SavedBarHeader>

          {savedPalettes.length > 0 ? (
            <SavedPalettesList>
              {savedPalettes.map((saved) => (
                <SavedPaletteChip key={saved.id}>
                  <SavedChipLoadBtn
                    type="button"
                    onClick={() => onLoadSavedPalette(saved.colors)}
                    title={`Load "${saved.name}" (${saved.colors.length} colors)`}
                  >
                    <SavedChipDots>
                      {saved.colors.slice(0, 5).map((c, i) => (
                        <ColorDot key={i} $color={c} $size={8} />
                      ))}
                    </SavedChipDots>
                    <SavedChipName>{saved.name}</SavedChipName>
                    <SavedChipCount>{saved.colors.length}</SavedChipCount>
                  </SavedChipLoadBtn>

                  <SavedChipDelBtn
                    type="button"
                    onClick={() => onDeleteSavedPalette(saved.id)}
                    title={`Delete "${saved.name}"`}
                    aria-label={`Delete "${saved.name}"`}
                  >
                    <CrossIcon size={11} />
                  </SavedChipDelBtn>
                </SavedPaletteChip>
              ))}
            </SavedPalettesList>
          ) : (
            <SavedEmptyHint>
              No custom palettes saved yet. Click <strong>Save Current Palette</strong> to store
              your color set locally in your browser.
            </SavedEmptyHint>
          )}
        </SavedPalettesBar>
      </PaletteInputSection>

      <PaletteGridSection aria-label="Palette Color Cards">
        <SectionHeaderRow>
          <div>
            <SectionHeading>Active Palette</SectionHeading>
            <SectionSubheading>
              {palette.length} {palette.length === 1 ? "color" : "colors"} in your design system
            </SectionSubheading>
          </div>
          {palette.length >= 2 && (
            <ReorderTip>
              <span>Use arrows to reorder colors</span>
            </ReorderTip>
          )}
        </SectionHeaderRow>

        {palette.length === 0 ? (
          <EmptyState
            icon={<LayersIcon size={24} />}
            title="Your palette is currently empty"
            description="Add colors using the input bar above, generate harmonious tones from the left sidebar, or load one of our curated design system presets."
            actionText="Load Antigravity Starter Set"
            actionIcon={<SparklesIcon size={15} />}
            onAction={() => onLoadPreset(STARTER_PRESETS[0].colors)}
          />
        ) : (
          <PaletteCardsGrid>
            {palette.map((item, index) => {
              const hex = item.hex;
              const rgb = hexToRgb(hex);
              const rgbStr = formatRgb(rgb);
              const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
              const isLight = isLightColor(hex);

              return (
                <PaletteColorCard key={item.id || `${hex}-${index}`}>
                  <PaletteSwatchBox $bgColor={hex}>
                    <CardTopOverlay>
                      <CardReorderControls>
                        <CardActionIconBtn
                          type="button"
                          disabled={index === 0}
                          onClick={() => onReorderColor(index, index - 1)}
                          title="Move earlier in palette"
                          aria-label="Move earlier"
                        >
                          <ArrowUpIcon size={13} />
                        </CardActionIconBtn>
                        <CardActionIconBtn
                          type="button"
                          disabled={index === palette.length - 1}
                          onClick={() => onReorderColor(index, index + 1)}
                          title="Move later in palette"
                          aria-label="Move later"
                        >
                          <ArrowDownIcon size={13} />
                        </CardActionIconBtn>
                      </CardReorderControls>

                      <CardRightControls>
                        <CardPickerLabel title="Change this color">
                          <CardHiddenPicker
                            type="color"
                            value={hex}
                            onChange={(e) =>
                              onUpdateColor(index, e.target.value.toUpperCase())
                            }
                          />
                          <CardPickerBadge>Edit</CardPickerBadge>
                        </CardPickerLabel>

                        <CardActionIconBtn
                          type="button"
                          $isDelete
                          onClick={() => onRemoveColor(index)}
                          title={`Remove ${hex} from palette`}
                          aria-label={`Remove ${hex}`}
                        >
                          <TrashIcon size={13} />
                        </CardActionIconBtn>
                      </CardRightControls>
                    </CardTopOverlay>

                    <SwatchCenterLabel>
                      <SwatchIndexTag $isLight={isLight}>#{index + 1}</SwatchIndexTag>
                    </SwatchCenterLabel>
                  </PaletteSwatchBox>

                  <PaletteCardFooter>
                    <ColorCodeRow>
                      <CopyableCodeBtn
                        type="button"
                        onClick={() => handleCopyText(hex, `hex-${index}`)}
                        title="Click to copy HEX"
                      >
                        <CodeLabel>HEX</CodeLabel>
                        <CodeValue>{hex}</CodeValue>
                        {copiedKey === `hex-${index}` ? (
                          <CheckIcon size={13} />
                        ) : (
                          <CopyIcon size={13} />
                        )}
                      </CopyableCodeBtn>
                    </ColorCodeRow>

                    <ColorCodeRow>
                      <CopyableCodeBtn
                        type="button"
                        onClick={() => handleCopyText(rgbStr, `rgb-${index}`)}
                        title="Click to copy RGB"
                      >
                        <CodeLabel>RGB</CodeLabel>
                        <CodeValue>{rgbStr}</CodeValue>
                        {copiedKey === `rgb-${index}` ? (
                          <CheckIcon size={13} />
                        ) : (
                          <CopyIcon size={13} />
                        )}
                      </CopyableCodeBtn>
                    </ColorCodeRow>

                    <ColorMetaRow>
                      <MetaLabel>Luminance</MetaLabel>
                      <MetaValue>{luminance.toFixed(3)}</MetaValue>
                    </ColorMetaRow>
                  </PaletteCardFooter>
                </PaletteColorCard>
              );
            })}
          </PaletteCardsGrid>
        )}
      </PaletteGridSection>
    </PaletteViewContainer>
  );
}

export default PaletteManager;
