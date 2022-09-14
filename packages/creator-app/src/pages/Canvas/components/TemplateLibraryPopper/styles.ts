import { Box, Button, Input, Popper, Text } from '@voiceflow/ui';
import styled from 'styled-components';

import { FadeDown } from '@/styles/animations';

export const Label = styled(Text)`
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #62778c;
  margin-bottom: 10px;
  margin-top: 16px;
`;

export const StyledInput = styled(Input)`
  min-height: 25px;
  font-size: 15px;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 8px;
`;

export const OuterPopperContent = styled(Box.Flex)`
  ${FadeDown}
  ${Popper.baseStyles}

  flex-direction: column;
  background-color: #fff;
  max-width: 255px;
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;

  align-items: flex-start;
  justify-content: flex-start;
`;

export const InnerPopperContent = styled(Box.Flex)`
  flex-direction: column;
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px 24px 8px 24px;
`;
