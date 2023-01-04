import { ClickableText } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(ClickableText)`
  &:hover {
    text-decoration: underline;
  }

  b {
    text-decoration: underline;
  }
`;
