import styled, { css } from 'styled-components';

import ButtonContainer from '@/componentsV2/Button/components/ButtonContainer';

const CAPTIONED_ICON_BUTTON_HEIGHT = 60;

const CaptionedIconButtonContainer = styled(ButtonContainer)`
  height: ${CAPTIONED_ICON_BUTTON_HEIGHT}px;
  width: ${CAPTIONED_ICON_BUTTON_HEIGHT}px;
  flex-direction: column;
  color: #6e849a;
  transition: ease all 0.15s;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}

  &:hover {
    background: #eef4f6;
  }

  & > *:nth-child(1) {
    padding-bottom: 2px;
  }
  & > *:nth-last-child(1) {
    padding-top: 2px;
  }
`;

export default CaptionedIconButtonContainer;
