import ButtonContainer from '@/components/Button/components/ButtonContainer';
import { css, styled, transition } from '@/hocs';

import { importantStyles } from '../styles';
import { IconButtonVariant } from '../types';

export type ContainerProps = {
  large?: boolean;
  active?: boolean;
  variant?: IconButtonVariant;
  preventFocusStyle?: boolean;
};

const SIZE = {
  small: 34,
  large: 42,
};

const activeStyle = css`
  ${importantStyles}

  border: 1px solid #fff;
  color: #5d9df5;
  box-shadow: 0 0 0 1px #5b9dfa99 !important;
`;

const Container = styled(ButtonContainer)<ContainerProps>`
  border: 0;
  background-color: #fff;
  position: relative;
  background-size: cover;

  border: 1px solid transparent;
  z-index: 1;
  ${transition('box-shadow', 'color')}

  height: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};
  width: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};

  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
        `
      : css`
          &:hover {
            box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 6px 0 rgba(17, 49, 96, 0.24);
          }
        `}

  ${({ variant }) =>
    variant === 'flat'
      ? css`
          color: #8da2b5;
          background: inherit;
        `
      : css`
          color: rgba(110, 132, 154, 0.75);
          box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);

          &:hover:not(&:active) {
            color: rgba(110, 132, 154, 1);
          }
        `}

  &:active {
    ${activeStyle}
  }

  ${({ active }) => active && activeStyle}

  ${({ variant }) =>
    (variant === IconButtonVariant.SUCCESS || variant === IconButtonVariant.ACTION) &&
    css`
      &::before {
        content: '';
        position: absolute;
        z-index: -1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        border-radius: 50%;
        background: linear-gradient(180deg, rgba(93, 157, 245, 0.04) 0%, rgba(44, 133, 255, 0.12) 100%);
        -webkit-transition: opacity 0.12s linear, -webkit-box-shadow 0.12s linear;
        transition: opacity 0.12s linear, -webkit-box-shadow 0.12s linear;
      }
      &:hover::before {
        opacity: 1;
      }

      &:active::before {
        opacity: 1;
        box-shadow: inset 0 0 0 1px #fff;
      }
    `}
`;

export default Container;
