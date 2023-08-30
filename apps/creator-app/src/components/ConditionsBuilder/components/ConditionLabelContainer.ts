import { Box } from '@voiceflow/ui';

import { statementIcon, subStatementIcon } from '@/assets';
import { css, styled } from '@/hocs/styled';

const ConditionLabelContainer = styled(Box.FlexCenter)<{ isOpen?: boolean; secondary?: boolean; hasCaret?: boolean }>`
  width: 85px;
  height: 43px;

  ${({ hasCaret }) =>
    hasCaret
      ? css`
          padding-right: 25px;
          padding-left: 20px;
        `
      : css`
          padding-right: 10px;
        `}
  font-weight: 600;
  background-image: url(${statementIcon});

  ${({ secondary }) =>
    secondary &&
    css`
      background-image: url(${subStatementIcon});
      cursor: pointer;
      justify-content: space-around;
      color: ${({ theme }) => theme.colors.secondary};
    `}

  ${({ isOpen, secondary }) =>
    isOpen &&
    secondary &&
    css`
      color: ${({ theme }) => theme.colors.primary};
    `}
`;

export default ConditionLabelContainer;
