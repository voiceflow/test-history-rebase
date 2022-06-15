import { css, styled, transition } from '@ui/styles';
import { Spin } from '@ui/styles/animations/Spin';
import _isNumber from 'lodash/isNumber';
import { space, SpaceProps } from 'styled-system';

import { Variant } from './constants';

export interface ContainerProps extends SpaceProps {
  size: number | string;
  color: string;
  spin?: boolean;
  width?: number | string;
  height?: number | string;
  inline?: boolean;
  variant?: Variant;
  rotation?: number;
  clickable?: boolean;
  transition?: string | string[];
  ignoreEvents?: boolean;
}

export const Container = styled.span<ContainerProps>`
  ${space}
  ${transition('opacity', 'background', 'color', 'transform')}

  box-sizing: content-box;
  width: ${({ size, width = size }) => width}px;
  height: ${({ size, height = size }) => height}px;
  color: ${({ theme, color, variant }) => (variant && theme.components.icon[variant]?.color) || color};
  background: transparent;

  ${({ theme, transition }) => transition && theme.transition(...(typeof transition === 'string' ? [transition] : transition))}
  ${({ rotation }) =>
    _isNumber(rotation) &&
    css`
      transform: rotate(${rotation}deg);
    `}

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

  ${({
    theme: {
      components: { icon },
    },
    color,
    variant,
    clickable,
  }) => {
    if (!variant) return null;

    const iconVariant = icon[variant];

    return css`
      &:hover {
        color: ${iconVariant?.hoverColor || color};
      }

      &:active {
        /* stylelint-disable-next-line value-keyword-case */
        color: ${variant === Variant.STANDARD && clickable ? '#132144' : iconVariant?.activeColor || iconVariant?.hoverColor || color};
      }
    `;
  }}

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
    `}
`;
