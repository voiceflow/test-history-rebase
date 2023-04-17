import { Box } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const IconContainer = styled.div`
  border-radius: 50%;
  border: 1px solid #dfe3ed;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

export const Container = styled(Box)`
  ${transition()};
  padding: 12px 24px;
  background: transparent;
  cursor: pointer;
  :hover {
    background: #eef4f6;
  }
`;
