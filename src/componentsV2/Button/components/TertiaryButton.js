import styled, { css } from 'styled-components';

import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';

const TertiaryButton = styled(ButtonContainer)`
  border: 0;
  padding: 0 22px;
  color: #5d9df5;
  background: #fff;
  box-shadow: none;

  ${({ disabled }) =>
    disabled
      ? css`
          color: rgba(93, 157, 245, 0.5);
          pointer-events: none;
        `
      : css`
          &:hover {
            background: rgba(93, 157, 245, 0.1);
          }
        `}

  &:active {
    background: rgba(93, 157, 245, 0.16);
  }
`;

export default TertiaryButton;
