import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Flex)`
  color: #8da2b5;
  line-height: 20px;
  text-transform: lowercase;
  cursor: pointer;
`;

export const KeyBubble = styled.div`
  padding: 2px 8px 4px;
  border-radius: 8px;
  margin-right: 12px;
  background-color: #eef4f6;
  color: #62778c;
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  text-transform: lowercase;
`;
