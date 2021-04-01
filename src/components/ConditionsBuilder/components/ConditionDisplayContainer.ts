/* eslint-disable no-nested-ternary */
import { FlexCenter } from '@/components/Box';
import Text from '@/components/Text';
import { styled } from '@/hocs';

const ConditionDisplayContainer = styled(FlexCenter)<{ isActive?: boolean; isInvalid?: boolean }>`
  border: ${({ isActive, theme, isInvalid }) => `1px solid ${isInvalid ? theme.colors.red : isActive ? theme.colors.blue : '#d4d9e6'}`};
  border-radius: 5px;
  padding: 9px 0 9px 16px;
  position: relative;
  align-items: baseline;
  margin-left: 16px;
  max-width: 320px;
  flex-wrap: nowrap;

  :hover {
    cursor: pointer;
  }

  ${Text} {
    margin-right: 5px;
  }
`;

export default ConditionDisplayContainer;
