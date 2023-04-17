import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(Box.Flex)`
  width: 490px;
  margin: 5px 12px 5px 20px;
`;

export const BuilderButton = styled(Box.Flex)<{ topLevel?: boolean }>`
  border-radius: 6px;
  padding: 10px;
  &:hover {
    background-color: rgba(238, 244, 246, 0.85);
  }

  ${({ topLevel }) =>
    topLevel &&
    css`
      align-self: start;
    `}
`;
