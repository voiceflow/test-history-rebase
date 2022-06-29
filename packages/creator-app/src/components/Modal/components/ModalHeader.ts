import { flexApartStyles, SvgIcon } from '@voiceflow/ui';

import { css, styled, units } from '@/hocs';

const ModalHeader = styled.header<{ headerBorder?: boolean; capitalizeText?: boolean }>`
  ${flexApartStyles}

  ${({ headerBorder }) =>
    headerBorder &&
    css`
      border-bottom: 1px solid #eaeff4;
    `}
  width: 100%;
  padding: ${units(2.5)}px ${units(4)}px;
  color: #132144;
  font-weight: 600;

  ${({ capitalizeText = true }) =>
    capitalizeText &&
    css`
      text-transform: capitalize;
    `}

  position: relative;
  z-index: 1;

  ${SvgIcon.Container} {
    cursor: pointer;
  }
`;

export default ModalHeader;
