import { css, styled } from '@ui/styles';

import { StrengthLevel } from '../types';

const StrengthLineColor: Record<StrengthLevel, string> = {
  [StrengthLevel.NOT_SET]: '',
  [StrengthLevel.WEAK]: '#bd425f',
  [StrengthLevel.MEDIUM]: '#4e8bbd',
  [StrengthLevel.STRONG]: '#50a82e',
  [StrengthLevel.VERY_STRONG]: '#449127',
};

export const Line = styled.div<{ width: number; thickness: number }>`
  background: #dfe3ed;
  display: inline-block;
  position: relative;
  border-radius: 5px;
  overflow: hidden;

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ thickness }) =>
    thickness &&
    css`
      height: ${thickness}px;
    `}
`;

export const StrengthLine = styled.div<{ width: number; strength: StrengthLevel; thickness: number }>`
  position: absolute;
  left: 0;
  ${({ width, strength, thickness }) =>
    css`
      width: ${width}px;
      background: ${StrengthLineColor[strength]};
      height: ${thickness}px;
    `}
`;
