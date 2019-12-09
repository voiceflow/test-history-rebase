import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';
import { BUTTON_HEIGHT } from '@/componentsV2/Button/styles';
import { css, styled, transition } from '@/hocs';

import { importantStyles } from '../styles';

export const SIZE = {
  small: 36,
  large: 42,
};

const activeStyle = css`
  ${importantStyles}

  border: 1px solid #fff;
  color: #5b9dfa;
  box-shadow: 0 0 0 1px #5b9dfa99 !important;
`;

const IconButtonContainer = styled(ButtonContainer)`
  width: ${BUTTON_HEIGHT}px;
  border: 0;
  color: #8da2b5;
  background-color: #fff !important;
  border: 1px solid transparent;
  transition: all 0.12s ease-out;
 
  height: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};
  width: ${({ large }) => (large ? `${SIZE.large}px` : `${SIZE.small}px`)};

  &:active {
    ${activeStyle}
  }

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
          background: inherit;
        `
      : css`
          box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);
          ${transition()}
        `}

  ${({ active }) => active && activeStyle}
`;

export default IconButtonContainer;
