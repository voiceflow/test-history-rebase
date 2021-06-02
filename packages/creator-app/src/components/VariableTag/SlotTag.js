import { css, styled } from '@/hocs';

import { variableStyle } from './VariableTag';

export const DEFAULT_SLOT_COLOR = '#5D9DF5';

export const slotStyles = css`
  ${variableStyle}

  border: none;
  padding-top: 0px;
  margin-bottom: -1px;
  background-color: ${({ color = DEFAULT_SLOT_COLOR }) => color};
  color: #fff;
`;

export const SlotTag = styled.span`
  ${slotStyles}

  &:before {
    content: '{';
  }

  &:after {
    content: '}';
  }
`;
