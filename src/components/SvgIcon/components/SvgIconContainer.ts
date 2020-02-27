import _isString from 'lodash/isString';

import { IconVariant } from '@/constants';
import { css, styled } from '@/hocs';
import { Spin } from '@/styles/animations/Spin';

export type SvgIconContainerProps = {
  size: number | string;
  color: string;
  spin?: boolean;
  width?: number | string;
  height?: number | string;
  variant?: IconVariant;
  clickable?: boolean;
  transition?: string;
  ignoreEvents?: boolean;
};

const SvgIconContainer = styled.span<SvgIconContainerProps>`
  ${({ theme, transition }) => transition && theme.transition(...(_isString(transition) ? [transition] : transition))}

  box-sizing: content-box;
  width: ${({ size, width = size }) => width}px;
  height: ${({ size, height = size }) => height}px;
  color: ${({ theme, color, variant }) => (variant && theme.components.icon[variant].color) || color};

  ${({ spin }) =>
    spin &&
    css`
      display: block;
      ${Spin}
    `}

  ${({ ignoreEvents }) =>
    ignoreEvents &&
    css`
      pointer-events: none;
    `}

  & > svg {
    display: block;
    width: inherit;
    height: inherit;
  }

  ${({ clickable }) =>
    clickable &&
    css`
      display: block;
      cursor: pointer;
      opacity: 0.8;

      &:hover,
      &:active {
        opacity: 1;
      }
    `}

  ${({ theme, variant, color }) =>
    variant &&
    css`
      &:hover {
        color: ${theme.components.icon[variant].hoverColor || color};
      }

      &:active {
        color: ${theme.components.icon[variant].activeColor || theme.components.icon[variant].hoverColor || color};
      }
    `}
`;

export default SvgIconContainer;
