import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Flex)`
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid;

  border-color: ${({ theme }) => theme.colors.borders};
  padding: 20px 0px 16px 32px;
  background-color: ${({ theme }) => theme.backgrounds.white};
`;
