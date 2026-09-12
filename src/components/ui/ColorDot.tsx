import styled from "styled-components";

export interface ColorDotProps {
  $color: string;
  $size?: number;
}

export const ColorDot = styled.span<ColorDotProps>`
  width: ${({ $size = 8 }) => `${$size}px`};
  height: ${({ $size = 8 }) => `${$size}px`};
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  display: inline-block;
`;

export default ColorDot;
