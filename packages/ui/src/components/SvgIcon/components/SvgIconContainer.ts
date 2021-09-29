import _isNumber from 'lodash/isNumber';
import { space, SpaceProps } from 'styled-system';

import { IconVariant } from '../../../constants';
import { css, styled, transition } from '../../../styles';
import { Spin } from '../../../styles/animations/Spin';

export type SvgIconContainerProps = {
  size: number | string;
  color: string;
  spin?: boolean;
  width?: number | string;
  height?: number | string;
  variant?: IconVariant;
  clickable?: boolean;
  transition?: string | string[];
  ignoreEvents?: boolean;
  inline?: boolean;
  rotation?: number;
  enableOpacity?: boolean;
} & SpaceProps;

const SvgIconContainer = styled.span<SvgIconContainerProps>`
  ${space}
  box-sizing: content-box;
  width: ${({ size, width = size }) => width}px;
  height: ${({ size, height = size }) => height}px;
  color: ${({ theme, color, variant }) => (variant && theme.components.icon[variant]?.color) || color};

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
      ${transition('opacity', 'color')}

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
        color: ${variant === IconVariant.STANDARD && clickable ? '#132144' : iconVariant?.activeColor || iconVariant?.hoverColor || color};
      }
    `;
  }}

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
    `}

  ${({ enableOpacity }) =>
    enableOpacity &&
    css`
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    `}
`;

export default SvgIconContainer;
