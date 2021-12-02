import { colors, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import { css, styled } from '@/hocs';

import { variableStyle, VariableTagContent, VariableTagWrapper } from './styles';

export const DEFAULT_SLOT_COLOR = '#5D9DF5';

export const slotStyles = css`
  ${variableStyle}

  padding-top: 0px;
  box-shadow: none;
  background-color: ${({ color = DEFAULT_SLOT_COLOR }) => color};
  color: ${colors(ThemeColor.WHITE)};
`;

const SlotTagWrapper = styled(VariableTagWrapper)`
  ${slotStyles}
  display: flex;
`;

interface SlotTagProps {
  color?: string | undefined;
  children: string;
  className?: string;
}

export const SlotTag = ({ children, color, className }: SlotTagProps): React.ReactElement => (
  <OverflowTippyTooltip title={`{${children}}`} style={{ display: 'block', overflow: 'hidden' }}>
    {(ref) => (
      <SlotTagWrapper color={color} className={className}>
        <span>{`{`}</span>
        <VariableTagContent ref={ref}>{children}</VariableTagContent>
        <span>{`}`}</span>
      </SlotTagWrapper>
    )}
  </OverflowTippyTooltip>
);
