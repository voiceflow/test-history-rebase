import { colors, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs';

import { variableStyle } from './VariableTag';

export const DEFAULT_SLOT_COLOR = '#5D9DF5';

export const slotStyles = css`
  ${variableStyle}

  border: none;
  padding-top: 0px;
  margin-bottom: -1px;
  background-color: ${({ color = DEFAULT_SLOT_COLOR }) => color};
  color: ${colors(ThemeColor.WHITE)};
`;

const SlotTagWrapper = styled.span`
  ${slotStyles}
  display: flex;
  white-space: nowrap;
  overflow: hidden;
`;

const SlotTagContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SlotTagProps {
  color?: string | undefined;
  className?: string;
}

export const SlotTag: React.FC<SlotTagProps> = ({ children, color, className }) => (
  <SlotTagWrapper color={color} className={className}>
    <span>{`{`}</span>
    <SlotTagContent>{children}</SlotTagContent>
    <span>{`}`}</span>
  </SlotTagWrapper>
);
