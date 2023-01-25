import { ClickableText } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(ClickableText)`
  align-items: center;
  height: 68px;
  display: flex;
  width: auto;

  &:hover {
    text-decoration: underline;
  }

  b {
    text-decoration: underline;
  }
`;
