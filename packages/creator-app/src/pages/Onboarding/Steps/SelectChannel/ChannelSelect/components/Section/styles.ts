import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Label = styled(Flex)`
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  white-space: nowrap;

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    margin: 2px 0 0 12px;
    background: #eaeff4;
  }
`;

export const Container = styled.section`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Content = styled(Flex)`
  flex-wrap: wrap;
  gap: 20px;
`;
