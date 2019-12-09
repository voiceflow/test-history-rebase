import styled, { css } from 'styled-components';

import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';

const TertiaryButton = styled(ButtonContainer)`
  border: 0;
  padding: 0 22px;
  font-weight: 600;
  color: #5d9df5;
  box-shadow: none;
  transition: all 0.15s ease-out;

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
