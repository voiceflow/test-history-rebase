import _isString from 'lodash/isString';

import { css, styled } from '@/hocs';
import { Spin } from '@/styles/animations/Spin';

const SvgIconContainer = styled.span`
  ${({ theme, transition }) => transition && theme.transition(...(_isString(transition) ? [transition] : transition))}
  box-sizing: content-box;
  width: ${({ size, width = size }) => width}px;
  height: ${({ size, height = size }) => height}px;
  color: ${({ color }) => color};

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

  ${({ variant, activeColor, hoverColor, color }) =>
    variant &&
    css`
      &:hover {
        color: ${hoverColor || color};
      }

      &:active {
        color: ${activeColor || hoverColor || color};
      }
    `}
`;

export default SvgIconContainer;
