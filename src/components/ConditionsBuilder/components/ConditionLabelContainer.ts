import { statementIcon, subStatementIcon } from '@/assets';
import { FlexCenter } from '@/components/Box';
import { css, styled } from '@/hocs';

const ConditionLabelContainer = styled(FlexCenter)<{ isOpen?: boolean; secondary?: boolean }>`
  width: 85px;
  height: 42px;
  padding: 0 18px 0 8px;
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
