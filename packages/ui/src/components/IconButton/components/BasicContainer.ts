import { css, styled, transition } from '@ui/styles';

import { IconButtonVariant } from '../types';
import { BaseContainerProps } from './IconButtonContainer';

export interface BasicContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.BASIC;
  activeHover?: boolean;
  activeClick?: boolean;
  transparent?: boolean;
  containerSize?: number;
  inline?: boolean;
}

const transparentHoverStyle = css`
  opacity: 1;
`;

const hoverStyle = css`
  background: #eef4f6;
  opacity: 1;
`;

const BasicContainer = styled.div<BasicContainerProps>`
  ${transition('background', 'opacity', 'color')};

  height: 36px;
  width: 36px;

  ${({ containerSize = 10 }) => css`
    padding: ${containerSize}px;
    margin: -${containerSize}px;
  `}

  color: #8da2b5;
  background: transparent;

  opacity: 0.8;
  border-radius: 6px;
  cursor: pointer;

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
