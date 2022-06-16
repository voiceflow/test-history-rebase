import Flex from '@ui/components/Flex';
import { css, styled, transition, units } from '@ui/styles';

import * as T from './types';

export const getSimpleStyles = ({
  isVertical,
  theme,
  width = isVertical ? 1 : '100%',
  height = isVertical ? '100%' : 1,
  offset = units(1.5)({ theme }),
  isSecondaryColor,
}: T.SimpleProps) => css`
  ${transition('background-color')};

  width: ${typeof width === 'number' ? `${width}px` : width};
  height: ${typeof height === 'number' ? `${height}px` : height};
  margin: ${isVertical ? `0 ${offset}px` : `${offset}px 0`};
  background-color: ${isSecondaryColor ? theme.colors.separatorSecondary : theme.colors.separator};
`;

export const Simple = styled.div`
  ${getSimpleStyles}
`;

export const LabeledHorizontal = styled(Flex)<T.LabeledHorizontalProps>`
  margin-bottom: 12px;

  ${({ isLast }) =>
    isLast &&
    css`
      margin-bottom: 0;
      margin-top: 12px;
    `}

  font-size: 13px;
  font-weight: 500;
  color: #8da2b5;
  white-space: nowrap;

  &::before,
  &::after {
    ${getSimpleStyles};

    display: block;
    content: '';
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;
