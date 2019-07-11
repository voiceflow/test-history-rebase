import styled, { css } from 'styled-components';

import ButtonContainer from 'componentsV2/Button/components/ButtonContainer';
import { BUTTON_HEIGHT } from 'componentsV2/Button/styles';

import { importantStyles } from '../styles';

const IconButtonContainer = styled(ButtonContainer)`
  width: ${BUTTON_HEIGHT}px;
  border: 0;
  opacity: 0.8;
  color: rgba(110, 132, 154, 0.85);
  background: #fff;

  ${({ variant }) =>
    variant === 'flat'
      ? css`
          background: inherit;
        `
      : css`
          box-shadow: 0px 2px 4px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.04);
        `}

  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
        `
      : css`
          &:hover {
            box-shadow: 0px 2px 6px rgba(17, 49, 96, 0.24), 0px 0px 0px rgba(17, 49, 96, 0.04);
          }
        `}

  &:active {
    ${importantStyles}

    border: 2px solid rgba(93, 157, 245, 0.85);
    color: rgba(93, 157, 245, 0.85);
    box-shadow: none;
    opacity: 0.8;
  }
`;

export default IconButtonContainer;
