import { flexCenterStyles } from '@ui/components/Flex';
import { css, styled, transition } from '@ui/styles';

import { IconButtonVariant } from '../types';
import { BaseContainerProps } from './IconButtonContainer';

export interface BasicContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.BASIC;
  inline?: boolean;
  offsetSize?: number;
  activeHover?: boolean;
  activeClick?: boolean;
  transparent?: boolean;
  containerSize?: number;
}

const transparentHoverStyle = css`
  opacity: 1;
`;

const hoverStyle = css`
  background: #eef4f6;
  opacity: 1;
`;

const BasicContainer = styled.button<BasicContainerProps>`
  ${flexCenterStyles};
  ${transition('background', 'opacity', 'color')};

  width: 36px;
  height: 36px;

  color: #8da2b5;
  background: transparent;
  border: none;

  opacity: 0.8;
  border-radius: 6px;
  cursor: pointer;

  ${({ containerSize = 10, offsetSize = containerSize }) => css`
    padding: ${containerSize}px;
    margin: -${offsetSize}px;
  `}

  &:hover,
  &:active {
    ${({ transparent }) => (transparent ? transparentHoverStyle : hoverStyle)}
  }

  &:active {
    color: #132144;
  }

  ${({ transparent, activeHover }) => activeHover && (transparent ? transparentHoverStyle : hoverStyle)}

  ${({ transparent, activeClick }) =>
    activeClick &&
    css`
      ${transparent ? transparentHoverStyle : hoverStyle}
      color: #132144;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      pointer-events: none !important;
    `}

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
    `}
`;

export default BasicContainer;
