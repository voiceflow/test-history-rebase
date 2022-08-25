import { Box, Button, Input, Text } from '@voiceflow/ui';
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

  border-radius: 8px;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
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
