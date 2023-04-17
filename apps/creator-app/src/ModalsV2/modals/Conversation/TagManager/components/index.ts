import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export { default as TagLineItem } from './TagLineItem';

export const Container = styled(Flex)`
  width: 100%;
  align-items: start;
`;

export const NewTagInputContainer = styled.div`
  border-bottom: 1px solid;
  padding: 16px 32px;
  padding-top: 0px;
  border-color: ${({ theme }) => theme.colors.borders};
`;

export const Content = styled.div`
  padding: 16px 32px;
  overflow: auto;
  max-height: calc(100vh - 350px);
`;
