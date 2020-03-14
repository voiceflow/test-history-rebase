import ButtonContainer from '@/components/Button/components/ButtonContainer';
import { css, styled, transition } from '@/hocs';

import { importantStyles } from '../styles';
import { IconButtonVariant } from '../types';

export type ContainerProps = {
  large?: boolean;
  active?: boolean;
  variant?: IconButtonVariant;
};

const SIZE = {
  small: 34,
  large: 42,
};

const activeStyle = css`
  ${importantStyles}

  border: 1px solid #fff;
  color: #5b9dfa !important;
  box-shadow: 0 0 0 1px #5b9dfa99 !important;
`;

const Container = styled(ButtonContainer)<ContainerProps>`
  border: 0;
  background-color: #fff;
  border: 1px solid transparent;
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
          color: rgba(110, 132, 154, 0.8);
          box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);

          &:hover {
            color: rgba(110, 132, 154, 1);
          }
        `}

  &:active {
    ${activeStyle}
  }

  ${({ active }) => active && activeStyle}
`;

export default Container;
