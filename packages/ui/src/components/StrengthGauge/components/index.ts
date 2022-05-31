import { css, styled, transition } from '@ui/styles';

import TippyTooltip from '../../TippyTooltip';
import { Level } from '../constants';

export const StrengthColor: Record<Level, string> = {
  [Level.NOT_SET]: '',
  [Level.WEAK]: '#bd425f',
  [Level.MEDIUM]: '#4e8bbd',
  [Level.STRONG]: '#50a82e',
  [Level.VERY_STRONG]: '#449127',
};

export const Container = styled(TippyTooltip)`
  display: flex !important;
  align-items: center;
`;

export const Line = styled.div<{ width: number; thickness: number }>`
  background: #dfe3ed;
  display: inline-block;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  margin: 2px 0;

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

export const StrengthLine = styled.div<{ width: number; strength: Level; thickness: number }>`
  ${transition('width')}
  width: 0;
  position: absolute;
  left: 0;
  ${({ width, strength, thickness }) =>
    css`
      width: ${width}px;
      background: ${StrengthColor[strength]};
      height: ${thickness}px;
    `}
`;
