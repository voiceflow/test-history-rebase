/* eslint-disable no-nested-ternary */
import { Box, Text } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const ConditionDisplayContainer = styled(Box.FlexApart)<{
  isActive?: boolean;
  isInvalid?: boolean;
  isLogicGroup?: boolean;
}>`
  border: ${({ isActive, theme, isInvalid }) =>
    `1px solid ${isInvalid ? theme.colors.red : isActive ? theme.colors.blue : '#d4d9e6'}`};
  border-radius: 5px;
  padding: 9px 0 9px 16px;
  position: relative;
  align-items: baseline;
  margin-left: 12px;
  flex-wrap: nowrap;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.06);
  max-width: ${({ isLogicGroup }) => `${isLogicGroup ? 255 : 316}px`};
  background-color: #fff;

  :hover {
    cursor: pointer;
  }

  ${Text} {
    margin-right: 5px;
  }
`;

export default ConditionDisplayContainer;
