import { IconButtonVariant } from '@ui/components';
import { BaseContainerProps } from '@ui/components/IconButton/components/IconButtonContainer';
import { css, styled } from '@ui/styles';

export interface BasicContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.BASIC;
  containerSize?: number;
  activeHover?: boolean;
  activeClick?: boolean;
}

const activeHoverStyle = css`
  background: #eef4f6;
  opacity: 1;
`;

const BasicContainer = styled.div<BasicContainerProps>`
  ${({ containerSize = 10 }) => css`
    padding: ${containerSize}px;
    margin: -${containerSize}px;
  `}
  color: #8da2b5;
  transition: background 0.2s ease;
  background: transparent;

  opacity: 0.8;
  border-radius: 6px;
  cursor: pointer;

  &:hover,
  &:active {
    ${activeHoverStyle}
  }

  &:active {
    color: #132144;
  }

  ${({ activeHover }) =>
    activeHover &&
    css`
      ${activeHoverStyle}
    `}

  ${({ activeClick }) =>
    activeClick &&
    css`
      ${activeHoverStyle}
      color: #132144;
    `}
`;

export default BasicContainer;
