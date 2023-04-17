import { Box, Button as UIButton, Input as UIInput, Popper, Text } from '@voiceflow/ui';
import styled from 'styled-components';

import { FadeDown } from '@/styles/animations';

export const OuterPopperContent = styled(Box.Flex)`
  ${FadeDown}
  ${Popper.baseStyles}

  flex-direction: column;
  max-width: 255px;
  box-sizing: border-box;

  align-items: flex-start;
  justify-content: flex-start;
`;

export const InnerPopperContent = styled(Box.Flex)<{ editing: boolean }>`
  flex-direction: column;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: flex-start;
  padding: ${({ editing }) => `20px 24px ${editing ? '20px' : '12px'}`};
`;

export const Label = styled(Text)`
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #62778c;
  margin-bottom: 10px;
  margin-top: 16px;
`;

export const Input = styled(UIInput)`
  min-height: 25px;
  font-size: 15px;
`;

export const Button = styled(UIButton)`
  width: 100%;
  border-radius: 8px;
`;
