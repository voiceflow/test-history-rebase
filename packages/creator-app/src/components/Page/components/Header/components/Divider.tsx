import React from 'react';

import { css, styled } from '@/hocs/styled';

interface DividerProps {
  offset?: boolean | [left: boolean, right: boolean];
  isSmall?: boolean;
  secondary?: boolean;
}

const OFFSET = 18;
const SMALL_OFFSET = 9;

const getMargin = ({ offset, isSmall }: DividerProps) => {
  if (!offset) {
    return css`
      margin: 0;
    `;
  }

  const margin = isSmall ? SMALL_OFFSET : OFFSET;

  if (Array.isArray(offset)) {
    return css`
      margin-left: ${Number(offset[0] && margin)}px;
      margin-right: ${Number(offset[1] && margin)}px;
    `;
  }

  return css`
    margin-left: ${margin}px;
    margin-right: ${margin}px;
  `;
};

const Divider = styled(({ offset, secondary, isSmall, ...props }) => <div {...props} />)<DividerProps>`
  ${getMargin};
  width: 1px;
  height: ${({ isSmall }) => (isSmall ? '24px' : '100%')};
  background: ${({ theme, secondary }) => (secondary ? theme.colors.separatorSecondary : theme.colors.separator)};
`;

export default Divider;
