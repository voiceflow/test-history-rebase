import { css, styled, transition } from '@ui/styles';
import { spinReverseStyle, spinStyle } from '@ui/styles/animations/Spin';
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
  active?: boolean;
  hovered?: boolean;
  opacity?: boolean;
  variant?: Variant;
  rotation?: number;
  clickable?: boolean;
  transition?: string | string[];
  spinReverse?: boolean;
  ignoreEvents?: boolean;
  reducedOpacity?: boolean;
}

const DEFAULT_OPACITY = 0.85;
const REDUCED_OPACITY = 0.65;

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
      ${spinStyle}
    `}

  ${({ spinReverse }) =>
    spinReverse &&
    css`
      display: block;
      ${spinReverseStyle}
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

  ${({ opacity, reducedOpacity }) =>
    opacity &&
    css`
      opacity: ${reducedOpacity ? REDUCED_OPACITY : DEFAULT_OPACITY};
    `}

  ${({ clickable, reducedOpacity }) =>
    clickable &&
    css`
      display: block;
      cursor: pointer;
      opacity: ${reducedOpacity ? REDUCED_OPACITY : DEFAULT_OPACITY};

      &:hover {
        opacity: ${reducedOpacity ? DEFAULT_OPACITY : 1};
      }

      &:active {
        opacity: 1;
      }
    `}

  ${({ theme, variant, hovered, color, clickable, reducedOpacity }) => {
    if (!hovered) return null;

    const clickableStyle =
      clickable &&
      css`
        opacity: ${reducedOpacity ? DEFAULT_OPACITY : 1};
      `;

    if (!variant) return clickableStyle;

    const iconVariant = theme.components.icon[variant];

    return css`
      ${clickableStyle}
      color: ${iconVariant?.hoverColor || color};
    `;
  }}

  ${({ theme, color, active, variant, clickable }) => {
    if (!variant) return null;

    const iconVariant = theme.components.icon[variant];

    const activeStyle = css`
      color: ${variant === Variant.STANDARD && clickable ? '#132144' : iconVariant?.activeColor || iconVariant?.hoverColor || color};
      opacity: 1;
    `;

    return active
      ? activeStyle
      : css`
          &:hover {
            color: ${iconVariant?.hoverColor || color};
          }

          &:active {
            ${activeStyle}
          }
        `;
  }}

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
    `}
`;
